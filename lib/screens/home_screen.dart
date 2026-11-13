import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final nav = context.read<Nav>();
    final hello = greeting(store.now);
    final name = profileName(store.data.nameEn, store.data.nameHi, store.hindi);
    final priority = priorityMedicine(store.data.medicines, store.now);
    final done = completedCount(store.data.medicines, store.now);
    final steps = ['default', 'large', 'larger'];
    final index = steps.indexOf(store.data.settings.textSize).clamp(0, 2);

    return SingleChildScrollView(
      child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            _TextStep(
              label: 'A−',
              semantic: store.t(Copy.smaller),
              enabled: index > 0,
              onPressed: () => store.setTextSize(steps[index - 1]),
            ),
            const SizedBox(width: 8),
            _TextStep(
              label: 'A+',
              semantic: store.t(Copy.larger),
              enabled: index < steps.length - 1,
              big: true,
              onPressed: () => store.setTextSize(steps[index + 1]),
            ),
            const SizedBox(width: 8),
            _LanguagePill(hindi: store.hindi, onEnglish: () => store.setLanguage('en'), onHindi: () => store.setLanguage('hi')),
          ],
        ),
        const SizedBox(height: 12),
        Text('${store.t(hello)},', style: const TextStyle(fontSize: 32, height: 1.1, fontWeight: FontWeight.w800, color: AppColors.navy)),
        Text('$name!', style: const TextStyle(fontSize: 32, height: 1.1, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 12),
        if (priority != null)
          _MedicineCard(medicine: priority, store: store)
        else
          _AllDone(done: done, total: store.data.medicines.length, onSee: () => nav.open('medicines')),
        const SizedBox(height: 12),
        GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.28,
            children: [
              _Shortcut('money', Copy.money, 'assets/icons/money.png', const Color(0xFFE3F1FB), () => nav.open('money')),
              _Shortcut('medicines', Copy.medicines, 'assets/icons/medicines.png', const Color(0xFFE5F6EA), () => nav.open('medicines')),
              _Shortcut('day', Copy.myDay, 'assets/icons/day.png', const Color(0xFFFBF6EA), () => nav.open('day')),
              _Shortcut('help', Copy.help, 'assets/icons/help.png', const Color(0xFFFBEAEA), () => nav.go('help')),
            ],
          ),
        const SizedBox(height: 12),
        _Shortcut('family', Copy.family, 'assets/icons/family.png', const Color(0xFFF8E6D8), () => nav.open('family'), wide: true),
      ],
      ),
    );
  }
}

class _TextStep extends StatelessWidget {
  final String label;
  final String semantic;
  final bool enabled;
  final bool big;
  final VoidCallback onPressed;
  const _TextStep({required this.label, required this.semantic, required this.enabled, required this.onPressed, this.big = false});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: semantic,
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(side: BorderSide(color: Color(0x26202E63))),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: enabled ? onPressed : null,
          child: SizedBox(
            width: 48,
            height: 48,
            child: Center(
              child: Text(label, style: TextStyle(fontSize: big ? 20 : 15, fontWeight: FontWeight.w800, color: AppColors.navy.withValues(alpha: enabled ? 1 : 0.4))),
            ),
          ),
        ),
      ),
    );
  }
}

class _LanguagePill extends StatelessWidget {
  final bool hindi;
  final VoidCallback onEnglish;
  final VoidCallback onHindi;
  const _LanguagePill({required this.hindi, required this.onEnglish, required this.onHindi});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(999), border: Border.all(color: const Color(0x26202E63))),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _LangButton('EN', !hindi, onEnglish),
          Container(width: 1, color: const Color(0x26202E63)),
          _LangButton('हिं', hindi, onHindi),
        ],
      ),
    );
  }
}

class _LangButton extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onPressed;
  const _LangButton(this.label, this.selected, this.onPressed);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.navy : Colors.transparent,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(999),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Center(child: Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: selected ? Colors.white : AppColors.muted))),
        ),
      ),
    );
  }
}

class _MedicineCard extends StatelessWidget {
  final Medicine medicine;
  final AppStore store;
  const _MedicineCard({required this.medicine, required this.store});

  @override
  Widget build(BuildContext context) {
    final status = statusOf(medicine, store.now);
    final attention = status == MedStatus.needsAttention;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.care, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0x1A202E63))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: attention ? AppColors.amber : Colors.white, borderRadius: BorderRadius.circular(999)),
                child: Text(
                  store.t(attention ? Copy.takeNow : status == MedStatus.taken ? Copy.taken : Copy.upcoming),
                  style: TextStyle(fontWeight: FontWeight.w800, color: attention ? AppColors.amberInk : AppColors.navy),
                ),
              ),
              const Spacer(),
              IconButton(
                tooltip: store.t(Copy.readAloud),
                onPressed: () => _speak(store, medicine),
                icon: const Icon(Icons.volume_up, color: AppColors.navy),
                style: IconButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size(48, 48)),
              ),
            ],
          ),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.t(Copy.slotTitle(medicine.slot)), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 4),
                    Text(formatHm(medicine.time, store.hindi), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    Text(medicine.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    if (medicine.remindAt != null && DateTime.parse(medicine.remindAt!).isAfter(store.now))
                      Text('${store.t(Copy.nextReminder)} · ${formatWhen(medicine.remindAt!, store.hindi)}', style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
                  ],
                ),
              ),
              Image.asset('assets/icons/medicines.png', width: 72, height: 72),
            ],
          ),
          const SizedBox(height: 10),
          PrimaryButton(
            label: store.t(Copy.markTaken),
            onPressed: () {
              store.markMedicinesTaken([medicine.id]);
              context.read<Nav>().open('medicine-done', medicine.id);
            },
          ),
          const SizedBox(height: 8),
          OutlineButton(
            label: store.t(Copy.remindLater),
            onPressed: () async {
              final minutes = await showReminderSheet(context);
              if (minutes != null) store.remindMedicines([medicine.id], minutes);
            },
          ),
        ],
      ),
    );
  }
}

Future<void> _speak(AppStore store, Medicine medicine) async {
  final line = '${medicine.name}. ${Copy.slotWhen(medicine.slot).of(store.hindi)}. ${formatHm(medicine.time, store.hindi)}.';
  final tts = FlutterTts();
  await tts.setLanguage(store.hindi ? 'hi-IN' : 'en-IN');
  await tts.speak(line);
}

class _AllDone extends StatelessWidget {
  final int done;
  final int total;
  final VoidCallback onSee;
  const _AllDone({required this.done, required this.total, required this.onSee});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.care, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          const CircleAvatar(radius: 28, backgroundColor: AppColors.success, child: Icon(Icons.check, color: Colors.white, size: 32)),
          const SizedBox(height: 8),
          Text(store.t(Copy.allDone), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text('$done/$total', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.success)),
          const SizedBox(height: 8),
          PrimaryButton(label: store.t(Copy.seeMedicines), onPressed: onSee),
        ],
      ),
    );
  }
}

class _Shortcut extends StatelessWidget {
  final String keyName;
  final Localized label;
  final String image;
  final Color color;
  final VoidCallback onTap;
  final bool wide;
  const _Shortcut(this.keyName, this.label, this.image, this.color, this.onTap, {this.wide = false});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final title = Text(
      store.t(label),
      maxLines: 1,
      softWrap: false,
      textAlign: TextAlign.center,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy),
    );
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(22),
      child: InkWell(
        key: Key(keyName),
        borderRadius: BorderRadius.circular(22),
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: wide ? 16 : 10, vertical: wide ? 12 : 10),
          child: wide
              ? Row(
                  children: [
                    Image.asset(image, width: 56, height: 56, fit: BoxFit.contain),
                    const SizedBox(width: 12),
                    Expanded(child: Align(alignment: Alignment.centerLeft, child: title)),
                  ],
                )
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(child: Image.asset(image, fit: BoxFit.contain)),
                    const SizedBox(height: 6),
                    title,
                  ],
                ),
        ),
      ),
    );
  }
}
