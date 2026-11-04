import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../day_session.dart';
import '../l10n.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class DayScreen extends StatelessWidget {
  const DayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final day = context.watch<DaySession>();
    final hindi = store.hindi;
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.only(bottom: 12),
            children: [
              const _SectionTitle(Localized('Your Day Today', 'आज का आपका दिन')),
              const SizedBox(height: 12),
              for (var i = 0; i < day.activities.length; i++)
                _TimelineItem(activity: day.activities[i], last: i == day.activities.length - 1, hindi: hindi),
              const SizedBox(height: 22),
              const _SectionTitle(Localized('Listen & Enjoy', 'सुनें और आनंद लें')),
              const SizedBox(height: 12),
              SizedBox(
                height: 214,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: DaySession.listen.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 12),
                  itemBuilder: (context, index) => _ListenCard(track: DaySession.listen[index], hindi: hindi),
                ),
              ),
              const SizedBox(height: 22),
              const _SectionTitle(Localized('Moments from Your Family ❤️', 'आपके परिवार के पल ❤️')),
              const SizedBox(height: 12),
              _BirthdayAnnouncement(birthday: DaySession.birthdaySoon, hindi: hindi),
              const SizedBox(height: 18),
              Text(hindi ? 'आने वाले जन्मदिन' : 'Upcoming birthdays', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const SizedBox(height: 10),
              for (final birthday in DaySession.upcomingBirthdays) ...[
                _UpcomingBirthday(birthday: birthday, hindi: hindi),
                const SizedBox(height: 10),
              ],
              const SizedBox(height: 8),
              Text(hindi ? 'पुरानी यादें' : 'Throwbacks', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const SizedBox(height: 10),
              for (final photo in DaySession.photos) ...[
                _ThrowbackCard(photo: photo, hindi: hindi),
                const SizedBox(height: 12),
              ],
            ],
          ),
        ),
        if (day.playId != null) _MiniPlayer(hindi: hindi),
      ],
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final Localized title;
  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    final hindi = context.watch<AppStore>().hindi;
    return Text(title.of(hindi), style: const TextStyle(fontSize: 26, height: 1.15, fontWeight: FontWeight.w800, color: AppColors.navy));
  }
}

class _TimelineItem extends StatelessWidget {
  final DayActivity activity;
  final bool last;
  final bool hindi;
  const _TimelineItem({required this.activity, required this.last, required this.hindi});

  @override
  Widget build(BuildContext context) {
    final day = context.read<DaySession>();
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 74,
            child: Text(_clock(activity.hour, activity.minute, hindi), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.navy)),
          ),
          SizedBox(
            width: 28,
            child: Column(
              children: [
                Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(color: activity.done ? AppColors.success : AppColors.navy, shape: BoxShape.circle),
                ),
                if (!last) Expanded(child: Container(width: 2, color: const Color(0x33202E63))),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: _SoftCard(
                tint: activity.tint,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                          child: Icon(activity.icon, color: AppColors.navy, size: 30),
                        ),
                        const SizedBox(width: 10),
                        Expanded(child: Text(activity.title.of(hindi), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.15))),
                        if (activity.done) const Icon(Icons.check_circle, color: AppColors.success, size: 28),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (activity.medicine)
                      _Pill(hindi ? 'याद दिलाना' : 'Reminder')
                    else if (activity.done)
                      _Pill(hindi ? 'आज हो गया' : 'Done for today', color: const Color(0xFFE5F6EA), ink: AppColors.success)
                    else ...[
                      if (activity.later) ...[
                        _Pill(hindi ? 'थोड़ी देर बाद याद दिलाएँगे' : "We'll remind you later", color: const Color(0xFFFFF6E4), ink: AppColors.amberInk),
                        const SizedBox(height: 8),
                      ],
                      SizedBox(
                        height: 48,
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: () => day.complete(activity.id),
                          style: FilledButton.styleFrom(backgroundColor: AppColors.navy, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                          child: Text(hindi ? 'मैंने कर लिया' : 'I did this', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                        ),
                      ),
                      TextButton(
                        onPressed: activity.later ? null : () => day.remindLater(activity.id),
                        style: TextButton.styleFrom(minimumSize: const Size.fromHeight(48), foregroundColor: AppColors.navy),
                        child: Text(storeLabel(context), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String storeLabel(BuildContext context) => context.read<AppStore>().t(Copy.remindLater);
}

class _ListenCard extends StatelessWidget {
  final ListenTrack track;
  final bool hindi;
  const _ListenCard({required this.track, required this.hindi});

  @override
  Widget build(BuildContext context) {
    final day = context.watch<DaySession>();
    final active = day.playId == track.id;
    return Material(
      color: track.tint,
      borderRadius: BorderRadius.circular(22),
      elevation: 0,
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: () => day.play(track.id),
        child: Container(
          width: 176,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            boxShadow: const [BoxShadow(color: Color(0x14202E63), blurRadius: 12, offset: Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 72,
                width: double.infinity,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                child: Icon(track.icon, size: 40, color: AppColors.navy),
              ),
              const SizedBox(height: 8),
              Text(track.title.of(hindi), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 17, height: 1.15, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const Spacer(),
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(color: AppColors.navy, shape: BoxShape.circle),
                    child: Icon(day.playing(track.id) ? Icons.pause : Icons.play_arrow, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      active ? (day.paused ? (hindi ? 'रुका है' : 'Paused') : (hindi ? 'चल रहा है' : 'Playing')) : (hindi ? 'सुनें' : 'Play'),
                      style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BirthdayAnnouncement extends StatelessWidget {
  final FamilyBirthday birthday;
  final bool hindi;
  const _BirthdayAnnouncement({required this.birthday, required this.hindi});

  @override
  Widget build(BuildContext context) {
    return _SoftCard(
      tint: const Color(0xFFFFF6E4),
      child: Row(
        children: [
          ClipOval(child: Image.asset(birthday.image, width: 72, height: 72, fit: BoxFit.cover)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text(hindi ? 'इस रविवार जन्मदिन' : 'Birthday this Sunday', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF8A5A00)))),
                    const Icon(Icons.cake, color: Color(0xFFE0A106), size: 28),
                  ],
                ),
                const SizedBox(height: 2),
                Text(birthday.name.of(hindi), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
                Text(birthday.relation.of(hindi), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink)),
                Text(birthday.when.of(hindi), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _UpcomingBirthday extends StatelessWidget {
  final FamilyBirthday birthday;
  final bool hindi;
  const _UpcomingBirthday({required this.birthday, required this.hindi});

  @override
  Widget build(BuildContext context) {
    return _SoftCard(
      tint: Colors.white,
      child: Row(
        children: [
          ClipOval(child: Image.asset(birthday.image, width: 56, height: 56, fit: BoxFit.cover)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(birthday.name.of(hindi), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                Text('${birthday.relation.of(hindi)} · ${birthday.when.of(hindi)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.ink)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ThrowbackCard extends StatelessWidget {
  final FamilyPhoto photo;
  final bool hindi;
  const _ThrowbackCard({required this.photo, required this.hindi});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(22),
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: () => context.read<Nav>().open('moment', photo.id),
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            boxShadow: const [BoxShadow(color: Color(0x12202E63), blurRadius: 10, offset: Offset(0, 3))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                child: Image.asset(photo.image, height: 180, width: double.infinity, fit: BoxFit.cover),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(photo.event.of(hindi), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 2),
                    Text(photo.date.of(hindi), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.ink)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MiniPlayer extends StatelessWidget {
  final bool hindi;
  const _MiniPlayer({required this.hindi});

  @override
  Widget build(BuildContext context) {
    final day = context.watch<DaySession>();
    final title = day.playingTitle(hindi) ?? '';
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.fromLTRB(14, 8, 8, 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Color(0x24202E63), blurRadius: 16, offset: Offset(0, 4))],
      ),
      child: Row(
        children: [
          const Icon(Icons.graphic_eq, color: AppColors.navy),
          const SizedBox(width: 10),
          Expanded(child: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy))),
          IconButton(
            onPressed: () => day.play(day.playId!),
            icon: Icon(day.paused ? Icons.play_arrow : Icons.pause, color: AppColors.navy),
            tooltip: day.paused ? (hindi ? 'चलाएँ' : 'Play') : (hindi ? 'रोकें' : 'Pause'),
          ),
          IconButton(
            onPressed: day.stop,
            icon: const Icon(Icons.stop, color: AppColors.sos),
            tooltip: hindi ? 'बंद करें' : 'Stop',
          ),
        ],
      ),
    );
  }
}

class _SoftCard extends StatelessWidget {
  final Color tint;
  final Widget child;
  const _SoftCard({required this.tint, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tint,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [BoxShadow(color: Color(0x12202E63), blurRadius: 10, offset: Offset(0, 3))],
      ),
      child: child,
    );
  }
}

class _Pill extends StatelessWidget {
  final String label;
  final Color color;
  final Color ink;
  const _Pill(this.label, {this.color = Colors.white, this.ink = AppColors.navy});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(999)),
      child: Text(label, style: TextStyle(fontWeight: FontWeight.w800, color: ink)),
    );
  }
}

String _clock(int hour, int minute, bool hindi) {
  final h = hour % 12 == 0 ? 12 : hour % 12;
  final m = minute.toString().padLeft(2, '0');
  final suffix = hour < 12 ? (hindi ? 'सुबह' : 'AM') : (hindi ? 'शाम' : 'PM');
  if (hindi && hour >= 12 && hour < 16) return '$h:$m दोपहर';
  return hindi ? '$h:$m $suffix' : '$h:$m $suffix';
}
