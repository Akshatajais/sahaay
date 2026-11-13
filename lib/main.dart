import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'l10n.dart';
import 'logic.dart';
import 'day_session.dart';
import 'screens/day_screen.dart';
import 'screens/family_screen.dart';
import 'screens/help_screen.dart';
import 'screens/home_screen.dart';
import 'screens/medicines_screen.dart';
import 'screens/moment_screen.dart';
import 'screens/money_screen.dart';
import 'screens/notifications_screen.dart';
import 'store.dart';
import 'theme.dart';
import 'widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final store = AppStore();
  await store.load();
  runApp(
    ChangeNotifierProvider.value(
      value: store,
      child: ChangeNotifierProvider(
        create: (_) => Nav(),
        child: ChangeNotifierProvider(
          create: (_) => DaySession(),
          child: const SahaayApp(),
        ),
      ),
    ),
  );
}

class SahaayApp extends StatelessWidget {
  const SahaayApp({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    return MaterialApp(
      title: 'Sahaay',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(),
      builder: (context, child) {
        final media = MediaQuery.of(context);
        return MediaQuery(
          data: media.copyWith(textScaler: TextScaler.linear(store.textScale)),
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: const Shell(),
    );
  }
}

class Shell extends StatelessWidget {
  const Shell({super.key});

  @override
  Widget build(BuildContext context) {
    final nav = context.watch<Nav>();
    final store = context.watch<AppStore>();
    final route = nav.route;
    return Scaffold(
      backgroundColor: const Color(0xFFEBE6DC),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: ColoredBox(
            color: AppColors.cream,
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
                      child: _body(nav),
                    ),
                  ),
                  if (store.banner != null)
                    Material(
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        child: Row(
                          children: [
                            Expanded(child: Text(store.t(store.banner!.text), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy))),
                            IconButton(onPressed: store.dismissBanner, icon: const Icon(Icons.close), tooltip: store.t(Copy.close)),
                          ],
                        ),
                      ),
                    ),
                  Container(
                    decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0x1A202E63)))),
                    padding: const EdgeInsets.fromLTRB(8, 6, 8, 4),
                    child: Row(
                      children: [
                        _Tab(
                          label: store.t(Copy.home),
                          selected: route == 'home',
                          icon: Icons.home_outlined,
                          selectedIcon: Icons.home,
                          onTap: () => nav.go('home'),
                        ),
                        _Tab(
                          label: store.t(Copy.myDay),
                          selected: route == 'day' || route == 'moment',
                          icon: Icons.wb_sunny_outlined,
                          selectedIcon: Icons.wb_sunny,
                          onTap: () => nav.go('day'),
                        ),
                        _Tab(
                          label: store.t(Copy.medicines),
                          selected: route == 'medicines' || route == 'medicine' || route == 'medicine-done',
                          icon: Icons.medication_outlined,
                          selectedIcon: Icons.medication,
                          onTap: () => nav.go('medicines'),
                        ),
                        _Tab(
                          label: store.t(Copy.contacts),
                          selected: route == 'family' || route == 'chat',
                          icon: Icons.people_alt_outlined,
                          selectedIcon: Icons.people_alt,
                          onTap: () => nav.go('family'),
                        ),
                        _Tab(
                          label: 'SOS',
                          selected: route == 'help',
                          icon: Icons.phone_outlined,
                          selectedIcon: Icons.phone,
                          color: AppColors.sos,
                          labelColor: AppColors.sos,
                          onTap: () => nav.go('help'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _body(Nav nav) {
    final args = nav.args;
    return Stack(
      fit: StackFit.expand,
      children: [
        Positioned.fill(child: _page(nav.route, args)),
        Consumer<AppStore>(
          builder: (context, store, _) {
            final prompt = store.prompt;
            if (prompt == null) return const SizedBox.shrink();
            return _Prompt(prompt: prompt);
          },
        ),
      ],
    );
  }

  Widget _page(String route, Object? args) {
    return switch (route) {
      'medicines' => const MedicinesScreen(),
      'medicine' => MedicineDetailScreen(id: '$args'),
      'medicine-done' => MedicineDoneScreen(id: '$args'),
      'money' => const MoneyScreen(),
      'send' => const SendMoneyScreen(),
      'receive' => const ReceiveScreen(),
      'payment' => PaymentResultScreen(id: '$args'),
      'help' => const HelpScreen(),
      'day' => const DayScreen(),
      'moment' => MomentScreen(id: '$args'),
      'family' => const FamilyScreen(),
      'chat' => FamilyChatScreen(contactId: '$args'.split('|').first, kind: '$args'.split('|').last),
      'notifications' => const NotificationsScreen(),
      _ => const HomeScreen(),
    };
  }
}

class _Tab extends StatelessWidget {
  final String label;
  final bool selected;
  final IconData icon;
  final IconData selectedIcon;
  final Color? color;
  final Color? labelColor;
  final VoidCallback onTap;
  const _Tab({
    required this.label,
    required this.selected,
    required this.icon,
    required this.selectedIcon,
    required this.onTap,
    this.color,
    this.labelColor,
  });

  @override
  Widget build(BuildContext context) {
    final iconColor = color ?? (selected ? AppColors.navy : AppColors.muted);
    final highlight = color == AppColors.sos ? const Color(0xFFFBEAEA) : AppColors.care;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: selected
                      ? BoxDecoration(color: highlight, borderRadius: BorderRadius.circular(16))
                      : null,
                  child: Icon(selected ? selectedIcon : icon, color: iconColor, size: 28),
                ),
              ),
              const SizedBox(height: 4),
              SizedBox(
                width: double.infinity,
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    label,
                    maxLines: 1,
                    style: TextStyle(fontWeight: FontWeight.w800, color: labelColor ?? (selected ? AppColors.navy : AppColors.muted), fontSize: 13),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Prompt extends StatelessWidget {
  final ReminderPrompt prompt;
  const _Prompt({required this.prompt});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    if (prompt.kind == 'medicine') {
      final medicine = store.data.medicines.where((item) => item.id == prompt.id).firstOrNull;
      if (medicine == null) return const SizedBox.shrink();
      return _Sheet(
        title: store.t(Copy.slotTitle(medicine.slot)),
        body: '${medicine.name}\n${formatHm(medicine.time, store.hindi)}',
        confirm: store.t(Copy.iveTaken),
        onConfirm: () => store.markMedicinesTaken([medicine.id]),
        extra: store.t(Copy.minutes30),
        onExtra: () => store.remindMedicines([medicine.id], 30),
      );
    }
    final habit = store.data.habits.where((item) => item.id == prompt.id).firstOrNull;
    if (habit == null) return const SizedBox.shrink();
    return _Sheet(
      title: store.t(Copy.habitTitle(habit.id)),
      body: formatHm(habit.time, store.hindi),
      confirm: store.t(Copy.done),
      onConfirm: () => store.markHabitDone(habit.id),
      extra: store.t(Copy.minutes30),
      onExtra: () => store.remindHabit(habit.id, 30),
    );
  }
}

class _Sheet extends StatelessWidget {
  final String title;
  final String body;
  final String confirm;
  final String extra;
  final VoidCallback onConfirm;
  final VoidCallback onExtra;
  const _Sheet({required this.title, required this.body, required this.confirm, required this.extra, required this.onConfirm, required this.onExtra});

  @override
  Widget build(BuildContext context) {
    final store = context.read<AppStore>();
    return ColoredBox(
      color: const Color(0x73202E63),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(24)),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const SizedBox(height: 8),
              Text(body, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              PrimaryButton(label: confirm, onPressed: onConfirm),
              const SizedBox(height: 8),
              OutlineButton(label: extra, onPressed: onExtra),
              const SizedBox(height: 8),
              OutlineButton(label: store.t(Copy.close), onPressed: store.dismissPrompt),
            ],
          ),
        ),
      ),
    );
  }
}
