import 'package:flutter_test/flutter_test.dart';
import 'package:sahaay/logic.dart';
import 'package:sahaay/models.dart';

void main() {
  test('unconfirmed afternoon medicine is not marked missed', () {
    final now = DateTime(2026, 11, 4, 15, 30);
    final medicine = Medicine(id: 'med-afternoon', name: 'Metformin', slot: 'afternoon', time: '14:00');
    expect(statusOf(medicine, now), MedStatus.needsAttention);
  });

  test('a dose taken today stays taken', () {
    final now = DateTime(2026, 11, 4, 15, 30);
    final medicine = Medicine(id: 'med-morning', name: 'Amlodipine', slot: 'morning', time: '08:00', takenAt: DateTime(2026, 11, 4, 8, 5).toIso8601String());
    expect(statusOf(medicine, now), MedStatus.taken);
  });

  test('amounts format in rupees and voice finds a medicine request', () {
    expect(formatRupees(10000), '₹10,000');
    expect(interpret('When is my next medicine?').type, VoiceIntent.nextMedicine);
    expect(interpret('Help me send money').type, VoiceIntent.sendMoney);
  });
}
