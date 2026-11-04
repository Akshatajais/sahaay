import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n.dart';
import '../logic.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final items = <_Feed>[];
    for (final medicine in store.data.medicines.where((item) => statusOf(item, store.now) == MedStatus.needsAttention)) {
      items.add(_Feed(
        id: 'open-${medicine.id}',
        kind: 'medicine',
        title: Localized('${Copy.slotTitle(medicine.slot).en} needs attention', '${Copy.slotTitle(medicine.slot).hi} पर ध्यान दें'),
        body: Copy.unconfirmed,
        createdAt: store.now.toIso8601String(),
        href: 'medicine:${medicine.id}',
        read: false,
      ));
    }
    for (final notice in store.data.notices) {
      items.add(_Feed(id: notice.id, kind: notice.kind, title: notice.title, body: notice.body, createdAt: notice.createdAt, href: notice.href, read: notice.read, stored: true));
    }
    if (store.data.settings.sharePayments) {
      for (final tx in store.data.transactions) {
        items.add(_Feed(
          id: 'pay-${tx.id}',
          kind: 'payment',
          title: Copy.txStatus(tx.status),
          body: Localized('${formatRupees(tx.amount)} to ${tx.name}. Demonstration only.', '${tx.name} को ${formatRupees(tx.amount)}। केवल प्रदर्शन।'),
          createdAt: tx.createdAt,
          href: 'payment:${tx.id}',
          read: true,
        ));
      }
    }
    items.sort((a, b) {
      if (a.read != b.read) return a.read ? 1 : -1;
      return b.createdAt.compareTo(a.createdAt);
    });
    final unread = store.data.notices.any((item) => !item.read);
    return ListView(
      children: [
        ScreenHeader(title: store.t(Copy.notifications)),
        if (unread) ...[
          OutlineButton(label: store.t(Copy.markAllRead), onPressed: store.markAllNoticesRead),
          const SizedBox(height: 12),
        ],
        if (items.isEmpty)
          Text(store.t(Copy.emptyNotes), style: const TextStyle(fontSize: 18))
        else
          for (final item in items) _NoteTile(item: item),
      ],
    );
  }
}

class _Feed {
  final String id;
  final String kind;
  final Localized title;
  final Localized body;
  final String createdAt;
  final String? href;
  final bool read;
  final bool stored;
  const _Feed({required this.id, required this.kind, required this.title, required this.body, required this.createdAt, this.href, required this.read, this.stored = false});
}

class _NoteTile extends StatelessWidget {
  final _Feed item;
  const _NoteTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final icon = switch (item.kind) {
      'medicine' => Icons.medication,
      'payment' => Icons.account_balance_wallet,
      'sos' => Icons.campaign,
      'family' => Icons.favorite,
      _ => Icons.notifications,
    };
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: item.href == null
              ? null
              : () {
                  if (item.stored) store.markNoticeRead(item.id);
                  final href = item.href!;
                  final nav = context.read<Nav>();
                  if (href.startsWith('medicine:')) {
                    nav.open('medicine', href.substring(9));
                  } else if (href.startsWith('payment:')) {
                    nav.open('payment', href.substring(8));
                  } else if (href == 'medicines') {
                    nav.open('medicines');
                  } else if (href == 'family' || href == '/help/family') {
                    nav.open('family');
                  } else if (href == 'notifications' || href == '/notifications') {
                    nav.open('notifications');
                  } else if (href == 'day' || href == '/day') {
                    nav.open('day');
                  } else {
                    nav.open(href.replaceFirst('/', ''));
                  }
                },
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(width: 48, height: 48, decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(14)), child: Icon(icon, color: AppColors.navy)),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (!item.read) Text(store.t(Copy.newItem), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.amberInk)),
                      Text(store.t(item.title), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.navy)),
                      Text(store.t(item.body), style: const TextStyle(fontSize: 16, height: 1.3)),
                      Text(formatWhen(item.createdAt, store.hindi), style: const TextStyle(color: AppColors.muted)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
