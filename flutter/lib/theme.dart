import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const navy = Color(0xFF202E63);
  static const cream = Color(0xFFF8F5EE);
  static const care = Color(0xFFDCEBDD);
  static const amber = Color(0xFFF7DFAE);
  static const amberInk = Color(0xFF5C3D0A);
  static const ink = Color(0xFF25304B);
  static const muted = Color(0xFF3E4C73);
  static const sos = Color(0xFFC83D42);
  static const success = Color(0xFF0F6B40);
  static const money = Color(0xFFD7E6F7);
  static const blush = Color(0xFFF5DEDE);
}

ThemeData buildTheme() {
  final sans = GoogleFonts.notoSans();
  final devanagari = GoogleFonts.notoSansDevanagari().fontFamily;
  return ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: AppColors.cream,
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.navy, primary: AppColors.navy, surface: AppColors.cream),
    fontFamily: sans.fontFamily,
    fontFamilyFallback: devanagari == null ? const <String>[] : [devanagari],
  );
}
