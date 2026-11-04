import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'l10n.dart';
import 'models.dart';
import 'store.dart';
import 'theme.dart';

class Nav extends ChangeNotifier {
  final List<PageRequest> _stack = [const PageRequest('home')];

  String get route => _stack.last.name;
  Object? get args => _stack.last.args;
  bool get canPop => _stack.length > 1;

  void open(String name, [Object? args]) {
    _stack.add(PageRequest(name, args));
    notifyListeners();
  }

  void go(String name) {
    _stack
      ..clear()
      ..add(PageRequest(name));
    notifyListeners();
  }

  void back() {
    if (_stack.length > 1) {
      _stack.removeLast();
    } else if (route != 'home') {
      go('home');
      return;
    }
    notifyListeners();
  }
}

class PageRequest {
  final String name;
  final Object? args;
  const PageRequest(this.name, [this.args]);
}

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Color background;
  final Color foreground;
  final IconData? icon;

  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.background = AppColors.navy,
    this.foreground = Colors.white,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final style = FilledButton.styleFrom(
      backgroundColor: background,
      foregroundColor: foreground,
      disabledBackgroundColor: background.withValues(alpha: 0.4),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
    );
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: icon == null
          ? FilledButton(onPressed: onPressed, style: style, child: Text(label))
          : FilledButton.icon(onPressed: onPressed, style: style, icon: Icon(icon, size: 22), label: Text(label)),
    );
  }
}

class OutlineButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  const OutlineButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.navy,
          side: const BorderSide(color: Color(0x33202E63)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          backgroundColor: Colors.white,
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
        ),
        child: Text(label),
      ),
    );
  }
}

class ScreenHeader extends StatelessWidget {
  final String title;
  final bool back;
  final Widget? trailing;
  final VoidCallback? onBack;
  const ScreenHeader({super.key, required this.title, this.back = true, this.trailing, this.onBack});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          if (back)
            _RoundIconButton(
              icon: Icons.chevron_left,
              label: context.read<AppStore>().t(Copy.back),
              onPressed: onBack ?? () => context.read<Nav>().back(),
            )
          else
            const SizedBox(width: 48),
          Expanded(
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 26, height: 1.1, fontWeight: FontWeight.w800, color: AppColors.navy),
            ),
          ),
          trailing ?? const SizedBox(width: 48),
        ],
      ),
    );
  }
}

class _RoundIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  const _RoundIconButton({required this.icon, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(side: BorderSide(color: Color(0x26202E63))),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onPressed,
          child: SizedBox(width: 48, height: 48, child: Icon(icon, color: AppColors.navy)),
        ),
      ),
    );
  }
}

class Bilingual extends StatelessWidget {
  final Localized text;
  final TextStyle? style;
  const Bilingual(this.text, {super.key, this.style});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AppStore>();
    final primary = store.t(text);
    final secondary = text.of(!store.hindi);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(primary, style: style ?? const TextStyle(fontSize: 17, height: 1.3, color: AppColors.ink)),
        const SizedBox(height: 2),
        Text(secondary, style: const TextStyle(fontSize: 16, height: 1.3, color: AppColors.muted)),
      ],
    );
  }
}

Future<int?> showReminderSheet(BuildContext context) {
  final store = context.read<AppStore>();
  final choices = [
    (15, Copy.minutes15),
    (30, Copy.minutes30),
    (60, Copy.minutes60),
    (120, Copy.minutes120),
  ];
  return showModalBottomSheet<int>(
    context: context,
    backgroundColor: AppColors.cream,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
    builder: (context) {
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(store.t(Copy.chooseReminder), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.navy)),
              const SizedBox(height: 12),
              for (final choice in choices) ...[
                OutlineButton(label: store.t(choice.$2), onPressed: () => Navigator.pop(context, choice.$1)),
                const SizedBox(height: 8),
              ],
              OutlineButton(label: store.t(Copy.close), onPressed: () => Navigator.pop(context)),
            ],
          ),
        ),
      );
    },
  );
}
