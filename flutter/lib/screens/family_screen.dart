import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class FamilyScreen extends StatelessWidget {
  const FamilyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final people = store.data.contacts.where((item) => item.notifyMedicine).map((item) => item.name).join(', ');
    final watched = store.data.medicines.where((item) => item.takenAt == null && item.snoozeCount >= 2).map((item) => item.name).join(', ');
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.myFamily)),
        for (final contact in store.data.contacts) ...[
          _Tile(contact: contact),
          const SizedBox(height: 14),
        ],
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: const Color(0xFFE7F3FB), borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFC5DDF0))),
          child: Row(
            children: [
              Image.asset('assets/icons/family.png', width: 64, height: 64),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.t(Copy.familyInformedTitle), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 4),
                    Text(store.t(Copy.familyInformedBody), style: const TextStyle(fontSize: 17, height: 1.3)),
                    if (watched.isNotEmpty && people.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(store.t(familyMedicineNote(watched, people)), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Tile extends StatelessWidget {
  final Contact contact;
  const _Tile({required this.contact});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final color = switch (contact.relation) {
      'daughter' || 'spouse' => const Color(0xFFFDE8EF),
      'son' || 'brother' => const Color(0xFFFFF4D6),
      'sister' => const Color(0xFFEDE4F7),
      _ => Colors.white,
    };
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          CircleAvatar(radius: 52, backgroundColor: Colors.white, backgroundImage: AssetImage(portraitFor(contact.relation, contact.name))),
          const SizedBox(height: 10),
          Text(store.t(Copy.relation(contact.relation)), textAlign: TextAlign.center, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(contact.name, textAlign: TextAlign.center, style: const TextStyle(fontSize: 18)),
          const SizedBox(height: 12),
          PrimaryButton(
            label: store.t(Copy.call),
            icon: Icons.phone,
            onPressed: () {
              store.addFamilyMessage(contact.id, 'call', familyCallMessage(contact.name));
              context.read<Nav>().open('chat', '${contact.id}|call');
            },
          ),
          const SizedBox(height: 8),
          PrimaryButton(
            label: store.t(Copy.message),
            icon: Icons.chat_bubble,
            background: const Color(0xFFD7E6F7),
            foreground: AppColors.navy,
            onPressed: () => context.read<Nav>().open('chat', '${contact.id}|message'),
          ),
        ],
      ),
    );
  }
}

class FamilyChatScreen extends StatelessWidget {
  final String contactId;
  final String kind;
  const FamilyChatScreen({super.key, required this.contactId, required this.kind});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final contact = store.data.contacts.where((item) => item.id == contactId).firstOrNull;
    if (contact == null) return const SizedBox.shrink();
    final logged = store.data.familyThreads.where((item) => item.contactId == contact.id).toList()
      ..sort((a, b) => a.createdAt.compareTo(b.createdAt));
    final opened = DateTime.now().subtract(const Duration(minutes: 3)).toIso8601String();
    return ListView(
      children: [
        ScreenHeader(title: contact.name),
        Text(store.t(Copy.relation(contact.relation)), style: const TextStyle(fontSize: 18)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0x1A202E63))),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _Bubble(label: Copy.chatFrom, when: opened, body: familyCheckMessage(contact.name), icon: Icons.notifications),
              for (final item in logged)
                _Bubble(
                  label: item.kind == 'call'
                      ? Copy.call
                      : item.kind == 'sos'
                          ? Copy.emergencyLabel
                          : item.kind == 'assist'
                              ? Copy.assistance
                              : Copy.chatFrom,
                  when: item.createdAt,
                  body: item.body,
                  icon: item.kind == 'call'
                      ? Icons.phone
                      : item.kind == 'sos'
                          ? Icons.campaign
                          : item.kind == 'assist'
                              ? Icons.volunteer_activism
                              : Icons.notifications,
                ),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check, color: AppColors.success),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(store.t(Copy.sentAuto), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.success, fontSize: 17)),
                        Text(store.t(Copy.onDevice), style: const TextStyle(color: AppColors.muted, fontSize: 16)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Bubble extends StatelessWidget {
  final Localized label;
  final String when;
  final Localized body;
  final IconData icon;
  const _Bubble({required this.label, required this.when, required this.body, required this.icon});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Container(width: 48, height: 48, decoration: BoxDecoration(color: const Color(0xFFE7F3FB), borderRadius: BorderRadius.circular(14)), child: Icon(icon, color: AppColors.navy)),
            const SizedBox(width: 10),
            Expanded(child: Text(store.t(label), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy))),
          ]),
          const SizedBox(height: 6),
          Text(formatWhen(when, store.hindi), style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: const BoxDecoration(color: AppColors.navy, borderRadius: BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20), bottomLeft: Radius.circular(20), bottomRight: Radius.circular(8))),
            child: Text(store.t(body), style: const TextStyle(color: Colors.white, fontSize: 18, height: 1.3)),
          ),
        ],
      ),
    );
  }
}
