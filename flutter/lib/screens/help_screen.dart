import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class _Person {
  final String id;
  final String name;
  final Localized relation;
  final String phone;
  final String? image;
  const _Person(this.id, this.name, this.relation, this.phone, this.image);
}

const _priya = _Person('priya', 'Priya', Copy.daughter, '+91 98765 43210', 'assets/icons/avatar-woman.png');
const _rahul = _Person('rahul', 'Rahul', Copy.son, '+91 98765 43211', 'assets/icons/avatar-man.png');
const _line = _Person('112', '112', Copy.services, '112', null);
const _family = [_priya, _rahul];

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final List<String> stack = ['main'];
  String? assistId;
  _Person? calling;
  bool live = false;
  bool responding = false;
  bool cancelOpen = false;
  String? respondedAt;

  String get view => stack.last;

  void push(String name) => setState(() => stack.add(name));

  void back() {
    if (cancelOpen) {
      setState(() => cancelOpen = false);
      return;
    }
    if (stack.length <= 1) {
      context.read<Nav>().go('home');
      return;
    }
    setState(() => stack.removeLast());
  }

  void startSos() {
    final store = context.read<AppStore>();
    for (final person in _family) {
      final id = store.familyIdForSos(person.id, person.name);
      if (id != null) store.addFamilyMessage(id, 'sos', sosFamilyAlert());
    }
    setState(() {
      live = true;
      responding = false;
      respondedAt = null;
      stack
        ..clear()
        ..addAll(['main', 'active']);
    });
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Stack(
      children: [
        ListView(
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: back,
                  icon: const Icon(Icons.chevron_left),
                  style: IconButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size(48, 48), foregroundColor: AppColors.navy),
                ),
                const SizedBox(width: 8),
                Expanded(child: Text(store.t(Copy.sosTitle), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy))),
                if (live && view == 'active')
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(color: AppColors.sos, borderRadius: BorderRadius.circular(99)),
                    child: Text(store.t(Copy.live), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            if (view == 'main') _Main(onSos: () => push('confirm'), onFamily: () => push('contacts'), onAssist: () => push('assist')),
            if (view == 'confirm') _Confirm(onStart: startSos, onCancel: back),
            if (view == 'active')
              _Active(
                responding: responding,
                respondedAt: respondedAt,
                onToggle: () {
                  final store = context.read<AppStore>();
                  if (!responding) {
                    final id = store.familyIdForSos(_priya.id, _priya.name);
                    if (id != null) store.addFamilyMessage(id, 'sos', familyRespondedNote());
                    setState(() {
                      responding = true;
                      respondedAt = DateTime.now().toIso8601String();
                    });
                  } else {
                    setState(() {
                      responding = false;
                      respondedAt = null;
                    });
                  }
                },
                onCall112: () => setState(() {
                  calling = _line;
                  stack.add('call');
                }),
                onFamily: () => push('contacts'),
                onCancel: () => setState(() => cancelOpen = true),
              ),
            if (view == 'contacts')
              _Contacts(onCall: (person) {
                final id = context.read<AppStore>().familyIdForSos(person.id, person.name);
                if (id != null) {
                  final contact = context.read<AppStore>().data.contacts.where((item) => item.id == id).firstOrNull;
                  context.read<AppStore>().addFamilyMessage(id, 'call', familyCallMessage(contact?.name ?? person.name));
                }
                setState(() {
                  calling = person;
                  stack.add('call');
                });
              }),
            if (view == 'call' && calling != null) _Call(person: calling!, onEnd: back),
            if (view == 'assist') _Assist(onPick: (index) => setState(() { assistId = '$index'; stack.add('assistPick'); }), onSos: () => push('confirm')),
            if (view == 'assistPick')
              _AssistDetail(
                index: int.parse(assistId ?? '0'),
                onSubmit: () {
                  final index = int.parse(assistId ?? '0');
                  final id = context.read<AppStore>().familyIdForSos(_priya.id, _priya.name);
                  if (id != null) context.read<AppStore>().addFamilyMessage(id, 'assist', assistFamilyMessage(Copy.needs[index]));
                  push('assistDone');
                },
                onCall: () => setState(() { calling = _priya; stack.add('call'); }),
                onSos: () => push('confirm'),
              ),
            if (view == 'assistDone')
              _AssistDone(
                index: int.parse(assistId ?? '0'),
                onCall: () => setState(() { calling = _priya; stack.add('call'); }),
                onSos: () => push('confirm'),
              ),
            if (view == 'cancelled')
              _Cancelled(onDone: () => setState(() {
                live = false;
                stack
                  ..clear()
                  ..add('main');
              })),
          ],
        ),
        if (cancelOpen) _CancelModal(onYes: () => setState(() {
          live = false;
          responding = false;
          respondedAt = null;
          cancelOpen = false;
          stack
            ..clear()
            ..addAll(['main', 'cancelled']);
        }), onNo: () => setState(() => cancelOpen = false)),
      ],
    );
  }
}

class _Main extends StatelessWidget {
  final VoidCallback onSos;
  final VoidCallback onFamily;
  final VoidCallback onAssist;
  const _Main({required this.onSos, required this.onFamily, required this.onAssist});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(store.t(Copy.areYouOk), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.1)),
        const SizedBox(height: 8),
        Text(store.t(Copy.chooseNeed), style: const TextStyle(fontSize: 18, height: 1.3)),
        const SizedBox(height: 16),
        _SosCard(Icons.phone, store.t(Copy.emergencySos), store.t(Copy.needImmediate), store.t(Copy.alertFamily), AppColors.sos, Colors.white, onSos),
        const SizedBox(height: 12),
        _SosCard(Icons.phone, store.t(Copy.callMyFamily), store.t(Copy.speakTrust), '', const Color(0xFFE7F7EE), AppColors.navy, onFamily),
        const SizedBox(height: 12),
        _SosCard(Icons.volunteer_activism, store.t(Copy.needAssist), store.t(Copy.notEmergency), '', const Color(0xFFE7F3FB), AppColors.navy, onAssist),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0x1A202E63))),
          child: Text(store.t(Copy.locationShare), style: const TextStyle(fontSize: 16, height: 1.3)),
        ),
      ],
    );
  }
}

class _SosCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;
  final String extra;
  final Color color;
  final Color foreground;
  final VoidCallback onTap;
  const _SosCard(this.icon, this.title, this.body, this.extra, this.color, this.foreground, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(icon, size: 42, color: foreground),
            const SizedBox(height: 12),
            Text(title, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: foreground, height: 1.1)),
            const SizedBox(height: 4),
            Text(body, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: foreground, height: 1.3)),
            if (extra.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(extra, style: TextStyle(fontSize: 16, color: foreground.withValues(alpha: 0.9), height: 1.3)),
            ],
          ]),
        ),
      ),
    );
  }
}

class _Confirm extends StatelessWidget {
  final VoidCallback onStart;
  final VoidCallback onCancel;
  const _Confirm({required this.onStart, required this.onCancel});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const Icon(Icons.campaign, size: 64, color: AppColors.sos),
      Text(store.t(Copy.startAsk), textAlign: TextAlign.center, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy)),
      Text(store.t(Copy.startBody), textAlign: TextAlign.center, style: const TextStyle(fontSize: 18)),
      const SizedBox(height: 12),
      for (final row in [Copy.rowContacts, Copy.rowLocation, Copy.rowAccess])
        Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0x1A202E63))),
          child: Row(children: [const Icon(Icons.check, color: AppColors.navy), const SizedBox(width: 8), Expanded(child: Text(store.t(row), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)))]),
        ),
      PrimaryButton(label: store.t(Copy.yesStart), background: AppColors.sos, onPressed: onStart),
      const SizedBox(height: 8),
      OutlineButton(label: store.t(Copy.cancel), onPressed: onCancel),
    ]);
  }
}

class _Active extends StatelessWidget {
  final bool responding;
  final String? respondedAt;
  final VoidCallback onToggle;
  final VoidCallback onCall112;
  final VoidCallback onFamily;
  final VoidCallback onCancel;
  const _Active({required this.responding, required this.respondedAt, required this.onToggle, required this.onCall112, required this.onFamily, required this.onCancel});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(store.t(Copy.activated), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy)),
      Text(store.t(Copy.activatedBody), style: const TextStyle(fontSize: 18)),
      const SizedBox(height: 12),
      _Check(store.t(Copy.alertSent)),
      _Check(store.t(Copy.locationStarted)),
      _Check(responding ? store.t(Copy.daughterResponding) : store.t(Copy.waitingFamily)),
      if (responding) ...[
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0xFFE5F6EA), borderRadius: BorderRadius.circular(16)),
          child: Text(store.t(Copy.priyaOnWay), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.success)),
        ),
      ],
      const SizedBox(height: 12),
      Row(children: [
        _PersonChip(_priya, responding ? store.t(Copy.onTheWay) : store.t(Copy.waiting)),
        const SizedBox(width: 8),
        _PersonChip(_rahul, store.t(Copy.waiting)),
      ]),
      const SizedBox(height: 12),
      Container(
        height: 120,
        decoration: BoxDecoration(color: const Color(0xFFD7EBD4), borderRadius: BorderRadius.circular(20)),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.location_on, color: AppColors.navy, size: 32),
          Text(store.t(Copy.yourLocation), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(store.t(Copy.liveShared)),
          if (respondedAt != null) Text(formatWhen(respondedAt!, store.hindi), style: const TextStyle(color: AppColors.muted)),
        ]),
      ),
      const SizedBox(height: 12),
      PrimaryButton(label: store.t(Copy.call112), background: AppColors.sos, onPressed: onCall112),
      const SizedBox(height: 8),
      OutlineButton(label: store.t(Copy.callMyFamily), onPressed: onFamily),
      const SizedBox(height: 8),
      OutlineButton(label: store.t(responding ? Copy.showWaiting : Copy.showResponding), onPressed: onToggle),
      const SizedBox(height: 8),
      OutlineButton(label: store.t(Copy.cancelSos), onPressed: onCancel),
    ]);
  }
}

class _Check extends StatelessWidget {
  final String label;
  const _Check(this.label);
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(children: [const Icon(Icons.check_circle, color: AppColors.success), const SizedBox(width: 8), Expanded(child: Text(label, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)))]),
    );
  }
}

class _PersonChip extends StatelessWidget {
  final _Person person;
  final String status;
  const _PersonChip(this.person, this.status);
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(children: [
          if (person.image != null) Image.asset(person.image!, width: 56, height: 56),
          Text(person.name, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(status, style: const TextStyle(color: AppColors.muted)),
        ]),
      ),
    );
  }
}

class _Contacts extends StatelessWidget {
  final void Function(_Person) onCall;
  const _Contacts({required this.onCall});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(children: [
      for (final person in _family)
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: person.image == null ? null : Image.asset(person.image!, width: 56),
          title: Text(person.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: AppColors.navy)),
          subtitle: Text('${store.t(person.relation)} · ${person.phone}'),
          trailing: IconButton(onPressed: () => onCall(person), icon: const Icon(Icons.phone, color: AppColors.navy), style: IconButton.styleFrom(backgroundColor: AppColors.navy, foregroundColor: Colors.white, minimumSize: const Size(48, 48))),
        ),
    ]);
  }
}

class _Call extends StatefulWidget {
  final _Person person;
  final VoidCallback onEnd;
  const _Call({required this.person, required this.onEnd});
  @override
  State<_Call> createState() => _CallState();
}

class _CallState extends State<_Call> {
  int seconds = 0;
  bool speaker = false;
  bool mute = false;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(const Duration(seconds: 1), (_) => setState(() => seconds++));
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final clock = '${(seconds ~/ 60).toString().padLeft(2, '0')}:${(seconds % 60).toString().padLeft(2, '0')}';
    return Column(children: [
      if (widget.person.image != null) Image.asset(widget.person.image!, width: 140, height: 140),
      Text(widget.person.name, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.navy)),
      Text(store.t(Copy.calling), style: const TextStyle(fontSize: 18)),
      Text(clock, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
      const SizedBox(height: 20),
      Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        _Round(store.t(Copy.speaker), Icons.volume_up, speaker, () => setState(() => speaker = !speaker)),
        _Round(store.t(Copy.mute), Icons.mic_off, mute, () => setState(() => mute = !mute)),
      ]),
      const SizedBox(height: 20),
      PrimaryButton(label: store.t(Copy.endCall), background: AppColors.sos, onPressed: widget.onEnd),
    ]);
  }
}

class _Round extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool on;
  final VoidCallback toggle;
  const _Round(this.label, this.icon, this.on, this.toggle);
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      IconButton(onPressed: toggle, icon: Icon(icon), style: IconButton.styleFrom(backgroundColor: on ? AppColors.navy : Colors.white, foregroundColor: on ? Colors.white : AppColors.navy, minimumSize: const Size(64, 64))),
      Text(label),
    ]);
  }
}

class _Assist extends StatelessWidget {
  final void Function(int) onPick;
  final VoidCallback onSos;
  const _Assist({required this.onPick, required this.onSos});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(store.t(Copy.whatNeed), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy)),
      const SizedBox(height: 12),
      for (var i = 0; i < Copy.needs.length; i++) ...[
        OutlineButton(label: store.t(Copy.needs[i]), onPressed: () => onPick(i)),
        const SizedBox(height: 8),
      ],
      Text(store.t(Copy.danger), style: const TextStyle(color: AppColors.sos, fontWeight: FontWeight.w700)),
      TextButton(onPressed: onSos, child: Text(store.t(Copy.emergencySos))),
    ]);
  }
}

class _AssistDetail extends StatelessWidget {
  final int index;
  final VoidCallback onSubmit;
  final VoidCallback onCall;
  final VoidCallback onSos;
  const _AssistDetail({required this.index, required this.onSubmit, required this.onCall, required this.onSos});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(store.t(Copy.needs[index]), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy)),
      const SizedBox(height: 16),
      PrimaryButton(label: store.t(Copy.submitRequest), onPressed: onSubmit),
      const SizedBox(height: 8),
      OutlineButton(label: store.t(Copy.callPriya), onPressed: onCall),
      const SizedBox(height: 12),
      Text(store.t(Copy.danger)),
      TextButton(onPressed: onSos, child: Text(store.t(Copy.emergencySos))),
    ]);
  }
}

class _AssistDone extends StatelessWidget {
  final int index;
  final VoidCallback onCall;
  final VoidCallback onSos;
  const _AssistDone({required this.index, required this.onCall, required this.onSos});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const Icon(Icons.check_circle, color: AppColors.success, size: 64),
      Text(store.t(Copy.requestSubmitted), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy)),
      Text(store.t(Copy.needs[index]), style: const TextStyle(fontSize: 18)),
      const SizedBox(height: 8),
      Text(store.t(Copy.requestBody)),
      const SizedBox(height: 8),
      Text(store.t(Copy.onDevice), style: const TextStyle(color: AppColors.muted)),
      const SizedBox(height: 16),
      OutlineButton(label: store.t(Copy.callPriya), onPressed: onCall),
      TextButton(onPressed: onSos, child: Text(store.t(Copy.emergencySos))),
    ]);
  }
}

class _Cancelled extends StatelessWidget {
  final VoidCallback onDone;
  const _Cancelled({required this.onDone});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(store.t(Copy.cancelledTitle), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy)),
      Text(store.t(Copy.cancelledBody), style: const TextStyle(fontSize: 18)),
      const SizedBox(height: 16),
      PrimaryButton(label: store.t(Copy.backToSos), onPressed: onDone),
    ]);
  }
}

class _CancelModal extends StatelessWidget {
  final VoidCallback onYes;
  final VoidCallback onNo;
  const _CancelModal({required this.onYes, required this.onNo});
  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return ColoredBox(
      color: const Color(0x73202E63),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(24)),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text(store.t(Copy.cancelAsk), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
            const SizedBox(height: 12),
            PrimaryButton(label: store.t(Copy.yesCancel), background: AppColors.sos, onPressed: onYes),
            const SizedBox(height: 8),
            OutlineButton(label: store.t(Copy.stillNeed), onPressed: onNo),
          ]),
        ),
      ),
    );
  }
}
