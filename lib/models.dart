class Localized {
  final String en;
  final String hi;
  const Localized(this.en, this.hi);

  String of(bool hindi) => hindi ? hi : en;

  Map<String, String> toJson() => {'en': en, 'hi': hi};

  factory Localized.fromJson(Map<String, dynamic> json) => Localized('${json['en']}', '${json['hi']}');
}

class Medicine {
  final String id;
  final String name;
  final String dose;
  final String slot;
  final String time;
  final String? takenAt;
  final String? remindAt;
  final String? promptedKey;
  final int snoozeCount;

  const Medicine({
    required this.id,
    required this.name,
    this.dose = '',
    required this.slot,
    required this.time,
    this.takenAt,
    this.remindAt,
    this.promptedKey,
    this.snoozeCount = 0,
  });

  Medicine copyWith({
    String? time,
    Object? takenAt = _keep,
    Object? remindAt = _keep,
    Object? promptedKey = _keep,
    int? snoozeCount,
  }) {
    return Medicine(
      id: id,
      name: name,
      dose: dose,
      slot: slot,
      time: time ?? this.time,
      takenAt: takenAt == _keep ? this.takenAt : takenAt as String?,
      remindAt: remindAt == _keep ? this.remindAt : remindAt as String?,
      promptedKey: promptedKey == _keep ? this.promptedKey : promptedKey as String?,
      snoozeCount: snoozeCount ?? this.snoozeCount,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'dose': dose,
        'slot': slot,
        'time': time,
        'takenAt': takenAt,
        'remindAt': remindAt,
        'promptedKey': promptedKey,
        'snoozeCount': snoozeCount,
      };

  factory Medicine.fromJson(Map<String, dynamic> json) => Medicine(
        id: '${json['id']}',
        name: '${json['name']}',
        dose: '${json['dose'] ?? ''}',
        slot: '${json['slot']}',
        time: '${json['time']}',
        takenAt: json['takenAt'] as String?,
        remindAt: json['remindAt'] as String?,
        promptedKey: json['promptedKey'] as String?,
        snoozeCount: (json['snoozeCount'] as num?)?.toInt() ?? 0,
      );
}

class Contact {
  final String id;
  final String name;
  final String relation;
  final String phone;
  final String upiId;
  final bool notifyMedicine;
  final bool notifyPayment;
  final bool notifySos;

  const Contact({
    required this.id,
    required this.name,
    required this.relation,
    required this.phone,
    required this.upiId,
    required this.notifyMedicine,
    required this.notifyPayment,
    required this.notifySos,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'relation': relation,
        'phone': phone,
        'upiId': upiId,
        'notifyMedicine': notifyMedicine,
        'notifyPayment': notifyPayment,
        'notifySos': notifySos,
      };

  factory Contact.fromJson(Map<String, dynamic> json) => Contact(
        id: '${json['id']}',
        name: '${json['name']}',
        relation: '${json['relation']}',
        phone: '${json['phone']}',
        upiId: '${json['upiId']}',
        notifyMedicine: json['notifyMedicine'] == true,
        notifyPayment: json['notifyPayment'] == true,
        notifySos: json['notifySos'] == true,
      );
}

class Transaction {
  final String id;
  final String direction;
  final String? contactId;
  final String name;
  final int amount;
  final String createdAt;
  final String status;
  final String? reason;

  const Transaction({
    required this.id,
    required this.direction,
    this.contactId,
    required this.name,
    required this.amount,
    required this.createdAt,
    required this.status,
    this.reason,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'direction': direction,
        'contactId': contactId,
        'name': name,
        'amount': amount,
        'createdAt': createdAt,
        'status': status,
        'reason': reason,
      };

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: '${json['id']}',
        direction: '${json['direction']}',
        contactId: json['contactId'] as String?,
        name: '${json['name']}',
        amount: (json['amount'] as num).toInt(),
        createdAt: '${json['createdAt']}',
        status: '${json['status']}',
        reason: json['reason'] as String?,
      );
}

class Habit {
  final String id;
  final String time;
  final String? doneOn;
  final String? remindAt;
  final String? promptedKey;

  const Habit({
    required this.id,
    required this.time,
    this.doneOn,
    this.remindAt,
    this.promptedKey,
  });

  Habit copyWith({
    String? time,
    Object? doneOn = _keep,
    Object? remindAt = _keep,
    Object? promptedKey = _keep,
  }) {
    return Habit(
      id: id,
      time: time ?? this.time,
      doneOn: doneOn == _keep ? this.doneOn : doneOn as String?,
      remindAt: remindAt == _keep ? this.remindAt : remindAt as String?,
      promptedKey: promptedKey == _keep ? this.promptedKey : promptedKey as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'time': time,
        'doneOn': doneOn,
        'remindAt': remindAt,
        'promptedKey': promptedKey,
      };

  factory Habit.fromJson(Map<String, dynamic> json) => Habit(
        id: '${json['id']}',
        time: '${json['time']}',
        doneOn: json['doneOn'] as String?,
        remindAt: json['remindAt'] as String?,
        promptedKey: json['promptedKey'] as String?,
      );
}

class Notice {
  final String id;
  final String kind;
  final Localized title;
  final Localized body;
  final String createdAt;
  final bool read;
  final String? href;

  const Notice({
    required this.id,
    required this.kind,
    required this.title,
    required this.body,
    required this.createdAt,
    required this.read,
    this.href,
  });

  Notice copyWith({bool? read}) => Notice(
        id: id,
        kind: kind,
        title: title,
        body: body,
        createdAt: createdAt,
        read: read ?? this.read,
        href: href,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'kind': kind,
        'title': title.toJson(),
        'body': body.toJson(),
        'createdAt': createdAt,
        'read': read,
        'href': href,
      };

  factory Notice.fromJson(Map<String, dynamic> json) => Notice(
        id: '${json['id']}',
        kind: '${json['kind']}',
        title: Localized.fromJson(Map<String, dynamic>.from(json['title'] as Map)),
        body: Localized.fromJson(Map<String, dynamic>.from(json['body'] as Map)),
        createdAt: '${json['createdAt']}',
        read: json['read'] == true,
        href: json['href'] as String?,
      );
}

class FamilyMessage {
  final String id;
  final String contactId;
  final String kind;
  final Localized body;
  final String createdAt;

  const FamilyMessage({
    required this.id,
    required this.contactId,
    required this.kind,
    required this.body,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'contactId': contactId,
        'kind': kind,
        'body': body.toJson(),
        'createdAt': createdAt,
      };

  factory FamilyMessage.fromJson(Map<String, dynamic> json) => FamilyMessage(
        id: '${json['id']}',
        contactId: '${json['contactId']}',
        kind: '${json['kind']}',
        body: Localized.fromJson(Map<String, dynamic>.from(json['body'] as Map)),
        createdAt: '${json['createdAt']}',
      );
}

class Settings {
  final String language;
  final String textSize;
  final bool sound;
  final bool vibration;
  final bool voiceGuidance;
  final bool quietHours;
  final String quietStart;
  final String quietEnd;
  final bool sharePayments;

  const Settings({
    required this.language,
    required this.textSize,
    required this.sound,
    required this.vibration,
    required this.voiceGuidance,
    required this.quietHours,
    required this.quietStart,
    required this.quietEnd,
    required this.sharePayments,
  });

  Settings copyWith({
    String? language,
    String? textSize,
    bool? sound,
    bool? vibration,
    bool? voiceGuidance,
    bool? quietHours,
    String? quietStart,
    String? quietEnd,
    bool? sharePayments,
  }) {
    return Settings(
      language: language ?? this.language,
      textSize: textSize ?? this.textSize,
      sound: sound ?? this.sound,
      vibration: vibration ?? this.vibration,
      voiceGuidance: voiceGuidance ?? this.voiceGuidance,
      quietHours: quietHours ?? this.quietHours,
      quietStart: quietStart ?? this.quietStart,
      quietEnd: quietEnd ?? this.quietEnd,
      sharePayments: sharePayments ?? this.sharePayments,
    );
  }

  Map<String, dynamic> toJson() => {
        'language': language,
        'textSize': textSize,
        'sound': sound,
        'vibration': vibration,
        'voiceGuidance': voiceGuidance,
        'quietHours': quietHours,
        'quietStart': quietStart,
        'quietEnd': quietEnd,
        'sharePayments': sharePayments,
      };

  factory Settings.fromJson(Map<String, dynamic> json) => Settings(
        language: '${json['language'] ?? 'en'}',
        textSize: '${json['textSize'] ?? 'default'}',
        sound: json['sound'] != false,
        vibration: json['vibration'] != false,
        voiceGuidance: json['voiceGuidance'] == true,
        quietHours: json['quietHours'] == true,
        quietStart: '${json['quietStart'] ?? '22:00'}',
        quietEnd: '${json['quietEnd'] ?? '07:00'}',
        sharePayments: json['sharePayments'] == true,
      );
}

class AppData {
  final Settings settings;
  final String nameEn;
  final String nameHi;
  final List<Medicine> medicines;
  final List<Habit> habits;
  final List<Contact> contacts;
  final List<Transaction> transactions;
  final List<Notice> notices;
  final List<FamilyMessage> familyThreads;

  const AppData({
    required this.settings,
    required this.nameEn,
    required this.nameHi,
    required this.medicines,
    required this.habits,
    required this.contacts,
    required this.transactions,
    required this.notices,
    required this.familyThreads,
  });

  AppData copyWith({
    Settings? settings,
    String? nameEn,
    String? nameHi,
    List<Medicine>? medicines,
    List<Habit>? habits,
    List<Contact>? contacts,
    List<Transaction>? transactions,
    List<Notice>? notices,
    List<FamilyMessage>? familyThreads,
  }) {
    return AppData(
      settings: settings ?? this.settings,
      nameEn: nameEn ?? this.nameEn,
      nameHi: nameHi ?? this.nameHi,
      medicines: medicines ?? this.medicines,
      habits: habits ?? this.habits,
      contacts: contacts ?? this.contacts,
      transactions: transactions ?? this.transactions,
      notices: notices ?? this.notices,
      familyThreads: familyThreads ?? this.familyThreads,
    );
  }

  Map<String, dynamic> toJson() => {
        'version': 1,
        'onboarded': true,
        'settings': settings.toJson(),
        'profile': {'nameEn': nameEn, 'nameHi': nameHi},
        'medicines': medicines.map((item) => item.toJson()).toList(),
        'habits': habits.map((item) => item.toJson()).toList(),
        'contacts': contacts.map((item) => item.toJson()).toList(),
        'transactions': transactions.map((item) => item.toJson()).toList(),
        'notices': notices.map((item) => item.toJson()).toList(),
        'familyThreads': familyThreads.map((item) => item.toJson()).toList(),
      };

  factory AppData.fromJson(Map<String, dynamic> json) {
    final profile = Map<String, dynamic>.from(json['profile'] as Map);
    return AppData(
      settings: Settings.fromJson(Map<String, dynamic>.from(json['settings'] as Map)),
      nameEn: '${profile['nameEn'] ?? 'Amma'}',
      nameHi: '${profile['nameHi'] ?? 'अम्मा'}',
      medicines: _list(json['medicines'], Medicine.fromJson),
      habits: _list(json['habits'], Habit.fromJson),
      contacts: _list(json['contacts'], Contact.fromJson),
      transactions: _list(json['transactions'], Transaction.fromJson),
      notices: _list(json['notices'], Notice.fromJson),
      familyThreads: json['familyThreads'] is List ? _list(json['familyThreads'], FamilyMessage.fromJson) : const [],
    );
  }
}

List<T> _list<T>(Object? raw, T Function(Map<String, dynamic>) decode) {
  if (raw is! List) return [];
  return raw.map((item) => decode(Map<String, dynamic>.from(item as Map))).toList();
}

const _keep = Object();
