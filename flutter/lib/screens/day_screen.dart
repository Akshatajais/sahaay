import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class DayScreen extends StatelessWidget {
  const DayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.myDay)),
        for (final habit in store.data.habits) _HabitCard(id: habit.id),
      ],
    );
  }
}

class _HabitCard extends StatelessWidget {
  final String id;
  const _HabitCard({required this.id});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final habit = store.data.habits.firstWhere((item) => item.id == id);
    final done = habitDoneToday(habit, store.now);
    final color = switch (id) {
      'water' => AppColors.money,
      'walk' => AppColors.care,
      'stretch' => AppColors.amber,
      _ => AppColors.blush,
    };
    final icon = switch (id) {
      'water' => Icons.water_drop,
      'walk' => Icons.directions_walk,
      'stretch' => Icons.accessibility_new,
      _ => Icons.bedtime,
    };
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(children: [
            Container(width: 72, height: 72, decoration: BoxDecoration(color: Colors.white70, borderRadius: BorderRadius.circular(20)), child: Icon(icon, size: 36, color: AppColors.navy)),
            const SizedBox(width: 12),
            Expanded(child: Text(store.t(Copy.habitTitle(id)), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy))),
          ]),
          const SizedBox(height: 12),
          Text(store.t(Copy.habitTime), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
          const SizedBox(height: 6),
          OutlinedButton(
            onPressed: () async {
              final picked = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(atTimeToday(habit.time, DateTime.now())));
              if (picked == null) return;
              store.setHabitTime(id, '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}');
            },
            style: OutlinedButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size.fromHeight(56), foregroundColor: AppColors.navy),
            child: Text(formatHm(habit.time, store.hindi), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          ),
          const SizedBox(height: 10),
          if (done) ...[
            Text(store.t(Copy.markedDone), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.success, fontSize: 18)),
            const SizedBox(height: 8),
            OutlineButton(label: store.t(Copy.undo), onPressed: () => store.undoHabit(id)),
          ] else ...[
            PrimaryButton(label: store.t(Copy.done), onPressed: () => store.markHabitDone(id)),
            const SizedBox(height: 8),
            OutlineButton(
              label: store.t(Copy.remindLater),
              onPressed: () async {
                final minutes = await showReminderSheet(context);
                if (minutes != null) store.remindHabit(id, minutes);
              },
            ),
          ],
        ],
      ),
    );
  }
}
