import 'dart:async';

import 'package:flutter/material.dart';

import 'models.dart';

class DayActivity {
  final String id;
  final int hour;
  final int minute;
  final Localized title;
  final Localized detail;
  final IconData icon;
  final Color tint;
  final bool medicine;
  bool done = false;
  bool later = false;

  DayActivity({
    required this.id,
    required this.hour,
    required this.minute,
    required this.title,
    required this.detail,
    required this.icon,
    required this.tint,
    required this.medicine,
  });
}

class ListenTrack {
  final String id;
  final Localized title;
  final Localized detail;
  final IconData icon;
  final Color tint;
  final int seconds;

  const ListenTrack({
    required this.id,
    required this.title,
    required this.detail,
    required this.icon,
    required this.tint,
    this.seconds = 180,
  });
}

class FamilyBirthday {
  final String image;
  final Localized name;
  final Localized relation;
  final Localized when;

  const FamilyBirthday({required this.image, required this.name, required this.relation, required this.when});
}

class FamilyPhoto {
  final String id;
  final String image;
  final Localized event;
  final Localized date;

  const FamilyPhoto({required this.id, required this.image, required this.event, required this.date});
}

class DaySession extends ChangeNotifier {
  DaySession() {
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (playId == null || paused) return;
      elapsed++;
      final total = _durationOf(playId!);
      if (elapsed >= total) {
        stop();
      } else {
        notifyListeners();
      }
    });
  }

  late final Timer _timer;

  final activities = <DayActivity>[
    DayActivity(
      id: 'med-morning',
      hour: 8,
      minute: 0,
      title: const Localized('Morning medicine', 'सुबह की दवा'),
      detail: const Localized('A gentle reminder for your morning dose.', 'सुबह की खुराक के लिए एक हल्की याद दिलाना।'),
      icon: Icons.medication_outlined,
      tint: const Color(0xFFE5F6EA),
      medicine: true,
    ),
    DayActivity(
      id: 'walk',
      hour: 9,
      minute: 0,
      title: const Localized('Go for a morning walk', 'सुबह सैर पर जाएँ'),
      detail: const Localized('A short stroll if the weather feels nice.', 'मौसम अच्छा लगे तो थोड़ी सैर।'),
      icon: Icons.directions_walk,
      tint: const Color(0xFFE7F3FB),
      medicine: false,
    ),
    DayActivity(
      id: 'call',
      hour: 11,
      minute: 0,
      title: const Localized('Call your daughter', 'बेटी को फ़ोन करें'),
      detail: const Localized('Priya would love to hear your voice.', 'प्रिया आपकी आवाज़ सुनकर खुश होगी।'),
      icon: Icons.phone_in_talk,
      tint: const Color(0xFFF8E6D8),
      medicine: false,
    ),
    DayActivity(
      id: 'stroll',
      hour: 17,
      minute: 0,
      title: const Localized('Evening stroll', 'शाम की सैर'),
      detail: const Localized('Step outside when you feel like it.', 'जब मन करे, थोड़ा बाहर निकलें।'),
      icon: Icons.park_outlined,
      tint: const Color(0xFFFBF6EA),
      medicine: false,
    ),
    DayActivity(
      id: 'med-evening',
      hour: 20,
      minute: 0,
      title: const Localized('Evening medicine', 'शाम की दवा'),
      detail: const Localized('A gentle reminder for your evening dose.', 'शाम की खुराक के लिए एक हल्की याद दिलाना।'),
      icon: Icons.medication_outlined,
      tint: const Color(0xFFE5F6EA),
      medicine: true,
    ),
  ];

  static const listen = <ListenTrack>[
    ListenTrack(id: 'hindi', title: Localized('Old Hindi Songs', 'पुराने हिन्दी गीत'), detail: Localized('Familiar melodies from the films you love.', 'उन फ़िल्मों के जाने-पहचाने सुर।'), icon: Icons.music_note, tint: Color(0xFFF8E6D8)),
    ListenTrack(id: 'devotional', title: Localized('Devotional Music', 'भजन'), detail: Localized('Quiet bhajans for a peaceful moment.', 'शांत भजन, एक सुकून भरा पल।'), icon: Icons.spa_outlined, tint: Color(0xFFF7DFAE)),
    ListenTrack(id: 'stories', title: Localized('Short Stories', 'छोटी कहानियाँ'), detail: Localized('A little story to sit with.', 'साथ बैठकर सुनने की एक छोटी कहानी।'), icon: Icons.auto_stories, tint: Color(0xFFF3E8F6)),
    ListenTrack(id: 'news', title: Localized('Daily News Highlights', 'आज की ख़बरें'), detail: Localized('The day, told simply.', 'दिन की बातें, आसान शब्दों में।'), icon: Icons.newspaper, tint: Color(0xFFD7E6F7)),
    ListenTrack(id: 'ghazals', title: Localized('Ghazals', 'ग़ज़ल'), detail: Localized('Soft voices and unhurried words.', 'कोमल आवाज़ें, बिना जल्दबाज़ी।'), icon: Icons.graphic_eq, tint: Color(0xFFE5F6EA)),
    ListenTrack(id: 'inspire', title: Localized('Inspirational Stories', 'प्रेरणा की कहानियाँ'), detail: Localized('A kind story to start the heart.', 'दिल खोलने वाली एक अच्छी कहानी।'), icon: Icons.favorite_outline, tint: Color(0xFFFBEAEA)),
    ListenTrack(id: 'classic', title: Localized('Classic Music', 'क्लासिकल संगीत'), detail: Localized('A calm raga for the afternoon.', 'दोपहर के लिए एक शांत राग।'), icon: Icons.piano, tint: Color(0xFFE7EEF8)),
  ];

  static const birthdaySoon = FamilyBirthday(
    image: 'assets/people/anita.png',
    name: Localized('Anita Desai', 'अनिता देसाई'),
    relation: Localized('Sister', 'बहन'),
    when: Localized('Sunday, 8 November', 'रविवार, 8 नवंबर'),
  );

  static const upcomingBirthdays = <FamilyBirthday>[
    FamilyBirthday(image: 'assets/people/ravi.png', name: Localized('Ravi Kumar', 'रवि कुमार'), relation: Localized('Son', 'बेटा'), when: Localized('18 November', '18 नवंबर')),
    FamilyBirthday(image: 'assets/people/priya.png', name: Localized('Priya Sharma', 'प्रिया शर्मा'), relation: Localized('Daughter', 'बेटी'), when: Localized('2 December', '2 दिसंबर')),
  ];

  static const photos = <FamilyPhoto>[
    FamilyPhoto(id: 'picnic', image: 'assets/day/picnic.jpg', event: Localized('Family picnic', 'परिवार का पिकनिक'), date: Localized('2 March 2025', '2 मार्च 2025')),
    FamilyPhoto(id: 'lunch', image: 'assets/day/lunch.jpg', event: Localized('Sunday lunch', 'रविवार का भोजन'), date: Localized('19 January 2025', '19 जनवरी 2025')),
    FamilyPhoto(id: 'diwali', image: 'assets/day/diwali.jpg', event: Localized('Diwali at home', 'घर पर दिवाली'), date: Localized('1 November 2024', '1 नवंबर 2024')),
    FamilyPhoto(id: 'dinner-1998', image: 'assets/day/dinner-1998.jpg', event: Localized('Dinner at home', 'घर का खाना'), date: Localized('15 August 1998', '15 अगस्त 1998')),
  ];

  String? playId;
  bool paused = false;
  int elapsed = 0;

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  void complete(String id) {
    final item = activities.firstWhere((entry) => entry.id == id);
    item.done = true;
    item.later = false;
    notifyListeners();
  }

  void remindLater(String id) {
    final item = activities.firstWhere((entry) => entry.id == id);
    if (item.done) return;
    item.later = true;
    notifyListeners();
  }

  void play(String id) {
    if (playId == id) {
      paused = !paused;
      notifyListeners();
      return;
    }
    playId = id;
    paused = false;
    elapsed = 0;
    notifyListeners();
  }

  void stop() {
    playId = null;
    paused = false;
    elapsed = 0;
    notifyListeners();
  }

  bool playing(String id) => playId == id && !paused;

  int _durationOf(String id) {
    for (final track in listen) {
      if (track.id == id) return track.seconds;
    }
    return 30;
  }

  String? playingTitle(bool hindi) {
    for (final track in listen) {
      if (track.id == playId) return track.title.of(hindi);
    }
    return null;
  }
}
