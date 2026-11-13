import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

const demoLimit = 10000;
const demoQr = 'upi://pay?pa=sahaay.demo@okaxis&pn=Sahaay%20Demonstration&cu=INR';

class MoneyScreen extends StatefulWidget {
  const MoneyScreen({super.key});

  @override
  State<MoneyScreen> createState() => _MoneyScreenState();
}

class _MoneyScreenState extends State<MoneyScreen> {
  bool showAll = false;

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final nav = context.read<Nav>();
    final history = [...store.data.transactions]..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    final visible = showAll ? history : history.take(3);
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.money)),
        Material(
          color: const Color(0xFFE3F1FB),
          borderRadius: BorderRadius.circular(28),
          child: InkWell(
            borderRadius: BorderRadius.circular(28),
            onTap: () => nav.open('send'),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Expanded(child: Text(store.t(Copy.sendMoney), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.navy, height: 1.1))),
                  Image.asset('assets/icons/money.png', width: 120, height: 104, fit: BoxFit.contain),
                  const SizedBox(width: 8),
                  const CircleAvatar(radius: 22, backgroundColor: Colors.white, child: Icon(Icons.chevron_right, color: AppColors.navy)),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(child: Text(store.t(Copy.recentPayments), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy))),
            if (history.isNotEmpty && !showAll)
              TextButton.icon(
                onPressed: () => setState(() => showAll = true),
                icon: Text(store.t(Copy.viewAll), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
                label: const Icon(Icons.chevron_right, color: AppColors.navy, size: 18),
                style: TextButton.styleFrom(backgroundColor: const Color(0xFFE3F1FB), foregroundColor: AppColors.navy),
              ),
          ],
        ),
        const SizedBox(height: 8),
        if (history.isEmpty)
          Text(store.t(Copy.noPayments), style: const TextStyle(fontSize: 18))
        else
          for (final item in visible) _PaymentRow(item: item, onTap: () => nav.open('payment', item.id)),
      ],
    );
  }
}

class _PaymentRow extends StatelessWidget {
  final Transaction item;
  final VoidCallback onTap;
  const _PaymentRow({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final person = store.data.contacts.where((contact) => contact.id == item.contactId || contact.name == item.name).firstOrNull;
    final sent = item.direction == 'sent';
    final tone = switch (item.status) {
      'success' => (const Color(0xFFE5F6EA), AppColors.success),
      'failed' => (const Color(0xFFF8E4E4), const Color(0xFF8E1B28)),
      'cancelled' => (AppColors.cream, AppColors.muted),
      _ => (AppColors.amber, AppColors.amberInk),
    };
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(radius: 28, backgroundColor: Colors.white, backgroundImage: AssetImage(portraitFor(person?.relation ?? 'other', item.name))),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy, fontSize: 17)),
                      Text(formatWhen(item.createdAt, store.hindi), style: const TextStyle(color: AppColors.muted)),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: const Color(0xFFF8E4E4), borderRadius: BorderRadius.circular(99)),
                        child: Text(store.t(sent ? Copy.youSent : Copy.youReceived), style: const TextStyle(color: Color(0xFF8E1B28), fontWeight: FontWeight.w800, fontSize: 13)),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('${sent ? '-' : ''}${formatRupees(item.amount)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: tone.$1, borderRadius: BorderRadius.circular(99)),
                      child: Text(store.t(Copy.txStatus(item.status)), style: TextStyle(color: tone.$2, fontWeight: FontWeight.w800, fontSize: 13)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class SendMoneyScreen extends StatefulWidget {
  const SendMoneyScreen({super.key});

  @override
  State<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends State<SendMoneyScreen> {
  String stage = 'choose';
  String via = 'number';
  Contact? payee;
  String? customName;
  String? customUpi;
  String phone = '';
  String amountDigits = '';

  int get amount => int.tryParse(amountDigits.isEmpty ? '0' : amountDigits) ?? 0;
  bool get overLimit => amount > demoLimit;

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final title = switch (stage) {
      'scan' => store.t(Copy.scanQr),
      'found' => payee?.name ?? customName ?? store.t(Copy.scanQr),
      'number' => store.t(Copy.enterNumber),
      'amount' => store.t(Copy.amountTitle),
      'review' => store.t(Copy.reviewTitle),
      _ => store.t(Copy.sendMoney),
    };
    return ListView(
      children: [
        ScreenHeader(
          title: title,
          onBack: () {
            if (stage == 'choose') {
              context.read<Nav>().back();
            } else if (stage == 'found') {
              setState(() => stage = 'scan');
            } else if (stage == 'amount') {
              setState(() => stage = via == 'scan' ? 'found' : 'number');
            } else if (stage == 'review') {
              setState(() => stage = 'amount');
            } else {
              setState(() => stage = 'choose');
            }
          },
        ),
        if (stage == 'choose') ...[
          _BigChoice(store.t(Copy.scanQr), Icons.qr_code_2, const Color(0xFFE3F1FB), () => setState(() => stage = 'scan')),
          const SizedBox(height: 12),
          _BigChoice(store.t(Copy.enterNumber), Icons.dialpad, const Color(0xFFF8E6D8), () => setState(() => stage = 'number')),
        ],
        if (stage == 'scan') ...[
          const Center(child: Icon(Icons.qr_code_scanner, size: 160, color: AppColors.navy)),
          const SizedBox(height: 16),
          PrimaryButton(
            label: store.t(Copy.tryDemoScan),
            onPressed: () {
              final priya = store.data.contacts.where((item) => item.id == 'priya').firstOrNull ?? store.data.contacts.firstOrNull;
              setState(() {
                payee = priya;
                via = 'scan';
                stage = 'found';
              });
            },
          ),
        ],
        if (stage == 'found' && (payee != null || customName != null)) ...[
          Center(child: ClipOval(child: Image.asset(portraitFor(payee?.relation ?? 'other', payee?.name ?? customName ?? ''), width: 140, height: 140, fit: BoxFit.cover))),
          Text(payee?.name ?? customName ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy)),
          const SizedBox(height: 8),
          Text(store.t(Copy.verifiedDemo), textAlign: TextAlign.center, style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.w800)),
          Text(payee?.upiId ?? customUpi ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
          const SizedBox(height: 16),
          PrimaryButton(label: store.t(Copy.continueLabel), onPressed: () => setState(() => stage = 'amount')),
        ],
        if (stage == 'number') ...[
          Text('+91 ${_pretty(phone)}', textAlign: TextAlign.center, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.navy)),
          const SizedBox(height: 12),
          _Keypad(onDigit: (digit) => setState(() { if (phone.length < 10) phone += digit; }), onDelete: () => setState(() { if (phone.isNotEmpty) phone = phone.substring(0, phone.length - 1); }), onClear: () => setState(() => phone = '')),
          const SizedBox(height: 12),
          PrimaryButton(
            label: store.t(Copy.continueLabel),
            onPressed: phone.length < 10
                ? null
                : () {
                    final match = store.data.contacts.where((item) => item.phone.replaceAll(RegExp(r'\D'), '').endsWith(phone)).firstOrNull;
                    setState(() {
                      payee = match;
                      customName = match == null ? '+91 ${_pretty(phone)}' : null;
                      via = 'number';
                      stage = 'amount';
                    });
                  },
          ),
        ],
        if (stage == 'amount') ...[
          Text(payee?.name ?? customName ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(formatRupees(amount), textAlign: TextAlign.center, style: const TextStyle(fontSize: 42, fontWeight: FontWeight.w800, color: AppColors.navy)),
          if (overLimit) Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(store.t(Copy.aboveLimit), textAlign: TextAlign.center, style: const TextStyle(color: AppColors.sos, fontWeight: FontWeight.w800))),
          _Keypad(
            onDigit: (digit) => setState(() {
              if (amountDigits.length >= 6) return;
              amountDigits = amountDigits == '0' ? digit : '$amountDigits$digit';
            }),
            onDelete: () => setState(() { if (amountDigits.isNotEmpty) amountDigits = amountDigits.substring(0, amountDigits.length - 1); }),
            onClear: () => setState(() => amountDigits = ''),
          ),
          const SizedBox(height: 12),
          PrimaryButton(label: store.t(Copy.continueLabel), onPressed: amount <= 0 ? null : () => setState(() => stage = 'review')),
        ],
        if (stage == 'review') ...[
          Text(formatRupees(amount), textAlign: TextAlign.center, style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w800, color: AppColors.navy)),
          Text(payee?.name ?? customName ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          Text(store.t(Copy.notRealAuth), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          PrimaryButton(
            label: store.t(Copy.confirmPayment),
            background: overLimit ? AppColors.sos : AppColors.navy,
            onPressed: () {
              final id = store.createTransaction(
                name: payee?.name ?? customName ?? '',
                amount: amount,
                contactId: payee?.id,
                status: overLimit ? 'failed' : 'success',
                reason: overLimit ? 'limit' : 'demo',
              );
              context.read<Nav>().open('payment', id);
            },
          ),
        ],
      ],
    );
  }
}

String _pretty(String digits) {
  if (digits.length <= 5) return digits;
  return '${digits.substring(0, 5)} ${digits.substring(5)}';
}

class _BigChoice extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  const _BigChoice(this.label, this.icon, this.color, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(28),
      child: InkWell(
        borderRadius: BorderRadius.circular(28),
        onTap: onTap,
        child: SizedBox(height: 150, child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(icon, size: 56, color: AppColors.navy), const SizedBox(height: 8), Text(label, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy))])),
      ),
    );
  }
}

class _Keypad extends StatelessWidget {
  final void Function(String) onDigit;
  final VoidCallback onDelete;
  final VoidCallback onClear;
  const _Keypad({required this.onDigit, required this.onDelete, required this.onClear});

  @override
  Widget build(BuildContext context) {
    final store = context.read<AppStore>();
    final keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.6,
      children: [
        for (final key in keys)
          Padding(
            padding: const EdgeInsets.all(4),
            child: Material(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  if (key == 'del') {
                    onDelete();
                  } else if (key == 'clear') {
                    onClear();
                  } else {
                    onDigit(key);
                  }
                },
                child: Center(
                  child: Text(
                    key == 'del' ? '⌫' : key == 'clear' ? store.t(Copy.clear) : key,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class ReceiveScreen extends StatelessWidget {
  const ReceiveScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.receiveMoney)),
        Center(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
            child: QrImageView(data: demoQr, size: 220, backgroundColor: Colors.white),
          ),
        ),
        const SizedBox(height: 16),
        Text(store.t(Copy.demoAddress), textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
        const SizedBox(height: 8),
        const Bilingual(Copy.qrDemo),
      ],
    );
  }
}

class PaymentResultScreen extends StatelessWidget {
  final String id;
  const PaymentResultScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final item = store.data.transactions.where((tx) => tx.id == id).firstOrNull;
    if (item == null) return Center(child: Text(store.t(Copy.money)));
    final person = store.data.contacts.where((contact) => contact.id == item.contactId || contact.name == item.name).firstOrNull;
    final sender = profileName(store.data.nameEn, store.data.nameHi, store.hindi);
    final title = switch (item.status) {
      'success' => Copy.paymentSuccessful,
      'failed' => Copy.paymentUnsuccessful,
      'cancelled' => Copy.cancelled,
      _ => Copy.pending,
    };
    final body = item.status == 'success'
        ? Copy.successBody
        : item.status == 'failed'
            ? (item.reason == 'limit' ? Copy.failedLimit : Copy.failedDemo)
            : item.status == 'cancelled'
                ? Copy.paymentCancelledBody
                : Copy.pendingBody;
    return ListView(
      children: [
        ScreenHeader(title: store.t(title)),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: item.status == 'success'
              ? Column(
                  children: [
                    const CircleAvatar(radius: 40, backgroundColor: Color(0xFFE5F6EA), child: Icon(Icons.check, color: AppColors.success, size: 42)),
                    const SizedBox(height: 16),
                    _Transfer(fromName: sender, toName: item.name, toSrc: portraitFor(person?.relation ?? 'other', item.name), amount: formatRupees(item.amount)),
                  ],
                )
              : Column(
                  children: [
                    CircleAvatar(radius: 48, backgroundImage: AssetImage(portraitFor(person?.relation ?? 'other', item.name))),
                    const SizedBox(height: 8),
                    Text(store.t(Copy.txStatus(item.status)), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy)),
                    Text(formatRupees(item.amount), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    Text(item.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
                    Text(formatWhen(item.createdAt, store.hindi), style: const TextStyle(color: AppColors.muted)),
                  ],
                ),
        ),
        const SizedBox(height: 12),
        Text(store.t(body), style: const TextStyle(fontSize: 18)),
        const SizedBox(height: 16),
        if (item.status == 'pending') ...[
          PrimaryButton(label: store.t(Copy.completePayment), onPressed: () => store.updateTransaction(item.id, status: 'success', reason: 'demo')),
          const SizedBox(height: 8),
          OutlineButton(label: store.t(Copy.recordUnsuccessful), onPressed: () => store.updateTransaction(item.id, status: 'failed', reason: 'demo')),
          const SizedBox(height: 8),
          OutlineButton(label: store.t(Copy.cancelPayment), onPressed: () => store.updateTransaction(item.id, status: 'cancelled', reason: 'demo')),
        ] else
          PrimaryButton(label: store.t(item.status == 'success' ? Copy.done : Copy.backToMoney), onPressed: () => context.read<Nav>().go('money')),
      ],
    );
  }
}

class _Transfer extends StatelessWidget {
  final String fromName;
  final String toName;
  final String toSrc;
  final String amount;
  const _Transfer({required this.fromName, required this.toName, required this.toSrc, required this.amount});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Column(children: [const CircleAvatar(radius: 36, backgroundColor: Color(0xFFE7EEF8), child: Icon(Icons.person, size: 36, color: AppColors.navy)), const SizedBox(height: 6), Text(fromName, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy))])),
        Column(children: [Text(amount, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)), const Icon(Icons.arrow_forward, color: AppColors.navy)]),
        Expanded(child: Column(children: [CircleAvatar(radius: 36, backgroundImage: AssetImage(toSrc)), const SizedBox(height: 6), Text(toName, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy))])),
      ],
    );
  }
}
