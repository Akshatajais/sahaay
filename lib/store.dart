import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'logic.dart';
import 'models.dart';
import 'l10n.dart';

const storageKey = 'sahaay-demo-v1';

class AppNotice {
  final int id;
  final Localized text;
  const AppNotice(this.id, this.text);
}

class ReminderPrompt {
  final String kind;
  final String id;
  const ReminderPrompt(this.kind, this.id);
}

AppData seed() {
  final taken = DateTime.now().toIso8601String();
  Medicine med(String id, String name, String slot, String time, String? takenAt) => Medicine(
        id: id,
        name: name,
        slot: slot,
        time: time,
        takenAt: takenAt,
      );
  String daysAgo(int days, int hours) {
    final date = DateTime.now().subtract(Duration(days: days));
    return DateTime(date.year, date.month, date.day, hours, 15).toIso8601String();
  }

  return AppData(
    settings: const Settings(
      language: 'en',
      textSize: 'default',
      sound: true,
      vibration: true,
      voiceGuidance: false,
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '07:00',
      sharePayments: false,
    ),
    nameEn: 'Amma',
    nameHi: 'अम्मा',
    medicines: [
      med('med-morning', 'Amlodipine', 'morning', '08:00', taken),
      med('med-morning-aspirin', 'Aspirin', 'morning', '08:00', taken),
      med('med-afternoon', 'Metformin', 'afternoon', '14:00', null),
      med('med-afternoon-d3', 'Vitamin D3', 'afternoon', '14:00', null),
      med('med-night', 'Atorvastatin', 'night', '20:00', null),
    ],
    habits: const [
      Habit(id: 'water', time: '09:00'),
      Habit(id: 'walk', time: '07:30'),
      Habit(id: 'stretch', time: '17:00'),
      Habit(id: 'rest', time: '21:00'),
    ],
    contacts: const [
      Contact(id: 'priya', name: 'Priya Sharma', relation: 'daughter', phone: '+91 98765 43210', upiId: 'priya.demo@oksbi', notifyMedicine: true, notifyPayment: true, notifySos: true),
      Contact(id: 'ravi', name: 'Ravi Kumar', relation: 'son', phone: '+91 98765 11111', upiId: 'ravi.demo@okhdfc', notifyMedicine: true, notifyPayment: false, notifySos: true),
      Contact(id: 'anita', name: 'Anita Desai', relation: 'sister', phone: '+91 98765 22222', upiId: 'anita.demo@okaxis', notifyMedicine: false, notifyPayment: false, notifySos: true),
    ],
    transactions: [
      Transaction(id: 'seed-paid', direction: 'sent', contactId: 'ravi', name: 'Ravi Kumar', amount: 500, createdAt: daysAgo(1, 12), status: 'success', reason: 'demo'),
      Transaction(id: 'seed-failed', direction: 'sent', contactId: 'priya', name: 'Priya Sharma', amount: 200, createdAt: daysAgo(3, 16), status: 'failed', reason: 'demo'),
      Transaction(id: 'seed-pending', direction: 'sent', contactId: 'anita', name: 'Anita Desai', amount: 150, createdAt: daysAgo(0, 18), status: 'pending', reason: 'demo'),
    ],
    notices: [
      Notice(
        id: 'seed-family',
        kind: 'family',
        title: const Localized('Priya left a note', 'प्रिया ने एक संदेश छोड़ा'),
        body: const Localized(
          'Priya asked you to call when you are free. This note is saved on this device only.',
          'प्रिया ने कहा है कि जब आप खाली हों तो कॉल करें। यह संदेश केवल इस डिवाइस पर सहेजा है।',
        ),
        createdAt: daysAgo(0, 11),
        read: false,
        href: 'family',
      ),
    ],
    familyThreads: const [],
  );
}

class AppStore extends ChangeNotifier {
  AppData data = seed();
  DateTime now = DateTime.now();
  AppNotice? banner;
  ReminderPrompt? prompt;
  Timer? _clock;
  Timer? _bannerTimer;
  bool _ready = false;

  bool get hindi => data.settings.language == 'hi';
  double get textScale => switch (data.settings.textSize) { 'large' => 20 / 18, 'larger' => 22 / 18, _ => 1.0 };

  String t(Localized text) => text.of(hindi);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(storageKey);
    if (raw != null) {
      try {
        final parsed = AppData.fromJson(jsonDecode(raw) as Map<String, dynamic>);
        final demoIds = seed().medicines.map((item) => item.id).toList()..sort();
        final storedIds = parsed.medicines.map((item) => item.id).toList()..sort();
        data = storedIds.join() == demoIds.join() ? parsed : parsed.copyWith(medicines: seed().medicines);
      } catch (_) {
        data = seed();
      }
    }
    _ready = true;
    _clock ??= Timer.periodic(const Duration(seconds: 30), (_) => _tick());
    Timer.periodic(const Duration(seconds: 15), (_) => _lookForDue());
    notifyListeners();
    _lookForDue();
  }

  Future<void> _save() async {
    if (!_ready) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(storageKey, jsonEncode(data.toJson()));
  }

  void _tick() {
    now = DateTime.now();
    notifyListeners();
  }

  void _update(AppData next) {
    data = next;
    notifyListeners();
    _save();
  }

  void _feedback() {
    if (data.settings.sound) SystemSound.play(SystemSoundType.click);
    if (data.settings.vibration) HapticFeedback.lightImpact();
  }

  void showBanner(Localized text) {
    _bannerTimer?.cancel();
    final id = DateTime.now().millisecondsSinceEpoch;
    banner = AppNotice(id, text);
    notifyListeners();
    _bannerTimer = Timer(const Duration(seconds: 12), () {
      if (banner?.id == id) {
        banner = null;
        notifyListeners();
      }
    });
  }

  void dismissBanner() {
    banner = null;
    notifyListeners();
  }

  void dismissPrompt() {
    prompt = null;
    notifyListeners();
  }

  void setLanguage(String language) {
    _update(data.copyWith(settings: data.settings.copyWith(language: language)));
    _feedback();
  }

  void setTextSize(String size) {
    _update(data.copyWith(settings: data.settings.copyWith(textSize: size)));
  }

  void updateSettings(Settings settings) => _update(data.copyWith(settings: settings));

  void updateProfile({String? nameEn, String? nameHi}) => _update(data.copyWith(nameEn: nameEn, nameHi: nameHi));

  void markMedicinesTaken(List<String> ids) {
    if (ids.isEmpty) return;
    final idSet = ids.toSet();
    final names = data.medicines.where((item) => idSet.contains(item.id)).map((item) => item.name).join(', ');
    final takenAt = DateTime.now().toIso8601String();
    _update(data.copyWith(
      medicines: data.medicines
          .map((item) => idSet.contains(item.id) ? item.copyWith(takenAt: takenAt, remindAt: null, promptedKey: null, snoozeCount: 0) : item)
          .toList(),
      notices: [
        Notice(id: uid(), kind: 'medicine', title: Copy.markTaken, body: medicineSaved(names), createdAt: takenAt, read: false, href: 'medicines'),
        ...data.notices,
      ].take(40).toList(),
    ));
    _feedback();
    dismissPrompt();
  }

  void undoMedicine(String id) {
    _update(data.copyWith(medicines: data.medicines.map((item) => item.id == id ? item.copyWith(takenAt: null) : item).toList()));
  }

  ({DateTime at, bool delayed}) _schedule(int minutes) {
    final from = DateTime.now().add(Duration(minutes: minutes));
    return shiftOutOfQuiet(from, data.settings);
  }

  void remindMedicines(List<String> ids, int minutes) {
    final plan = _schedule(minutes);
    final nowMs = DateTime.now();
    final targets = <Medicine>[];
    for (final id in ids) {
      final medicine = data.medicines.where((item) => item.id == id).firstOrNull;
      if (medicine == null) continue;
      if (medicine.remindAt != null && DateTime.parse(medicine.remindAt!).isAfter(nowMs)) continue;
      targets.add(medicine);
    }
    if (targets.isEmpty) {
      showBanner(Copy.reminderAlready);
      _feedback();
      return;
    }
    final idSet = targets.map((item) => item.id).toSet();
    final family = data.contacts.where((item) => item.notifyMedicine).map((item) => item.name).toList();
    final crossed = targets.where((item) => item.snoozeCount < 2 && item.snoozeCount + 1 >= 2).toList();
    final note = crossed.isNotEmpty && family.isNotEmpty
        ? familyMedicineNote(crossed.map((item) => item.name).join(', '), family.join(', '))
        : null;
    _update(data.copyWith(
      medicines: data.medicines
          .map((item) => idSet.contains(item.id)
              ? item.copyWith(remindAt: plan.at.toIso8601String(), promptedKey: null, snoozeCount: item.snoozeCount + 1)
              : item)
          .toList(),
      notices: note == null
          ? data.notices
          : [
              Notice(id: uid(), kind: 'family', title: Copy.family, body: note, createdAt: DateTime.now().toIso8601String(), read: false, href: 'notifications'),
              ...data.notices,
            ].take(40).toList(),
    ));
    showBanner(note ?? reminderSet(plan.at, plan.delayed));
    _feedback();
    dismissPrompt();
  }

  void setMedicineTime(String id, String time) {
    _update(data.copyWith(
      medicines: data.medicines.map((item) => item.id == id ? item.copyWith(time: time, remindAt: null, promptedKey: null) : item).toList(),
    ));
  }

  void markHabitDone(String id) {
    final today = todayKey();
    _update(data.copyWith(
      habits: data.habits.map((item) => item.id == id ? item.copyWith(doneOn: today, remindAt: null, promptedKey: null) : item).toList(),
      notices: [
        Notice(id: uid(), kind: 'habit', title: Copy.habitTitle(id), body: Copy.markedDone, createdAt: DateTime.now().toIso8601String(), read: false, href: 'day'),
        ...data.notices,
      ].take(40).toList(),
    ));
    _feedback();
    dismissPrompt();
  }

  void undoHabit(String id) {
    _update(data.copyWith(habits: data.habits.map((item) => item.id == id ? item.copyWith(doneOn: null) : item).toList()));
  }

  void remindHabit(String id, int minutes) {
    final plan = _schedule(minutes);
    _update(data.copyWith(
      habits: data.habits.map((item) => item.id == id ? item.copyWith(remindAt: plan.at.toIso8601String(), promptedKey: null) : item).toList(),
    ));
    showBanner(reminderSet(plan.at, plan.delayed));
    dismissPrompt();
  }

  void setHabitTime(String id, String time) {
    _update(data.copyWith(habits: data.habits.map((item) => item.id == id ? item.copyWith(time: time) : item).toList()));
  }

  void updateTransaction(String id, {String? status, String? reason}) {
    _update(data.copyWith(
      transactions: data.transactions
          .map((item) => item.id == id
              ? Transaction(
                  id: item.id,
                  direction: item.direction,
                  contactId: item.contactId,
                  name: item.name,
                  amount: item.amount,
                  createdAt: item.createdAt,
                  status: status ?? item.status,
                  reason: reason ?? item.reason,
                )
              : item)
          .toList(),
    ));
  }

  String createTransaction({
    required String name,
    required int amount,
    String? contactId,
    required String status,
    String? reason,
  }) {
    final id = uid();
    final tx = Transaction(
      id: id,
      direction: 'sent',
      contactId: contactId,
      name: name,
      amount: amount,
      createdAt: DateTime.now().toIso8601String(),
      status: status,
      reason: reason,
    );
    _update(data.copyWith(transactions: [tx, ...data.transactions].take(30).toList()));
    return id;
  }

  void markNoticeRead(String id) {
    _update(data.copyWith(notices: data.notices.map((item) => item.id == id ? item.copyWith(read: true) : item).toList()));
  }

  void markAllNoticesRead() {
    _update(data.copyWith(notices: data.notices.map((item) => item.copyWith(read: true)).toList()));
  }

  void addFamilyMessage(String contactId, String kind, Localized body) {
    final next = [
      ...data.familyThreads,
      FamilyMessage(id: uid(), contactId: contactId, kind: kind, body: body, createdAt: DateTime.now().toIso8601String()),
    ];
    _update(data.copyWith(familyThreads: next.length > 80 ? next.sublist(next.length - 80) : next));
  }

  String? familyIdForSos(String personId, String personName) {
    final named = data.contacts.where((item) => item.name.toLowerCase().startsWith(personName.toLowerCase()));
    if (named.isNotEmpty) return named.first.id;
    if (personId == 'rahul') {
      final son = data.contacts.where((item) => item.relation == 'son');
      return son.isEmpty ? null : son.first.id;
    }
    if (personId == 'priya') {
      final daughter = data.contacts.where((item) => item.relation == 'daughter');
      return daughter.isEmpty ? null : daughter.first.id;
    }
    return null;
  }

  Future<void> resetDemo() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(storageKey);
    data = seed();
    prompt = null;
    banner = null;
    notifyListeners();
  }

  void _lookForDue() {
    if (prompt != null) return;
    final moment = DateTime.now();
    if (isInQuiet(moment, data.settings)) return;
    final medicine = data.medicines.where((item) => isDueMedicine(item, moment)).firstOrNull;
    if (medicine != null) {
      prompt = ReminderPrompt('medicine', medicine.id);
      _update(data.copyWith(
        medicines: data.medicines.map((item) => item.id == medicine.id ? item.copyWith(promptedKey: item.remindAt) : item).toList(),
      ));
      return;
    }
    final habit = data.habits.where((item) => isDueHabit(item, moment)).firstOrNull;
    if (habit != null) {
      prompt = ReminderPrompt('habit', habit.id);
      _update(data.copyWith(habits: data.habits.map((item) => item.id == habit.id ? item.copyWith(promptedKey: item.remindAt) : item).toList()));
    }
  }
}
