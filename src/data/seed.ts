import type { AppData, Medicine, Notice } from "../types.ts";

export function demoMedicines(): Medicine[] {
  const taken = new Date().toISOString();
  const clear = { dose: "", remindAt: null, promptedKey: null, snoozeCount: 0 };
  return [
    { ...clear, id: "med-morning", name: "Amlodipine", slot: "morning", time: "08:00", takenAt: taken },
    { ...clear, id: "med-morning-aspirin", name: "Aspirin", slot: "morning", time: "08:00", takenAt: taken },
    { ...clear, id: "med-afternoon", name: "Metformin", slot: "afternoon", time: "14:00", takenAt: null },
    { ...clear, id: "med-afternoon-d3", name: "Vitamin D3", slot: "afternoon", time: "14:00", takenAt: null },
    { ...clear, id: "med-night", name: "Atorvastatin", slot: "night", time: "20:00", takenAt: null },
  ];
}

function daysAgo(days: number, hours = 9) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, 15, 0, 0);
  return date.toISOString();
}

const familyNote: Notice = {
  id: "seed-family",
  kind: "family",
  title: { en: "Priya left a note", hi: "प्रिया ने एक संदेश छोड़ा" },
  body: {
    en: "Priya asked you to call when you are free. This note is saved on this device only.",
    hi: "प्रिया ने कहा है कि जब आप खाली हों तो कॉल करें। यह संदेश केवल इस डिवाइस पर सहेजा है।",
  },
  createdAt: daysAgo(0, 11),
  read: false,
  href: "/help/family",
};

export function seed(): AppData {
  return {
    version: 1,
    onboarded: true,
    settings: {
      language: "en",
      textSize: "default",
      sound: true,
      vibration: true,
      voiceGuidance: false,
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "07:00",
      sharePayments: false,
    },
    profile: { nameEn: "Amma", nameHi: "अम्मा" },
    medicines: demoMedicines(),
    habits: [
      { id: "water", time: "09:00", doneOn: null, remindAt: null, promptedKey: null },
      { id: "walk", time: "07:30", doneOn: null, remindAt: null, promptedKey: null },
      { id: "stretch", time: "17:00", doneOn: null, remindAt: null, promptedKey: null },
      { id: "rest", time: "21:00", doneOn: null, remindAt: null, promptedKey: null },
    ],
    contacts: [
      {
        id: "priya",
        name: "Priya Sharma",
        relation: "daughter",
        phone: "+91 98765 43210",
        upiId: "priya.demo@oksbi",
        notifyMedicine: true,
        notifyPayment: true,
        notifySos: true,
      },
      {
        id: "ravi",
        name: "Ravi Kumar",
        relation: "son",
        phone: "+91 98765 11111",
        upiId: "ravi.demo@okhdfc",
        notifyMedicine: true,
        notifyPayment: false,
        notifySos: true,
      },
      {
        id: "anita",
        name: "Anita Desai",
        relation: "sister",
        phone: "+91 98765 22222",
        upiId: "anita.demo@okaxis",
        notifyMedicine: false,
        notifyPayment: false,
        notifySos: true,
      },
    ],
    transactions: [
      {
        id: "seed-paid",
        direction: "sent",
        contactId: "ravi",
        name: "Ravi Kumar",
        amount: 500,
        createdAt: daysAgo(1, 12),
        status: "success",
        reason: "demo",
      },
      {
        id: "seed-failed",
        direction: "sent",
        contactId: "priya",
        name: "Priya Sharma",
        amount: 200,
        createdAt: daysAgo(3, 16),
        status: "failed",
        reason: "demo",
      },
      {
        id: "seed-pending",
        direction: "sent",
        contactId: "anita",
        name: "Anita Desai",
        amount: 150,
        createdAt: daysAgo(0, 18),
        status: "pending",
        reason: "demo",
      },
    ],
    notices: [familyNote],
    sosEvents: [],
    familyThreads: [],
  };
}

export const STORAGE_KEY = "sahaay-demo-v1";

export function loadState(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.medicines) || !parsed.settings) {
      return seed();
    }
    const demoIds = demoMedicines().map((item) => item.id).sort().join();
    const storedIds = parsed.medicines.map((item) => item.id).sort().join();
    if (storedIds !== demoIds) parsed.medicines = demoMedicines();
    if (!Array.isArray(parsed.familyThreads)) parsed.familyThreads = [];
    return parsed;
  } catch {
    return seed();
  }
}
