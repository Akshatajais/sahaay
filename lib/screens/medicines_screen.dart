import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class MedicinesScreen extends StatefulWidget {
  const MedicinesScreen({super.key});

  @override
  State<MedicinesScreen> createState() => _MedicinesScreenState();
}

class _MedicinesScreenState extends State<MedicinesScreen> {
  final open = {'morning': true, 'afternoon': true, 'night': true};
  List<String>? confirmIds;

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final ordered = [...store.data.medicines]..sort(compareMedicine);
    final done = ordered.where((item) => statusOf(item, store.now) == MedStatus.taken).length;
    final groups = ['morning', 'afternoon', 'night'].where((slot) => ordered.any((item) => item.slot == slot)).toList();
    final date = store.now;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final confirming = ordered.where((item) => confirmIds?.contains(item.id) ?? false).toList();

    return ListView(
      children: [
        ScreenHeader(
          title: store.t(Copy.todaysMedicines),
          back: context.watch<Nav>().canPop,
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0x1A202E63))),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.calendar_today, size: 20, color: AppColors.navy),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${date.day} ${months[date.month - 1]}', style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy, fontSize: 16)),
                    Text(days[date.weekday - 1], style: const TextStyle(color: AppColors.muted, fontWeight: FontWeight.w700, fontSize: 13)),
                  ],
                ),
              ],
            ),
          ),
        ),
        Text(store.hindi ? '${ordered.length} में से $done ली गईं' : '$done of ${ordered.length} taken', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(99),
          child: LinearProgressIndicator(
            minHeight: 12,
            value: ordered.isEmpty ? 0 : done / ordered.length,
            backgroundColor: const Color(0xFFE4E9F4),
            color: const Color(0xFF1F8A4C),
          ),
        ),
        const SizedBox(height: 16),
        for (var index = 0; index < groups.length; index++)
          _Group(
            slot: groups[index],
            items: ordered.where((item) => item.slot == groups[index]).toList(),
            expanded: open[groups[index]] ?? true,
            earlierOpen: groups.take(index).any((slot) => ordered.where((item) => item.slot == slot).any((item) => statusOf(item, store.now) != MedStatus.taken)),
            onToggle: () => setState(() => open[groups[index]] = !(open[groups[index]] ?? true)),
            onConfirm: (ids) => setState(() => confirmIds = ids),
          ),
        if (confirmIds != null)
          _Confirm(
            names: confirming.map((item) => item.name).toList(),
            onClose: () => setState(() => confirmIds = null),
            onYes: () {
              store.markMedicinesTaken(confirmIds!);
              setState(() => confirmIds = null);
            },
          ),
      ],
    );
  }
}

class _Group extends StatelessWidget {
  final String slot;
  final List<Medicine> items;
  final bool expanded;
  final bool earlierOpen;
  final VoidCallback onToggle;
  final void Function(List<String>) onConfirm;
  const _Group({required this.slot, required this.items, required this.expanded, required this.earlierOpen, required this.onToggle, required this.onConfirm});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final taken = items.where((item) => statusOf(item, store.now) == MedStatus.taken).length;
    final due = items.where((item) {
      final view = _view(item, store.now);
      return view == 'due' || view == 'overdue';
    }).toList();
    final waiting = due.where((item) => !(item.remindAt != null && DateTime.parse(item.remindAt!).isAfter(store.now))).toList();
    final started = items.any((item) => statusOf(item, store.now) != MedStatus.upcoming);
    final allTaken = taken == items.length;
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: allTaken ? const Color(0xFFE7F7EE) : Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: allTaken ? const Color(0xFFB7E4C7) : const Color(0x1A202E63)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(color: slot == 'night' ? const Color(0xFFF3E8F8) : const Color(0xFFFFF4E0), borderRadius: BorderRadius.circular(16)),
                child: Icon(slot == 'night' ? Icons.nightlight : slot == 'morning' ? Icons.wb_twilight : Icons.wb_sunny, color: slot == 'night' ? const Color(0xFF6A4C93) : const Color(0xFFC9842A)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.t(Copy.slotGroup(slot)), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    Text('${formatHm(items.first.time, store.hindi)} · ${store.t(Copy.slotWhen(slot))}', style: const TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: started ? const Color(0xFFE5F6EA) : const Color(0xFFE7F3FB), borderRadius: BorderRadius.circular(99)),
                      child: Text(
                        started ? (store.hindi ? '${items.length} में से $taken ली गईं' : '$taken of ${items.length} taken') : (items.length == 1 ? (store.hindi ? '1 दवा' : '1 medicine') : (store.hindi ? '${items.length} दवाइयाँ' : '${items.length} medicines')),
                        style: TextStyle(fontWeight: FontWeight.w800, color: started ? const Color(0xFF157A45) : AppColors.navy, fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(onPressed: onToggle, icon: Icon(expanded ? Icons.expand_less : Icons.expand_more, color: AppColors.navy)),
            ],
          ),
          if (expanded) ...[
            const SizedBox(height: 10),
            SizedBox(
              height: 280,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final medicine = items[index];
                  final view = _view(medicine, store.now);
                  final face = switch (view) {
                    'taken' => const Color(0xFFE5F6EA),
                    'upcoming' => const Color(0xFFE7F3FB),
                    'overdue' => const Color(0xFFFDECEC),
                    _ => const Color(0xFFFFF6E8),
                  };
                  final width = items.length > 1 ? MediaQuery.sizeOf(context).width * 0.62 : MediaQuery.sizeOf(context).width - 88;
                  return Container(
                    width: width.clamp(220, 360),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: face, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0x33202E63))),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Align(
                          alignment: Alignment.topRight,
                          child: IconButton(
                            onPressed: () => _speak(store, medicine),
                            icon: const Icon(Icons.volume_up, color: AppColors.navy),
                            style: IconButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size(48, 48)),
                          ),
                        ),
                        GestureDetector(
                          onTap: () => context.read<Nav>().open('medicine', medicine.id),
                          child: Column(
                            children: [
                              Image.asset(pillFor(medicine.id), height: 88),
                              Text(medicine.name, textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: Colors.white70, borderRadius: BorderRadius.circular(99)),
                                child: Text(store.t(Copy.slotWhen(medicine.slot)), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
                              ),
                            ],
                          ),
                        ),
                        const Spacer(),
                        if (view == 'taken')
                          Container(
                            height: 52,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(color: const Color(0xFF157A45), borderRadius: BorderRadius.circular(16)),
                            child: Text(store.t(Copy.taken), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
                          )
                        else if (view == 'upcoming')
                          Container(
                            height: 48,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                            child: Text(store.t(Copy.upcoming), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
                          )
                        else ...[
                          if (view == 'overdue')
                            Text(store.t(Copy.overdue), textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF8E1B28), fontWeight: FontWeight.w800)),
                          const SizedBox(height: 6),
                          FilledButton.icon(
                            onPressed: () => store.markMedicinesTaken([medicine.id]),
                            style: FilledButton.styleFrom(backgroundColor: view == 'overdue' ? AppColors.sos : const Color(0xFFE07A2A), minimumSize: const Size.fromHeight(48)),
                            icon: const Icon(Icons.schedule),
                            label: Text(store.t(Copy.takeNow)),
                          ),
                        ],
                      ],
                    ),
                  );
                },
              ),
            ),
            if (due.isNotEmpty && !earlierOpen) ...[
              const SizedBox(height: 10),
              OutlinedButton.icon(
                onPressed: () => onConfirm(due.map((item) => item.id).toList()),
                icon: const Icon(Icons.check),
                label: Text('${store.t(Copy.markRemaining)} (${due.length})'),
                style: OutlinedButton.styleFrom(foregroundColor: AppColors.navy, minimumSize: const Size.fromHeight(56), backgroundColor: const Color(0xFFF7F8FC)),
              ),
              const SizedBox(height: 8),
              OutlineButton(
                label: store.t(waiting.isEmpty ? Copy.reminderAlready : Copy.remindLater),
                onPressed: waiting.isEmpty ? null : () => store.remindMedicines(waiting.map((item) => item.id).toList(), 10),
              ),
            ],
          ],
        ],
      ),
    );
  }
}

String _view(Medicine medicine, DateTime now) {
  final status = statusOf(medicine, now);
  if (status == MedStatus.taken) return 'taken';
  if (status == MedStatus.upcoming) return 'upcoming';
  return medicine.snoozeCount >= 2 ? 'overdue' : 'due';
}

Future<void> _speak(AppStore store, Medicine medicine) async {
  final line = '${medicine.name}. ${Copy.slotWhen(medicine.slot).of(store.hindi)}. ${formatHm(medicine.time, store.hindi)}.';
  final tts = FlutterTts();
  await tts.setLanguage(store.hindi ? 'hi-IN' : 'en-IN');
  await tts.speak(line);
}

class _Confirm extends StatelessWidget {
  final List<String> names;
  final VoidCallback onClose;
  final VoidCallback onYes;
  const _Confirm({required this.names, required this.onClose, required this.onYes});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(store.t(Copy.confirmMark), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
          for (final name in names) Padding(padding: const EdgeInsets.only(top: 8), child: Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy))),
          const SizedBox(height: 12),
          PrimaryButton(label: store.t(Copy.markRemaining), onPressed: onYes),
          const SizedBox(height: 8),
          OutlineButton(label: store.t(Copy.close), onPressed: onClose),
        ],
      ),
    );
  }
}

class MedicineDetailScreen extends StatelessWidget {
  final String id;
  const MedicineDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final medicine = store.data.medicines.where((item) => item.id == id).firstOrNull;
    if (medicine == null) {
      return ListView(children: [ScreenHeader(title: store.t(Copy.medicines)), Text(store.t(Copy.emptyNotes))]);
    }
    final status = statusOf(medicine, store.now);
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.slotTitle(medicine.slot))),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: status == MedStatus.taken ? const Color(0xFFE7F7EE) : Colors.white,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: const Color(0x1A202E63)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(store.t(status == MedStatus.taken ? Copy.taken : status == MedStatus.upcoming ? Copy.upcoming : Copy.takeNow), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
              Center(child: Image.asset(pillFor(medicine.id), height: 112)),
              Text(medicine.name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.navy)),
              Text(formatHm(medicine.time, store.hindi), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const SizedBox(height: 6),
              Text(store.t(Copy.slotWhen(medicine.slot)), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
              if (status == MedStatus.needsAttention) ...[const SizedBox(height: 8), const Bilingual(Copy.unconfirmed)],
            ],
          ),
        ),
        const SizedBox(height: 12),
        const Bilingual(Copy.savedNote),
        const SizedBox(height: 12),
        Text(store.t(Copy.reminderTime), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 6),
        OutlinedButton(
          onPressed: () async {
            final picked = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(atTimeToday(medicine.time, DateTime.now())));
            if (picked == null) return;
            store.setMedicineTime(medicine.id, '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}');
          },
          style: OutlinedButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size.fromHeight(56), foregroundColor: AppColors.navy),
          child: Text(formatHm(medicine.time, store.hindi), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
        ),
        const SizedBox(height: 12),
        if (status == MedStatus.taken)
          Text(store.t(Copy.markTaken), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700))
        else ...[
          PrimaryButton(
            label: store.t(Copy.iveTaken),
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
      ],
    );
  }
}

class MedicineDoneScreen extends StatelessWidget {
  final String id;
  const MedicineDoneScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final medicine = store.data.medicines.where((item) => item.id == id).firstOrNull;
    final next = nextOpenMedicine(store.data.medicines, id, store.now);
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.wellDone)),
        const Center(child: CircleAvatar(radius: 52, backgroundColor: AppColors.success, child: Icon(Icons.check, color: Colors.white, size: 64))),
        const SizedBox(height: 16),
        Text(store.t(Copy.markTaken), style: const TextStyle(fontSize: 18)),
        if (medicine != null) Text(medicine.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: next == null
              ? Text(store.t(Copy.noMore), style: const TextStyle(fontSize: 18))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(store.t(statusOf(next, store.now) == MedStatus.needsAttention ? Copy.stillToConfirm : Copy.nextReminder), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 6),
                    Text('${next.name} · ${formatHm(next.time, store.hindi)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    if (statusOf(next, store.now) == MedStatus.needsAttention) ...[const SizedBox(height: 8), const Bilingual(Copy.unconfirmed)],
                  ],
                ),
        ),
        const SizedBox(height: 16),
        PrimaryButton(label: store.t(Copy.backHome), onPressed: () => context.read<Nav>().go('home')),
        const SizedBox(height: 8),
        if (medicine != null)
          OutlineButton(
            label: store.t(Copy.undo),
            onPressed: () {
              store.undoMedicine(medicine.id);
              context.read<Nav>().open('medicine', medicine.id);
            },
          ),
      ],
    );
  }
}
