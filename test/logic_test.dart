import 'package:flutter_test/flutter_test.dart';
import 'package:sahaay/logic.dart';
import 'package:sahaay/models.dart';

void main() {
  test('the day keeps morning taken, afternoon ready, and dinner later', () {
    final early = DateTime(2026, 11, 4, 2, 10);
    final late = DateTime(2026, 11, 4, 22, 15);
    final morning = Medicine(id: 'med-morning', name: 'Amlodipine', slot: 'morning', time: '08:00');
    final afternoon = Medicine(id: 'med-afternoon', name: 'Metformin', slot: 'afternoon', time: '14:00');
    final dinner = Medicine(id: 'med-night', name: 'Atorvastatin', slot: 'night', time: '20:00');
    for (final now in [early, late]) {
      expect(statusOf(morning, now), MedStatus.taken);
      expect(statusOf(afternoon, now), MedStatus.needsAttention);
      expect(statusOf(Medicine(id: 'med-afternoon', name: 'Metformin', slot: 'afternoon', time: '14:00', takenAt: now.toIso8601String()), now), MedStatus.needsAttention);
      expect(statusOf(dinner, now), MedStatus.upcoming);
    }
  });

  test('a dose taken today stays taken', () {
    final now = DateTime(2026, 11, 4, 15, 30);
    final medicine = Medicine(id: 'med-morning', name: 'Amlodipine', slot: 'morning', time: '08:00', takenAt: DateTime(2026, 11, 4, 8, 5).toIso8601String());
    expect(statusOf(medicine, now), MedStatus.taken);
  });

  test('amounts format in rupees', () {
    expect(formatRupees(10000), '₹10,000');
  });
}
