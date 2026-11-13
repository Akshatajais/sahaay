import 'models.dart';

enum MedStatus { taken, upcoming, needsAttention }

String todayKey([DateTime? date]) {
  final value = date ?? DateTime.now();
  final month = value.month.toString().padLeft(2, '0');
  final day = value.day.toString().padLeft(2, '0');
  return '${value.year}-$month-$day';
}

DateTime atTimeToday(String hhmm, DateTime now) {
  final parts = hhmm.split(':');
  final hour = int.tryParse(parts.first) ?? 0;
  final minute = parts.length > 1 ? int.tryParse(parts[1]) ?? 0 : 0;
  return DateTime(now.year, now.month, now.day, hour, minute);
}

int minutesOf(String hhmm) {
  final parts = hhmm.split(':');
  final hour = int.tryParse(parts.first) ?? 0;
  final minute = parts.length > 1 ? int.tryParse(parts[1]) ?? 0 : 0;
  return hour * 60 + minute;
}

bool takenToday(Medicine medicine, DateTime now) {
  if (medicine.takenAt == null) return false;
  return todayKey(DateTime.parse(medicine.takenAt!)) == todayKey(now);
}

MedStatus statusOf(Medicine medicine, DateTime now) {
  if (medicine.slot == 'morning') return MedStatus.taken;
  if (medicine.slot == 'night') return MedStatus.upcoming;
  return MedStatus.needsAttention;
}

int compareMedicine(Medicine a, Medicine b) => a.time.compareTo(b.time);

Medicine? priorityMedicine(List<Medicine> list, DateTime now) {
  final ranked = [...list]..sort(compareMedicine);
  for (final medicine in ranked) {
    if (statusOf(medicine, now) == MedStatus.needsAttention) return medicine;
  }
  for (final medicine in ranked) {
    if (statusOf(medicine, now) == MedStatus.upcoming) return medicine;
  }
  return null;
}

Medicine? nextOpenMedicine(List<Medicine> list, String? exceptId, DateTime now) {
  final open = list.where((item) => item.id != exceptId && statusOf(item, now) != MedStatus.taken).toList()
    ..sort(compareMedicine);
  return open.isEmpty ? null : open.first;
}

int completedCount(List<Medicine> list, DateTime now) {
  return list.where((item) => statusOf(item, now) == MedStatus.taken).length;
}

bool isDueMedicine(Medicine medicine, DateTime now) {
  if (takenToday(medicine, now) || medicine.remindAt == null) return false;
  if (medicine.promptedKey == medicine.remindAt) return false;
  final at = DateTime.parse(medicine.remindAt!);
  if (todayKey(at) != todayKey(now)) return false;
  return !at.isAfter(now);
}

bool habitDoneToday(Habit habit, DateTime now) => habit.doneOn == todayKey(now);

bool isDueHabit(Habit habit, DateTime now) {
  if (habitDoneToday(habit, now) || habit.remindAt == null) return false;
  if (habit.promptedKey == habit.remindAt) return false;
  final at = DateTime.parse(habit.remindAt!);
  if (todayKey(at) != todayKey(now)) return false;
  return !at.isAfter(now);
}

bool isInQuiet(DateTime date, Settings settings) {
  if (!settings.quietHours) return false;
  final mins = date.hour * 60 + date.minute;
  final start = minutesOf(settings.quietStart);
  final end = minutesOf(settings.quietEnd);
  if (start == end) return false;
  if (start < end) return mins >= start && mins < end;
  return mins >= start || mins < end;
}

({DateTime at, bool delayed}) shiftOutOfQuiet(DateTime from, Settings settings) {
  if (!isInQuiet(from, settings)) return (at: from, delayed: false);
  final end = minutesOf(settings.quietEnd);
  var at = DateTime(from.year, from.month, from.day, end ~/ 60, end % 60);
  if (!at.isAfter(from)) at = at.add(const Duration(days: 1));
  return (at: at, delayed: true);
}

Localized greeting(DateTime now) {
  final hour = now.hour;
  if (hour < 12) return const Localized('Good morning', 'सुप्रभात');
  if (hour < 17) return const Localized('Good afternoon', 'नमस्कार');
  if (hour < 21) return const Localized('Good evening', 'शुभ संध्या');
  return const Localized('Good night', 'शुभ रात्रि');
}

String profileName(String nameEn, String nameHi, bool hindi) {
  if (hindi) return nameHi.trim().isEmpty ? (nameEn.trim().isEmpty ? 'अम्मा' : nameEn.trim()) : nameHi.trim();
  return nameEn.trim().isEmpty ? (nameHi.trim().isEmpty ? 'Amma' : nameHi.trim()) : nameEn.trim();
}

String formatRupees(int amount) {
  final digits = amount.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    final fromEnd = digits.length - i;
    if (i > 0 && (fromEnd == 3 || (fromEnd > 3 && (fromEnd - 3) % 2 == 0))) buffer.write(',');
    buffer.write(digits[i]);
  }
  return '${amount < 0 ? '-' : ''}₹$buffer';
}

String formatHm(String hhmm, bool hindi) => formatClock(atTimeToday(hhmm, DateTime.now()), hindi);

String formatClock(DateTime date, bool hindi) {
  final hour = date.hour % 12 == 0 ? 12 : date.hour % 12;
  final minute = date.minute.toString().padLeft(2, '0');
  final suffix = date.hour < 12 ? (hindi ? 'am' : 'am') : (hindi ? 'pm' : 'pm');
  return '$hour:$minute $suffix';
}

String formatWhen(String iso, bool hindi) {
  final date = DateTime.parse(iso).toLocal();
  final now = DateTime.now();
  final clock = formatClock(date, hindi);
  if (todayKey(date) == todayKey(now)) return hindi ? 'आज, $clock' : 'Today, $clock';
  final yesterday = now.subtract(const Duration(days: 1));
  if (todayKey(date) == todayKey(yesterday)) return hindi ? 'कल, $clock' : 'Yesterday, $clock';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '${date.day} ${months[date.month - 1]} ${date.year}';
}

String uid() => DateTime.now().microsecondsSinceEpoch.toRadixString(16);

Localized familyCallMessage(String name) {
  final first = name.trim().split(RegExp(r'\s+')).first;
  return Localized(
    'Hi $first, Mother is trying to call. Please reach out.',
    'नमस्ते $first, माँ कॉल करने की कोशिश कर रही हैं। कृपया संपर्क करें।',
  );
}

Localized familyCheckMessage(String name) {
  final first = name.trim().split(RegExp(r'\s+')).first;
  return Localized(
    'Hi $first, Sahaay noticed that Mom has missed her medicines for 2 days. Please check on her.',
    'नमस्ते $first, Sahaay ने देखा है कि माँ ने 2 दिन से दवा नहीं ली। कृपया उन पर ध्यान दें।',
  );
}

Localized sosFamilyAlert() => const Localized(
      'Emergency SOS: Mother needs immediate help. Please reach out.',
      'आपातकालीन एसओएस: माँ को तुरंत मदद चाहिए। कृपया संपर्क करें।',
    );

Localized assistFamilyMessage(Localized need) => Localized('Assistance request: ${need.en}', 'सहायता अनुरोध: ${need.hi}');

Localized familyRespondedNote() => const Localized(
      'Priya is responding to the emergency SOS and is on the way.',
      'प्रिया आपातकालीन एसओएस का जवाब दे रही है और रास्ते में है।',
    );

Localized medicineSaved(String name) => Localized('$name marked as taken.', '$name ले ली गई, ऐसा दर्ज हुआ।');

Localized reminderSet(DateTime at, bool delayed) {
  final en = formatWhen(at.toIso8601String(), false);
  final hi = formatWhen(at.toIso8601String(), true);
  if (delayed) {
    return Localized('Quiet hours are on, so the reminder is set for $en.', 'शांत घंटे चालू हैं, इसलिए याद $hi पर रखी गई है।');
  }
  return Localized('Reminder set for $en.', 'याद $hi के लिए रखी गई है।');
}

Localized familyMedicineNote(String medicineName, String people) => Localized(
      '$medicineName is still not marked taken. A note is saved on this device for $people. Nothing was sent to their phones.',
      '$medicineName अभी तक ले ली गई दर्ज नहीं है। $people के लिए नोट इस डिवाइस पर सहेजा गया है। उनके फ़ोन पर कुछ नहीं भेजा गया।',
    );

String portraitFor(String relation, String name) {
  final who = name.toLowerCase();
  if (who.contains('priya')) return 'assets/people/priya.png';
  if (who.contains('ravi') || who.contains('rahul')) return 'assets/people/ravi.png';
  if (who.contains('anita')) return 'assets/people/anita.png';
  if (relation == 'daughter') return 'assets/people/priya.png';
  if (relation == 'son') return 'assets/people/ravi.png';
  if (relation == 'sister') return 'assets/people/anita.png';
  if (relation == 'brother') return 'assets/people/ravi.png';
  return name.length.isEven ? 'assets/people/priya.png' : 'assets/people/ravi.png';
}

const pillById = {
  'med-morning': 'assets/icons/pill-pink.png',
  'med-morning-aspirin': 'assets/icons/pill-white.png',
  'med-afternoon': 'assets/icons/pill-green.png',
  'med-afternoon-d3': 'assets/icons/pill-yellow.png',
  'med-night': 'assets/icons/pill-lilac.png',
};

String pillFor(String id) => pillById[id] ?? 'assets/icons/pill-white.png';
