import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart';

import '../l10n.dart';
import '../logic.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class VoiceScreen extends StatefulWidget {
  const VoiceScreen({super.key});

  @override
  State<VoiceScreen> createState() => _VoiceScreenState();
}

class _VoiceScreenState extends State<VoiceScreen> {
  final speech = SpeechToText();
  final input = TextEditingController();
  bool listening = false;
  bool available = true;
  String? heard;
  String? reply;
  String? error;

  @override
  void dispose() {
    speech.stop();
    input.dispose();
    super.dispose();
  }

  Future<void> toggle() async {
    final store = context.read<AppStore>();
    if (listening) {
      await speech.stop();
      if (!mounted) return;
      setState(() => listening = false);
      return;
    }
    final ok = await speech.initialize();
    if (!mounted) return;
    if (!ok) {
      setState(() {
        available = false;
        error = store.t(Copy.voiceMissing);
      });
      return;
    }
    setState(() {
      listening = true;
      error = null;
    });
    await speech.listen(
      // ignore: deprecated_member_use
      localeId: store.hindi ? 'hi_IN' : 'en_IN',
      onResult: (result) {
        if (!result.finalResult) return;
        input.text = result.recognizedWords;
        run(result.recognizedWords);
        setState(() => listening = false);
      },
    );
  }

  Future<void> run(String raw) async {
    final store = context.read<AppStore>();
    final text = raw.trim();
    if (text.isEmpty) {
      setState(() => error = store.t(Copy.noSpeech));
      return;
    }
    final intent = interpret(text);
    final nav = context.read<Nav>();
    String message;
    switch (intent.type) {
      case VoiceIntent.nextMedicine:
        final next = priorityMedicine(store.data.medicines, store.now);
        if (next == null) {
          message = store.t(Copy.noMore);
        } else {
          final when = formatHm(next.time, store.hindi);
          final unconfirmed = statusOf(next, store.now) == MedStatus.needsAttention;
          message = unconfirmed
              ? (store.hindi ? '${next.name} $when की अभी पुष्टि नहीं हुई। इसका मतलब यह नहीं कि दवा छूट गई।' : '${next.name} at $when is still unconfirmed. That does not mean it was missed.')
              : (store.hindi ? 'आपकी अगली दवा ${next.name} $when पर है।' : 'Your next medicine is ${next.name} at $when.');
          nav.open('medicine', next.id);
        }
      case VoiceIntent.sendMoney:
        message = store.t(Copy.sendConfirm);
        nav.open('send');
      case VoiceIntent.help:
        message = store.t(Copy.helpOpened);
        nav.go('help');
      case VoiceIntent.home:
        message = store.t(Copy.openedHome);
        nav.go('home');
      case VoiceIntent.habit:
        message = store.hindi ? '${Copy.habitTitle(intent.habit!).hi} खोल रहे हैं।' : 'Opening ${Copy.habitTitle(intent.habit!).en}.';
        nav.open('day');
      case VoiceIntent.call:
        final relation = intent.relation;
        final contact = relation == null || relation == 'any'
            ? null
            : store.data.contacts.where((item) => item.relation == relation).firstOrNull;
        if (contact == null) {
          message = store.t(Copy.callWho);
          nav.open('family');
        } else {
          message = store.hindi ? '${contact.name} को कॉल करें?' : 'Call ${contact.name}?';
          store.addFamilyMessage(contact.id, 'call', familyCallMessage(contact.name));
          nav.open('chat', '${contact.id}|call');
        }
      case VoiceIntent.unknown:
        message = store.t(Copy.notSure);
    }
    setState(() {
      heard = text;
      reply = message;
      error = null;
    });
    final tts = FlutterTts();
    await tts.setLanguage(store.hindi ? 'hi-IN' : 'en-IN');
    await tts.speak(message);
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.howCanIHelp), back: false),
        Center(
          child: SizedBox(
            width: 144,
            height: 144,
            child: FilledButton(
              style: FilledButton.styleFrom(backgroundColor: AppColors.navy, shape: const CircleBorder()),
              onPressed: available ? toggle : null,
              child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Icon(listening ? Icons.stop : Icons.mic, size: 42, color: Colors.white),
                Text(listening ? store.t(Copy.stop) : store.t(Copy.tapMic), textAlign: TextAlign.center, style: const TextStyle(color: Colors.white, fontSize: 14)),
              ]),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(listening ? store.t(Copy.listening) : store.t(Copy.tapMic), textAlign: TextAlign.center, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.navy)),
        if (error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(error!, style: const TextStyle(color: AppColors.sos))),
        const SizedBox(height: 20),
        Text(store.t(Copy.trySaying), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        for (final example in [Copy.cmdDaughter, Copy.cmdMedicine, Copy.cmdSend])
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: OutlineButton(label: store.t(example), onPressed: () { input.text = store.t(example); run(store.t(example)); }),
          ),
        const SizedBox(height: 8),
        Text(store.t(Copy.typeQuestion), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        TextField(controller: input, decoration: const InputDecoration(filled: true, fillColor: Colors.white)),
        const SizedBox(height: 8),
        PrimaryButton(label: store.t(Copy.ask), onPressed: () => run(input.text)),
        if (heard != null) ...[
          const SizedBox(height: 16),
          Text(store.t(Copy.youSaid), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(heard!),
          if (reply != null) Text(reply!, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
        ],
      ],
    );
  }
}
