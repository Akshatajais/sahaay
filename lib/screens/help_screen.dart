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

const _priya = _Person('priya', 'Priya Sharma', Copy.daughter, '+91 98765 43210', 'assets/people/priya.png');
const _rahul = _Person('rahul', 'Ravi Kumar', Copy.son, '+91 98765 11111', 'assets/people/ravi.png');
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
  Timer? responseTimer;

  String get view => stack.last;

  @override
  void dispose() {
    responseTimer?.cancel();
    super.dispose();
  }

  void push(String name) => setState(() => stack.add(name));

  void back() {
    if (cancelOpen) {
      setState(() => cancelOpen = false);
      return;
    }
    if (view == 'active') responseTimer?.cancel();
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
    responseTimer?.cancel();
    responseTimer = Timer(const Duration(seconds: 6), () {
      if (!mounted || !live) return;
      final id = context.read<AppStore>().familyIdForSos(_priya.id, _priya.name);
      if (id != null) context.read<AppStore>().addFamilyMessage(id, 'sos', familyRespondedNote());
      setState(() => responding = true);
    });
    setState(() {
      live = true;
      responding = false;
      cancelOpen = false;
      stack
        ..clear()
        ..addAll(['main', 'active']);
    });
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final header = Row(
      children: [
        IconButton(
          onPressed: back,
          icon: const Icon(Icons.chevron_left),
          style: IconButton.styleFrom(backgroundColor: Colors.white, minimumSize: const Size(48, 48), foregroundColor: AppColors.navy),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(store.t(Copy.sosTitle), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy)),
          ),
        ),
        if (live && view == 'active')
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: AppColors.sos, borderRadius: BorderRadius.circular(99)),
            child: Text(store.t(Copy.live), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
          ),
      ],
    );
    return Stack(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header,
            const SizedBox(height: 16),
            Expanded(
              child: view == 'main'
                  ? _Main(onSos: startSos, onFamily: () => push('contacts'), onAssist: () => push('assist'))
                  : view == 'active'
                      ? _Active(
                          responding: responding,
                          onCall: () => setState(() {
                            calling = _line;
                            stack.add('call');
                          }),
                          onCancel: () => setState(() => cancelOpen = true),
                        )
                      : ListView(
                      padding: EdgeInsets.zero,
                      children: [
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
            if (view == 'assist') _Assist(onPick: (index) => setState(() { assistId = '$index'; stack.add('assistPick'); }), onSos: startSos),
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
                onSos: startSos,
              ),
            if (view == 'assistDone')
              _AssistDone(
                index: int.parse(assistId ?? '0'),
                onCall: () => setState(() { calling = _priya; stack.add('call'); }),
                onSos: startSos,
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
            ),
          ],
        ),
        if (cancelOpen) _CancelModal(onYes: () => setState(() {
          responseTimer?.cancel();
          live = false;
          responding = false;
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
        Text(store.t(Copy.areYouOk), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.1)),
        const SizedBox(height: 20),
        Expanded(child: _SosCard(Icons.phone, store.t(Copy.emergencySos), AppColors.sos, Colors.white, onSos)),
        const SizedBox(height: 16),
        Expanded(child: _SosCard(Icons.phone, store.t(Copy.callMyFamily), const Color(0xFFE7F7EE), AppColors.navy, onFamily)),
        const SizedBox(height: 16),
        Expanded(child: _SosCard(Icons.volunteer_activism, store.t(Copy.needAssist), const Color(0xFFE7F3FB), AppColors.navy, onAssist)),
      ],
    );
  }
}

class _SosCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final Color foreground;
  final VoidCallback onTap;
  const _SosCard(this.icon, this.title, this.color, this.foreground, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(28),
      child: InkWell(
        borderRadius: BorderRadius.circular(28),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 20),
          child: Row(
            children: [
              Icon(icon, size: 56, color: foreground),
              const SizedBox(width: 18),
              Expanded(
                child: Text(title, style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: foreground, height: 1.15)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Active extends StatelessWidget {
  final bool responding;
  final VoidCallback onCall;
  final VoidCallback onCancel;
  const _Active({required this.responding, required this.onCall, required this.onCancel});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          store.t(responding ? Copy.daughterResponding : Copy.activated),
          style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.1),
        ),
        Expanded(
          child: responding
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ClipOval(child: Image.asset(_priya.image!, width: 140, height: 140, fit: BoxFit.cover)),
                    const SizedBox(height: 12),
                    Text(_priya.name, textAlign: TextAlign.center, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 16),
                    _StatusLine(Icons.location_on, store.t(Copy.liveShared)),
                    const SizedBox(height: 10),
                    _StatusLine(Icons.check_circle, store.t(Copy.alertFamilySent)),
                  ],
                )
              : const Center(child: Icon(Icons.campaign, size: 120, color: AppColors.sos)),
        ),
        _SosAction(store.t(Copy.callEmergency), AppColors.sos, Colors.white, onCall),
        const SizedBox(height: 12),
        _SosAction(store.t(Copy.cancelSos), Colors.white, AppColors.navy, onCancel),
      ],
    );
  }
}

class _StatusLine extends StatelessWidget {
  final IconData icon;
  final String label;
  const _StatusLine(this.icon, this.label);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.success, size: 32),
        const SizedBox(width: 10),
        Expanded(child: Text(label, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.2))),
      ],
    );
  }
}

class _SosAction extends StatelessWidget {
  final String label;
  final Color color;
  final Color foreground;
  final VoidCallback onTap;
  const _SosAction(this.label, this.color, this.foreground, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: foreground == AppColors.navy ? const BorderSide(color: AppColors.navy, width: 2) : BorderSide.none,
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: SizedBox(
          height: 76,
          child: Center(child: Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: foreground))),
        ),
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
          leading: person.image == null ? null : ClipOval(child: Image.asset(person.image!, width: 56, height: 56, fit: BoxFit.cover)),
          title: Text(person.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: AppColors.navy)),
          subtitle: Text('${store.t(person.relation)} · ${person.phone}'),
          trailing: IconButton(
            onPressed: () => onCall(person),
            icon: const Icon(Icons.phone, color: Colors.white, size: 26),
            style: IconButton.styleFrom(backgroundColor: AppColors.navy, foregroundColor: Colors.white, minimumSize: const Size(48, 48)),
          ),
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
      if (widget.person.image != null) ClipOval(child: Image.asset(widget.person.image!, width: 140, height: 140, fit: BoxFit.cover)),
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
