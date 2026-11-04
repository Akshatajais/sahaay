import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final settings = store.data.settings;
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.settings)),
        const _Names(),
        const SizedBox(height: 16),
        Text(store.t(Copy.language), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: _LangCard('English', 'अंग्रेज़ी', !store.hindi, () => store.setLanguage('en'), store.t(Copy.selected))),
          const SizedBox(width: 12),
          Expanded(child: _LangCard('हिन्दी', 'Hindi', store.hindi, () => store.setLanguage('hi'), store.t(Copy.selected))),
        ]),
        const SizedBox(height: 16),
        Text(store.t(Copy.textSize), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        for (final size in [('default', Copy.textDefault), ('large', Copy.textLarge), ('larger', Copy.textLarger)])
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: OutlinedButton(
              onPressed: () => store.setTextSize(size.$1),
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                minimumSize: const Size.fromHeight(64),
                side: BorderSide(color: settings.textSize == size.$1 ? AppColors.navy : const Color(0x33202E63), width: settings.textSize == size.$1 ? 2 : 1),
              ),
              child: Align(alignment: Alignment.centerLeft, child: Text(store.t(size.$2), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy))),
            ),
          ),
        _Switch(Copy.sound, settings.sound, (value) => store.updateSettings(settings.copyWith(sound: value))),
        _Switch(Copy.vibration, settings.vibration, (value) => store.updateSettings(settings.copyWith(vibration: value))),
        _Switch(Copy.voiceGuidance, settings.voiceGuidance, (value) => store.updateSettings(settings.copyWith(voiceGuidance: value))),
        _Switch(Copy.quietHours, settings.quietHours, (value) => store.updateSettings(settings.copyWith(quietHours: value))),
        _Switch(Copy.sharePayments, settings.sharePayments, (value) => store.updateSettings(settings.copyWith(sharePayments: value))),
        if (settings.quietHours) ...[
          const SizedBox(height: 8),
          _TimeRow(Copy.quietStart, settings.quietStart, (value) => store.updateSettings(settings.copyWith(quietStart: value))),
          _TimeRow(Copy.quietEnd, settings.quietEnd, (value) => store.updateSettings(settings.copyWith(quietEnd: value))),
        ],
        const SizedBox(height: 12),
        _Link(store.t(Copy.medicineTimes), () => context.read<Nav>().open('medicines')),
        _Link(store.t(Copy.habitTimes), () => context.read<Nav>().open('day')),
        _Link(store.t(Copy.familyPrefs), () => context.read<Nav>().open('family')),
        _Link(store.t(Copy.notifications), () => context.read<Nav>().open('notifications')),
        const SizedBox(height: 12),
        _Card(children: [
          Text(store.t(Copy.privacy), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
          const SizedBox(height: 8),
          const Bilingual(Copy.privacyBody),
          const SizedBox(height: 12),
          PrimaryButton(
            label: store.t(Copy.clearData),
            background: AppColors.sos,
            onPressed: () async {
              final yes = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: AppColors.cream,
                  title: Text(store.t(Copy.clearTitle)),
                  content: Text(store.t(Copy.clearConfirm)),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: Text(store.t(Copy.close))),
                    TextButton(onPressed: () => Navigator.pop(context, true), child: Text(store.t(Copy.clearData))),
                  ],
                ),
              );
              if (yes == true) await store.resetDemo();
            },
          ),
        ]),
      ],
    );
  }
}

class _Names extends StatefulWidget {
  const _Names();

  @override
  State<_Names> createState() => _NamesState();
}

class _NamesState extends State<_Names> {
  late final TextEditingController en;
  late final TextEditingController hi;

  @override
  void initState() {
    super.initState();
    final store = context.read<AppStore>();
    en = TextEditingController(text: store.data.nameEn);
    hi = TextEditingController(text: store.data.nameHi);
  }

  @override
  void dispose() {
    en.dispose();
    hi.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = context.read<AppStore>();
    return _Card(children: [
      Text(store.t(Copy.nameEn), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
      TextField(controller: en, onChanged: (value) => store.updateProfile(nameEn: value), decoration: const InputDecoration(filled: true, fillColor: Colors.white)),
      const SizedBox(height: 12),
      Text(store.t(Copy.nameHi), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
      TextField(controller: hi, onChanged: (value) => store.updateProfile(nameHi: value), decoration: const InputDecoration(filled: true, fillColor: Colors.white)),
    ]);
  }
}

class _Card extends StatelessWidget {
  final List<Widget> children;
  const _Card({required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0x1A202E63))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: children),
    );
  }
}

class _LangCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;
  final String selectedLabel;
  const _LangCard(this.title, this.subtitle, this.selected, this.onTap, this.selectedLabel);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: BorderSide(color: selected ? AppColors.navy : const Color(0x33202E63), width: selected ? 2 : 1)),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: SizedBox(
          height: 96,
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
            Text(subtitle, style: const TextStyle(color: AppColors.muted)),
            if (selected) Text(selectedLabel, style: const TextStyle(fontWeight: FontWeight.w800)),
          ]),
        ),
      ),
    );
  }
}

class _Switch extends StatelessWidget {
  final Localized label;
  final bool value;
  final ValueChanged<bool> onChanged;
  const _Switch(this.label, this.value, this.onChanged);

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return SwitchListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(store.t(label), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
      value: value,
      activeThumbColor: AppColors.navy,
      onChanged: onChanged,
    );
  }
}

class _TimeRow extends StatelessWidget {
  final Localized label;
  final String value;
  final ValueChanged<String> onPick;
  const _TimeRow(this.label, this.value, this.onPick);

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(store.t(label)),
      trailing: Text(formatHm(value, store.hindi), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
      onTap: () async {
        final picked = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(atTimeToday(value, DateTime.now())));
        if (picked == null) return;
        onPick('${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}');
      },
    );
  }
}

class _Link extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _Link(this.label, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        child: ListTile(title: Text(label, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)), trailing: const Icon(Icons.chevron_right), onTap: onTap),
      ),
    );
  }
}
