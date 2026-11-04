import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../day_session.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets.dart';

class MomentScreen extends StatelessWidget {
  final String id;
  const MomentScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final hindi = context.watch<AppStore>().hindi;
    final matches = DaySession.photos.where((photo) => photo.id == id);
    if (matches.isEmpty) {
      return ScreenHeader(title: hindi ? 'तस्वीर' : 'Photograph');
    }
    final photo = matches.first;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ScreenHeader(title: photo.event.of(hindi)),
        ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Image.asset(photo.image, height: 360, fit: BoxFit.cover),
        ),
        const SizedBox(height: 14),
        Text(photo.date.of(hindi), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
      ],
    );
  }
}
