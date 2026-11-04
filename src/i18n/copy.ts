import type {
  HabitId,
  Localized,
  MedicineSlot,
  MedicineViewStatus,
  Relation,
  TxStatus,
} from "../types.ts";

export const copy = {
  appName: { en: "SAHAAY", hi: "सहाय" },
  tagline: {
    en: "A simpler today, a brighter tomorrow.",
    hi: "एक आसान आज, एक उज्जवल कल।",
  },
  caring: {
    en: "A caring companion for a more independent and confident life.",
    hi: "आत्मनिर्भर और आत्मविश्वासी जीवन के लिए एक देखभाल करने वाला साथी।",
  },
  welcome: { en: "Welcome", hi: "स्वागत है" },
  chooseLanguage: { en: "Choose your language", hi: "अपनी भाषा चुनें" },
  language: { en: "Language", hi: "भाषा" },
  english: { en: "English", hi: "अंग्रेज़ी" },
  hindi: { en: "Hindi", hi: "हिन्दी" },
  continue: { en: "Continue", hi: "आगे बढ़ें" },
  start: { en: "Start", hi: "शुरू करें" },
  back: { en: "Back", hi: "वापस" },
  close: { en: "Close", hi: "बंद करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  confirm: { en: "Confirm", hi: "पुष्टि करें" },
  save: { en: "Save", hi: "सहेजें" },
  remove: { en: "Remove", hi: "हटाएँ" },
  edit: { en: "Edit", hi: "बदलें" },
  undo: { en: "Undo", hi: "पहले जैसा करें" },
  done: { en: "Done", hi: "हो गया" },
  on: { en: "On", hi: "चालू" },
  off: { en: "Off", hi: "बंद" },
  home: { en: "Home", hi: "होम" },
  money: { en: "Money", hi: "पैसे" },
  medicines: { en: "Medicines", hi: "दवाइयाँ" },
  myDay: { en: "My Day", hi: "मेरा दिन" },
  help: { en: "Help", hi: "सहायता" },
  settings: { en: "Settings", hi: "सेटिंग्स" },
  notifications: { en: "Notifications", hi: "सूचनाएँ" },
  contacts: { en: "Trusted contacts", hi: "भरोसेमंद संपर्क" },
  myFamily: { en: "My family", hi: "मेरा परिवार" },
  familyInformedTitle: { en: "We keep your family informed", hi: "हम आपके परिवार को सूचित रखते हैं" },
  familyInformedBody: {
    en: "If you miss your medicines for 2 days, we automatically notify your trusted contact.",
    hi: "अगर आप 2 दिन तक दवा नहीं लेते, तो हम आपके भरोसेमंद संपर्क को अपने आप सूचित करते हैं।",
  },
  chatFromSahaay: { en: "Automatic notification from SAHAAY", hi: "SAHAAY की स्वचालित सूचना" },
  chatSentAuto: { en: "Sent automatically", hi: "अपने आप भेजा गया" },
  chatOnDevice: { en: "Saved on this device", hi: "इस डिवाइस पर सहेजा गया" },
  family: { en: "Family", hi: "परिवार" },
  voice: { en: "Voice assistant", hi: "आवाज़ सहायक" },
  voiceNav: { en: "Voice", hi: "आवाज़" },
  skip: { en: "Skip to content", hi: "सामग्री पर जाएँ" },
  selected: { en: "Selected", hi: "चुना गया" },
  demonstration: { en: "Demonstration", hi: "प्रदर्शन" },
  notFound: { en: "This page is not available.", hi: "यह पृष्ठ उपलब्ध नहीं है।" },
  goHome: { en: "Go to home", hi: "होम पर जाएँ" },
  howHelp: { en: "How can we help today?", hi: "आज हम आपकी क्या मदद करें?" },
  markTaken: { en: "Mark as taken", hi: "दवा ले ली है" },
  allDoneTitle: { en: "All caught up", hi: "सब दर्ज हो गया" },
  allDoneBody: {
    en: "Today's medicines are marked as taken.",
    hi: "आज की दवाइयाँ ले ली गईं, ऐसा दर्ज है।",
  },
  seeMedicines: { en: "See today's medicines", hi: "आज की दवाइयाँ देखें" },
  profileSettings: { en: "Profile and settings", hi: "प्रोफ़ाइल और सेटिंग्स" },
  openVoice: { en: "Voice assistant", hi: "आवाज़ सहायक" },
  todaysMedicines: { en: "Today's medicines", hi: "आज की दवाइयाँ" },
  upcoming: { en: "Upcoming", hi: "आने वाली" },
  taken: { en: "Taken", hi: "ले ली गई" },
  needsAttention: { en: "Needs attention", hi: "ध्यान दें" },
  unconfirmedNote: {
    en: "Unconfirmed. Not marked as missed.",
    hi: "पुष्टि नहीं। छूटी हुई नहीं मानी गई।",
  },
  iveTaken: { en: "I've taken it", hi: "दवा ले ली है" },
  remindLater: { en: "Remind me later", hi: "मुझे बाद में याद दिलाएँ" },
  takeNow: { en: "Take now", hi: "अभी लें" },
  markRemaining: { en: "Mark remaining as taken", hi: "बाकी दवाएँ ले ली हैं" },
  confirmMarkRemaining: { en: "Mark these as taken?", hi: "इन दवाओं को ले ली हुई मानें?" },
  overdue: { en: "Overdue", hi: "अभी भी बाकी" },
  reminderAlready: { en: "Reminder already set", hi: "याद दिलाया जा चुका है" },
  remindIn30: { en: "Remind me in 30 minutes", hi: "30 मिनट में याद दिलाएँ" },
  chooseReminder: { en: "When should we remind you?", hi: "कब याद दिलाएँ?" },
  wellDone: { en: "Well done!", hi: "बहुत खूब!" },
  markedTaken: { en: "Medicine marked as taken", hi: "दवा लेने की पुष्टि हो गई" },
  backHome: { en: "Back to home", hi: "होम पर वापस जाएँ" },
  nextReminder: { en: "Next reminder", hi: "अगली याद" },
  noMoreToday: {
    en: "No more medicines to confirm today.",
    hi: "आज पुष्टि के लिए कोई और दवा नहीं बची।",
  },
  stillToConfirm: { en: "Still to confirm", hi: "अभी पुष्टि बाकी है" },
  savedNote: {
    en: "Follow the medicine label. No medical advice.",
    hi: "दवा के लेबल को मानें। चिकित्सकीय सलाह नहीं।",
  },
  reminderTime: { en: "Reminder time", hi: "याद दिलाने का समय" },
  reminderTimeHint: {
    en: "This changes the reminder on this device only.",
    hi: "यह समय केवल इस डिवाइस की याद बदलता है।",
  },
  readAloud: { en: "Read aloud", hi: "ज़ोर से पढ़ें" },
  speechUnavailable: {
    en: "Reading aloud is not available in this browser.",
    hi: "इस ब्राउज़र में ज़ोर से पढ़ना उपलब्ध नहीं है।",
  },
  hindiVoiceMissing: {
    en: "A Hindi voice is not installed here, so this may be read in another language.",
    hi: "यहाँ हिन्दी आवाज़ नहीं है, इसलिए यह दूसरी भाषा में पढ़ा जा सकता है।",
  },
  doseAsSaved: { en: "As saved on this reminder", hi: "इस याद पर ऐसा सहेजा गया है" },
  todaysList: { en: "Rest of today", hi: "आज की बाकी दवाइयाँ" },
  whatToDo: { en: "What would you like to do?", hi: "आप क्या करना चाहेंगे?" },
  sendMoney: { en: "Send money", hi: "पैसे भेजें" },
  scanQr: { en: "Scan QR", hi: "क्यूआर स्कैन" },
  tryDemoScan: { en: "Try demo scan", hi: "डेमो स्कैन करें" },
  verifiedDemoUpi: { en: "Verified demo UPI", hi: "सत्यापित डेमो यूपीआई" },
  enterNumber: { en: "Enter number", hi: "नंबर लिखें" },
  receiveMoney: { en: "Receive money", hi: "पैसे प्राप्त करें" },
  recentPayments: { en: "Recent payments", hi: "हाल के भुगतान" },
  noPayments: {
    en: "No payments yet. A demonstration payment will appear here.",
    hi: "अभी कोई भुगतान नहीं है। प्रदर्शन भुगतान यहाँ दिखेगा।",
  },
  successful: { en: "Successful", hi: "सफल" },
  unsuccessful: { en: "Unsuccessful", hi: "असफल" },
  pending: { en: "Pending", hi: "लंबित" },
  cancelled: { en: "Cancelled", hi: "रद्द" },
  paymentSuccessful: { en: "Payment successful", hi: "भुगतान सफल" },
  paymentUnsuccessful: { en: "Payment unsuccessful", hi: "भुगतान असफल" },
  paymentPending: { en: "Payment pending", hi: "भुगतान लंबित" },
  paymentCancelled: { en: "Payment cancelled", hi: "भुगतान रद्द" },
  chooseRecipient: { en: "Choose a saved person", hi: "सहेजे व्यक्ति को चुनें" },
  noRecipients: {
    en: "Add a trusted contact before sending a demonstration payment.",
    hi: "प्रदर्शन भुगतान से पहले एक भरोसेमंद संपर्क जोड़ें।",
  },
  addContact: { en: "Add contact", hi: "संपर्क जोड़ें" },
  amountTitle: { en: "Enter the amount", hi: "राशि लिखें" },
  amountLimit: { en: "Up to ₹10,000.", hi: "₹10,000 तक।" },
  amountRequired: { en: "Enter an amount greater than zero.", hi: "शून्य से बड़ी राशि लिखें।" },
  aboveLimit: { en: "Above ₹10,000. Cannot complete.", hi: "₹10,000 से अधिक। पूरा नहीं हो सकता।" },
  reviewTitle: { en: "Check and confirm", hi: "जाँचें और पुष्टि करें" },
  verifiedDemoName: {
    en: "Saved demonstration name",
    hi: "सहेजा हुआ प्रदर्शन नाम",
  },
  demoUpi: { en: "Demonstration UPI id", hi: "प्रदर्शन यूपीआई आईडी" },
  noUpi: {
    en: "No demonstration UPI id saved. You can still preview the steps.",
    hi: "प्रदर्शन यूपीआई आईडी सहेजी नहीं है। फिर भी चरण देखे जा सकते हैं।",
  },
  confirmPayment: { en: "Confirm payment", hi: "भुगतान की पुष्टि करें" },
  recordUnsuccessful: {
    en: "Record unsuccessful payment",
    hi: "असफल भुगतान दर्ज करें",
  },
  completePayment: { en: "Complete demonstration", hi: "प्रदर्शन पूरा करें" },
  cancelPayment: { en: "Cancel payment", hi: "भुगतान रद्द करें" },
  notRealAuth: { en: "No UPI PIN is asked.", hi: "यूपीआई पिन नहीं माँगा जाता।" },
  pendingBody: {
    en: "This payment is still pending. You can complete or cancel the demonstration.",
    hi: "यह भुगतान अभी लंबित है। आप प्रदर्शन पूरा कर सकते हैं या रद्द कर सकते हैं।",
  },
  failedDemoBody: {
    en: "This demonstration payment was not completed. No money was sent.",
    hi: "यह प्रदर्शन भुगतान पूरा नहीं हुआ। पैसे नहीं भेजे गए।",
  },
  failedLimitBody: {
    en: "Amounts above ₹10,000 cannot be completed in this demonstration. No money was sent.",
    hi: "₹10,000 से अधिक राशि इस प्रदर्शन में पूरी नहीं हो सकती। पैसे नहीं भेजे गए।",
  },
  cancelledBody: {
    en: "This payment was cancelled. Nothing was sent.",
    hi: "यह भुगतान रद्द हुआ। कुछ नहीं भेजा गया।",
  },
  receiveTitle: { en: "Receive money", hi: "पैसे प्राप्त करें" },
  qrDemo: {
    en: "Demonstration QR code. Scanning it will not send or receive real money.",
    hi: "यह प्रदर्शन क्यूआर कोड है। स्कैन करने से असली पैसे नहीं जाएँगे और न मिलेंगे।",
  },
  qrPreparing: { en: "Preparing the QR code", hi: "क्यूआर कोड तैयार हो रहा है" },
  qrFailed: {
    en: "The QR code could not be created. The demonstration address is shown below.",
    hi: "क्यूआर कोड नहीं बन सका। प्रदर्शन पता नीचे दिया गया है।",
  },
  qrStep1: { en: "Open a UPI app.", hi: "यूपीआई ऐप खोलें।" },
  qrStep2: { en: "Choose scan and pay.", hi: "स्कैन करके भुगतान चुनें।" },
  qrStep3: {
    en: "Know that this code is only a demonstration.",
    hi: "जान लें कि यह कोड केवल प्रदर्शन के लिए है।",
  },
  sent: { en: "Sent", hi: "भेजा गया" },
  youSent: { en: "You sent", hi: "आपने भेजा" },
  youReceived: { en: "You received", hi: "आपको मिला" },
  viewAll: { en: "View all", hi: "सभी देखें" },
  failed: { en: "Failed", hi: "असफल" },
  received: { en: "Received", hi: "प्राप्त" },
  backToMoney: { en: "Back to money", hi: "पैसे पर वापस" },
  changePerson: { en: "Change person", hi: "व्यक्ति बदलें" },
  changeAmount: { en: "Change amount", hi: "राशि बदलें" },
  clearAmount: { en: "Clear", hi: "साफ़ करें" },
  deleteDigit: { en: "Delete digit", hi: "अंक मिटाएँ" },
  howCanIHelp: { en: "How can I help?", hi: "मैं आपकी क्या मदद करूँ?" },
  tapMic: { en: "Tap the mic and speak", hi: "माइक पर टैप करके बोलें" },
  listening: { en: "Listening", hi: "सुन रहे हैं" },
  stop: { en: "Stop", hi: "रोकें" },
  trySaying: { en: "Try saying", hi: "ऐसे बोलकर देखें" },
  cmdDaughter: { en: "Call my daughter", hi: "मेरी बेटी को कॉल करें" },
  cmdMedicine: { en: "When is my next medicine?", hi: "मेरी अगली दवा कब है?" },
  cmdSend: { en: "Help me send money", hi: "मुझे पैसे भेजने में मदद करें" },
  typeQuestion: { en: "Or type your question", hi: "या अपना सवाल लिखें" },
  ask: { en: "Ask", hi: "पूछें" },
  youSaid: { en: "You said", hi: "आपने कहा" },
  response: { en: "Response", hi: "जवाब" },
  voiceUnsupported: {
    en: "Voice recognition is not available in this browser. You can type your request.",
    hi: "इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। आप अपना अनुरोध लिख सकते हैं।",
  },
  micBlocked: {
    en: "Microphone permission is blocked. You can type your request instead.",
    hi: "माइक्रोफ़ोन की अनुमति बंद है। आप अपना अनुरोध लिख सकते हैं।",
  },
  micMissing: {
    en: "No microphone was found. You can type your request.",
    hi: "माइक्रोफ़ोन नहीं मिला। आप अपना अनुरोध लिख सकते हैं।",
  },
  noSpeech: {
    en: "I did not hear anything. Please try again or type your request.",
    hi: "मुझे कुछ सुनाई नहीं दिया। फिर कोशिश करें या लिखें।",
  },
  voiceError: {
    en: "Voice recognition could not finish. You can type your request.",
    hi: "आवाज़ पहचान पूरी नहीं हो सकी। आप अपना अनुरोध लिख सकते हैं।",
  },
  notSure: {
    en: "I am not sure what to do with that. Please try a suggestion below, or use different words.",
    hi: "मुझे यह समझ नहीं आया। नीचे दिया सुझाव आज़माएँ, या दूसरे शब्दों में कहें।",
  },
  callMissing: {
    en: "I could not find that contact. You can add them in trusted contacts.",
    hi: "वह संपर्क नहीं मिला। आप उन्हें भरोसेमंद संपर्कों में जोड़ सकते हैं।",
  },
  callWho: {
    en: "Who should I call? Try “call my daughter”, or open trusted contacts.",
    hi: "किसे कॉल करूँ? “मेरी बेटी को कॉल करें” कहें, या भरोसेमंद संपर्क खोलें।",
  },
  sendConfirmTitle: { en: "Open send money?", hi: "पैसे भेजने की स्क्रीन खोलें?" },
  sendConfirmBody: {
    en: "No payment will be sent until you choose a person and confirm the amount.",
    hi: "जब तक आप व्यक्ति और राशि की पुष्टि नहीं करते, कोई भुगतान नहीं होगा।",
  },
  helpOpened: {
    en: "The help screen is open. I have not sent an SOS alert.",
    hi: "सहायता स्क्रीन खुल गई है। मैंने एसओएस सूचना नहीं भेजी।",
  },
  openSend: { en: "Open send money", hi: "पैसे भेजना खोलें" },
  openContacts: { en: "Open trusted contacts", hi: "भरोसेमंद संपर्क खोलें" },
  callNow: { en: "Call now", hi: "अभी कॉल करें" },
  needHelp: { en: "Do you need help?", hi: "क्या आपको मदद चाहिए?" },
  emergencySos: { en: "Emergency SOS", hi: "आपातकालीन सहायता" },
  sosExplain: {
    en: "Saved on this device. Does not call 112.",
    hi: "इस डिवाइस पर सहेजा। 112 पर कॉल नहीं।",
  },
  callFamily: { en: "Call family", hi: "परिवार को कॉल करें" },
  callFamilyHint: { en: "Call your trusted contacts", hi: "अपने भरोसेमंद संपर्कों को कॉल करें" },
  callEmergency: { en: "Call emergency services", hi: "आपातकालीन सेवाओं को कॉल करें" },
  call112: { en: "Call 112", hi: "112 पर कॉल करें" },
  emergencyExplain: {
    en: "Opens your phone to call 112.",
    hi: "फ़ोन में 112 डायल होता है।",
  },
  trustedNotice: {
    en: "Only contacts who agreed to SOS alerts are included. You can change that in trusted contacts.",
    hi: "केवल वे संपर्क शामिल होते हैं जिन्होंने एसओएस सूचना की सहमति दी है। इसे भरोसेमंद संपर्कों में बदलें।",
  },
  sosConfirmTitle: { en: "Record a demonstration alert?", hi: "प्रदर्शन सूचना दर्ज करें?" },
  sosConfirmBody: {
    en: "On this device only. Help is not sent.",
    hi: "केवल इस डिवाइस पर। मदद नहीं भेजी गई।",
  },
  sendDemoAlert: { en: "Record alert", hi: "सूचना दर्ज करें" },
  sosNone: {
    en: "No trusted contact has agreed to SOS alerts. Nothing was sent. You can still call 112.",
    hi: "किसी भरोसेमंद संपर्क ने एसओएस की सहमति नहीं दी। कुछ नहीं भेजा गया। आप फिर भी 112 पर कॉल कर सकते हैं।",
  },
  sosCancelled: {
    en: "Cancelled. The alert stayed on this device and was not delivered to anyone.",
    hi: "रद्द हुआ। सूचना इसी डिवाइस पर रही और किसी को नहीं पहुँची।",
  },
  cancelAlert: { en: "Cancel this alert", hi: "यह सूचना रद्द करें" },
  familyIntro: {
    en: "Choose someone to call. The call opens in your phone.",
    hi: "कॉल के लिए किसी को चुनें। कॉल आपके फ़ोन में खुलेगी।",
  },
  manageContacts: { en: "Manage contacts", hi: "संपर्क बदलें" },
  opensPhone: {
    en: "If a phone app does not open, this device cannot place the call from the browser.",
    hi: "अगर फ़ोन ऐप नहीं खुलता, तो यह डिवाइस ब्राउज़र से कॉल नहीं कर सकता।",
  },
  voiceCard: { en: "Talk to SAHAAY", hi: "सहाय से बात करें" },
  voiceCardHint: { en: "Speak or type a request", hi: "बोलें या लिखें" },
  water: { en: "Drink water", hi: "पानी पिएँ" },
  walk: { en: "Go for a walk", hi: "टहलने जाएँ" },
  stretch: { en: "Stretch gently", hi: "हल्का व्यायाम करें" },
  rest: { en: "Take a break", hi: "थोड़ा आराम करें" },
  waterMsg: {
    en: "Would a glass of water feel good right now?",
    hi: "क्या अभी एक गिलास पानी अच्छा लगेगा?",
  },
  walkMsg: {
    en: "A short walk can be a gentle pause in the day.",
    hi: "थोड़ी टहल दिन में एक हल्की राहत हो सकती है।",
  },
  stretchMsg: {
    en: "A gentle stretch, only as far as feels comfortable.",
    hi: "हल्का खिंचाव, जितना आरामदायक लगे उतना ही।",
  },
  restMsg: {
    en: "It is fine to pause and rest.",
    hi: "रुककर आराम करना ठीक है।",
  },
  markedDoneToday: { en: "Marked done for today", hi: "आज के लिए हो गया दर्ज किया" },
  habitTime: { en: "Reminder time", hi: "याद का समय" },
  quietHint: {
    en: "Quiet hours can pause reminders. You can change them in settings.",
    hi: "शांत घंटे यादों को रोक सकते हैं। इन्हें सेटिंग्स में बदलें।",
  },
  editQuiet: { en: "Quiet hours", hi: "शांत घंटे" },
  editContact: { en: "Edit contact", hi: "संपर्क बदलें" },
  fullName: { en: "Full name", hi: "पूरा नाम" },
  relationship: { en: "Relationship", hi: "रिश्ता" },
  phone: { en: "Phone", hi: "फ़ोन" },
  upi: { en: "Demonstration UPI id", hi: "प्रदर्शन यूपीआई आईडी" },
  upiOptional: { en: "Optional. Not a real bank account.", hi: "वैकल्पिक। यह असली बैंक खाता नहीं है।" },
  consentMedicine: {
    en: "Medicine updates: a simple note that a dose was marked taken. No prescription details.",
    hi: "दवा सूचना: केवल यह कि दवा ले ली गई। नुस्खे की जानकारी नहीं।",
  },
  consentPayment: {
    en: "Payment updates: the amount and result. No PIN or account number.",
    hi: "भुगतान सूचना: राशि और परिणाम। पिन या खाता संख्या नहीं।",
  },
  consentSos: {
    en: "SOS alerts: a request recorded for this person. This does not contact emergency services.",
    hi: "एसओएस सूचना: इस व्यक्ति के लिए दर्ज अनुरोध। यह आपातकालीन सेवाओं से संपर्क नहीं करता।",
  },
  allowMedicine: { en: "Medicine updates", hi: "दवा की सूचना" },
  allowPayment: { en: "Payment updates", hi: "भुगतान की सूचना" },
  allowSos: { en: "SOS alerts", hi: "एसओएस सूचना" },
  call: { en: "Call", hi: "कॉल" },
  message: { en: "Message", hi: "संदेश" },
  messageFallback: {
    en: "If a message app does not open, this browser could not send it. You can call instead.",
    hi: "अगर संदेश ऐप नहीं खुलता, तो यह ब्राउज़र संदेश नहीं भेज सका। आप कॉल कर सकते हैं।",
  },
  sendMessage: { en: "Open message", hi: "संदेश खोलें" },
  messagePreview: {
    en: "Namaste, please call me when you are free.",
    hi: "नमस्ते, जब आप खाली हों तो कृपया कॉल करें।",
  },
  emptyContacts: {
    en: "No trusted contacts yet. Add someone you want to call quickly.",
    hi: "अभी कोई भरोसेमंद संपर्क नहीं है। जिसे आप जल्दी कॉल करना चाहते हैं, उन्हें जोड़ें।",
  },
  nameError: { en: "Please enter a name.", hi: "कृपया नाम लिखें।" },
  phoneError: { en: "Enter a phone number with at least 10 digits.", hi: "कम से कम 10 अंकों का फ़ोन नंबर लिखें।" },
  upiError: {
    en: "Use a demonstration id like name@bank, or leave it empty.",
    hi: "name@bank जैसा प्रदर्शन आईडी लिखें, या खाली छोड़ दें।",
  },
  noneSelected: { en: "No alerts selected", hi: "कोई सूचना चुनी नहीं गई" },
  emptyNotes: {
    en: "You are all caught up. New reminders will appear here.",
    hi: "अभी कोई नई सूचना नहीं है। नई यादें यहाँ दिखेंगी।",
  },
  markAllRead: { en: "Mark all read", hi: "सभी पढ़ी हुई मानें" },
  newItem: { en: "New", hi: "नई" },
  open: { en: "Open", hi: "खोलें" },
  unconfirmedBody: {
    en: "You can mark it if you have taken it. An unconfirmed dose is not recorded as missed.",
    hi: "अगर आपने ले ली है तो दर्ज कर सकते हैं। पुष्टि न होना छूटी हुई दवा नहीं माना जाता।",
  },
  profile: { en: "Your name", hi: "आपका नाम" },
  nameEn: { en: "Name in English", hi: "अंग्रेज़ी में नाम" },
  nameHi: { en: "Name in Hindi", hi: "हिन्दी में नाम" },
  textSize: { en: "Text size", hi: "अक्षर का आकार" },
  textSmaller: { en: "Smaller text", hi: "छोटा अक्षर" },
  textBigger: { en: "Larger text", hi: "बड़ा अक्षर" },
  textDefault: { en: "Default", hi: "सामान्य" },
  textLarge: { en: "Large", hi: "बड़ा" },
  textLarger: { en: "Larger", hi: "और बड़ा" },
  sound: { en: "Sound", hi: "ध्वनि" },
  soundHint: {
    en: "A soft chime after important actions, when the browser allows it.",
    hi: "ज़रूरी काम के बाद हल्की ध्वनि, जब ब्राउज़र अनुमति दे।",
  },
  vibration: { en: "Vibration", hi: "कंपन" },
  vibrationHint: {
    en: "A short vibration when the device and browser allow it.",
    hi: "छोटा कंपन, जब डिवाइस और ब्राउज़र अनुमति दें।",
  },
  voiceGuidance: { en: "Voice guidance", hi: "आवाज़ से मार्गदर्शन" },
  voiceHint: {
    en: "Read the screen title after you move to a new page.",
    hi: "नई स्क्रीन पर जाने के बाद शीर्षक ज़ोर से पढ़ें।",
  },
  quietHours: { en: "Quiet hours", hi: "शांत घंटे" },
  quietExplain: {
    en: "Reminders wait until quiet hours end. Emergency calling stays available.",
    hi: "यादें शांत घंटे खत्म होने तक रुकती हैं। आपातकालीन कॉल उपलब्ध रहती है।",
  },
  quietStart: { en: "Starts", hi: "शुरू" },
  quietEnd: { en: "Ends", hi: "समाप्त" },
  sharePayments: { en: "Show payment results in notifications", hi: "सूचनाओं में भुगतान परिणाम दिखाएँ" },
  shareHint: {
    en: "Only a demonstration result is shown. No PIN or account number is stored.",
    hi: "केवल प्रदर्शन परिणाम दिखता है। पिन या खाता संख्या सहेजी नहीं जाती।",
  },
  privacy: { en: "Privacy", hi: "गोपनीयता" },
  privacyBody: {
    en: "Saved in this browser only. No PIN or medical records.",
    hi: "केवल इस ब्राउज़र में। पिन या मेडिकल रिकॉर्ड नहीं।",
  },
  clearData: { en: "Clear demonstration data", hi: "प्रदर्शन डेटा मिटाएँ" },
  clearTitle: { en: "Clear data on this device?", hi: "इस डिवाइस का डेटा मिटाएँ?" },
  clearConfirm: {
    en: "This removes demonstration medicines, contacts, and payments stored in this browser.",
    hi: "यह इस ब्राउज़र में सहेजी प्रदर्शन दवाइयाँ, संपर्क और भुगतान हटा देता है।",
  },
  medicineTimes: { en: "Medicine reminder times", hi: "दवा की याद का समय" },
  habitTimes: { en: "Daily habit times", hi: "दिन की आदतों का समय" },
  familyPrefs: { en: "Family notification choices", hi: "परिवार की सूचना चुनें" },
  savedContact: { en: "Contact saved on this device.", hi: "संपर्क इस डिवाइस पर सहेजा गया।" },
  removedContact: { en: "Contact removed.", hi: "संपर्क हटाया गया।" },
  remindIn10: { en: "Remind in 10 minutes", hi: "10 मिनट में याद दिलाएँ" },
  minutes15: { en: "15 minutes", hi: "15 मिनट" },
  minutes30: { en: "30 minutes", hi: "30 मिनट" },
  minutes60: { en: "1 hour", hi: "1 घंटा" },
  minutes120: { en: "2 hours", hi: "2 घंटे" },
  featureMed: { en: "Medicines", hi: "दवाइयाँ" },
  featureMedBody: { en: "Stay on track with your health", hi: "अपनी सेहत की याद रखें" },
  featureMoney: { en: "Money", hi: "पैसे" },
  featureMoneyBody: { en: "Simple and safe payments", hi: "आसान और सुरक्षित भुगतान" },
  featureDay: { en: "My Day", hi: "मेरा दिन" },
  featureDayBody: { en: "Small habits for a healthier you", hi: "स्वस्थ दिन की छोटी आदतें" },
  featureHelp: { en: "Help", hi: "सहायता" },
  featureHelpBody: { en: "You're never alone", hi: "आप अकेले नहीं हैं" },
  because: {
    en: "Because everyday life should feel easier.",
    hi: "क्योंकि रोज़ का जीवन आसान लगना चाहिए।",
  },
  simple: { en: "Simple and intuitive", hi: "सरल और स्पष्ट" },
  accessible: { en: "Accessible and inclusive", hi: "सुलभ और सबके लिए" },
  safe: { en: "Safe and trustworthy", hi: "सुरक्षित और भरोसेमंद" },
  warm: { en: "Warm and reassuring", hi: "सौम्य और आश्वस्त" },
  medFeatureShort: { en: "Today's schedule", hi: "आज की सूची" },
  moneyFeatureShort: { en: "Send or receive", hi: "भेजें या पाएँ" },
  dayFeatureShort: { en: "Healthy habits", hi: "स्वस्थ आदतें" },
  helpFeatureShort: { en: "Call or SOS", hi: "कॉल या एसओएस" },
  toWord: { en: "to", hi: "को" },
  rupees: { en: "Amount in rupees", hi: "राशि रुपयों में" },
  languageSetEn: { en: "Language is English.", hi: "भाषा अंग्रेज़ी है।" },
  languageSetHi: { en: "Language is Hindi.", hi: "भाषा हिन्दी है।" },
  noAlerts: { en: "No alerts selected", hi: "कोई सूचना चुनी नहीं" },
  medicineUpdates: { en: "Medicine", hi: "दवा" },
  paymentUpdates: { en: "Payments", hi: "भुगतान" },
  sosUpdates: { en: "SOS", hi: "एसओएस" },
  required: { en: "Required", hi: "ज़रूरी" },
  optional: { en: "Optional", hi: "वैकल्पिक" },
  todayWord: { en: "Today", hi: "आज" },
  yesterdayWord: { en: "Yesterday", hi: "कल" },
  openAlert: { en: "Latest SOS status", hi: "नवीनतम एसओएस स्थिति" },
  recorded: { en: "Recorded on this device", hi: "इस डिवाइस पर दर्ज" },
  notSent: { en: "Not sent", hi: "नहीं भेजा गया" },
  readAgain: { en: "Read again", hi: "फिर से पढ़ें" },
  typeInstead: { en: "Type instead", hi: "इसके बजाय लिखें" },
  habitsTitle: { en: "My Day", hi: "मेरा दिन" },
  habitsIntro: {
    en: "Small reminders. No pressure.",
    hi: "छोटी यादें। कोई दबाव नहीं।",
  },
  seeSettings: { en: "Open settings", hi: "सेटिंग्स खोलें" },
  paymentResultMissing: {
    en: "This payment could not be found on this device.",
    hi: "यह भुगतान इस डिवाइस पर नहीं मिला।",
  },
  medicineMissing: {
    en: "This medicine could not be found.",
    hi: "यह दवा नहीं मिली।",
  },
  contactMissing: {
    en: "This contact could not be found.",
    hi: "यह संपर्क नहीं मिला।",
  },
  familyEmptyCall: {
    en: "Add a trusted contact to call someone quickly.",
    hi: "जल्दी कॉल के लिए एक भरोसेमंद संपर्क जोड़ें।",
  },
  agree: { en: "I agree to record this preference on this device.", hi: "मैं इस डिवाइस पर यह पसंद दर्ज करने से सहमत हूँ।" },
  nextMedicineNone: {
    en: "All of today's medicines are already marked as taken.",
    hi: "आज की सभी दवाइयाँ ले ली गईं, ऐसा दर्ज है।",
  },
  openHabit: { en: "Open My Day", hi: "मेरा दिन खोलें" },
  openedHome: { en: "You are on the home screen.", hi: "आप होम स्क्रीन पर हैं।" },
  couldNotComplete: {
    en: "I understood the request, but the action could not be completed.",
    hi: "मैंने अनुरोध समझ लिया, पर काम पूरा नहीं हो सका।",
  },
} satisfies Record<string, Localized>;

export const slotCopy: Record<MedicineSlot, Localized> = {
  morning: { en: "Morning medicine", hi: "सुबह की दवा" },
  afternoon: { en: "Afternoon medicine", hi: "दोपहर की दवा" },
  night: { en: "Night medicine", hi: "रात की दवा" },
};

export const mealCopy: Record<MedicineSlot, Localized> = {
  morning: { en: "Breakfast", hi: "नाश्ता" },
  afternoon: { en: "Lunch", hi: "दोपहर" },
  night: { en: "Dinner", hi: "रात" },
};

export const dayGroupCopy: Record<MedicineSlot, Localized> = {
  morning: { en: "Morning", hi: "सुबह" },
  afternoon: { en: "Afternoon", hi: "दोपहर" },
  night: { en: "Evening", hi: "शाम" },
};

export const slotWhenCopy: Record<MedicineSlot, Localized> = {
  morning: { en: "After breakfast", hi: "नाश्ते के बाद" },
  afternoon: { en: "After lunch", hi: "दोपहर के खाने के बाद" },
  night: { en: "After dinner", hi: "रात के खाने के बाद" },
};

export function takenOfLabel(done: number, total: number): Localized {
  return {
    en: `${done} of ${total} taken`,
    hi: `${total} में से ${done} ली गईं`,
  };
}

export function medicineCountLabel(count: number): Localized {
  return count === 1
    ? { en: "1 medicine", hi: "1 दवा" }
    : { en: `${count} medicines`, hi: `${count} दवाइयाँ` };
}

export const medicineStatusCopy: Record<MedicineViewStatus, Localized> = {
  taken: copy.taken,
  upcoming: copy.upcoming,
  needs_attention: copy.needsAttention,
};

export const txStatusCopy: Record<TxStatus, Localized> = {
  success: copy.successful,
  failed: copy.unsuccessful,
  pending: copy.pending,
  cancelled: copy.cancelled,
};

export const txHeading: Record<TxStatus, Localized> = {
  success: copy.paymentSuccessful,
  failed: copy.paymentUnsuccessful,
  pending: copy.paymentPending,
  cancelled: copy.paymentCancelled,
};

export const relationCopy: Record<Relation, Localized> = {
  daughter: { en: "Daughter", hi: "बेटी" },
  son: { en: "Son", hi: "बेटा" },
  sister: { en: "Sister", hi: "बहन" },
  brother: { en: "Brother", hi: "भाई" },
  spouse: { en: "Spouse", hi: "जीवनसाथी" },
  friend: { en: "Friend", hi: "मित्र" },
  other: { en: "Other", hi: "अन्य" },
};

export const relations: Relation[] = [
  "daughter",
  "son",
  "sister",
  "brother",
  "spouse",
  "friend",
  "other",
];

export const habitCopy: Record<HabitId, { title: Localized; message: Localized }> = {
  water: { title: copy.water, message: copy.waterMsg },
  walk: { title: copy.walk, message: copy.walkMsg },
  stretch: { title: copy.stretch, message: copy.stretchMsg },
  rest: { title: copy.rest, message: copy.restMsg },
};

export const reminderChoices = [
  { minutes: 15, label: copy.minutes15 },
  { minutes: 30, label: copy.minutes30 },
  { minutes: 60, label: copy.minutes60 },
  { minutes: 120, label: copy.minutes120 },
];

export function progressLabel(done: number, total: number): Localized {
  return {
    en: `${done} of ${total} completed`,
    hi: `${total} में से ${done} पूरी`,
  };
}

export function payLine(amount: string, name: string): Localized {
  return {
    en: `Send ${amount} to ${name}`,
    hi: `${name} को ${amount} भेजें`,
  };
}

export function successPay(amount: string, name: string): Localized {
  return {
    en: `${amount} to ${name}. No money sent. No PIN.`,
    hi: `${name} को ${amount}। पैसे नहीं भेजे गए। पिन नहीं।`,
  };
}

export function sosRecorded(names: string): Localized {
  return {
    en: `Recorded on this device for ${names}. Nothing was delivered to their phones. This does not mean help is coming.`,
    hi: `${names} के लिए इस डिवाइस पर दर्ज हुआ। उनके फ़ोन पर कुछ नहीं पहुँचा। इसका मतलब यह नहीं कि मदद आ रही है।`,
  };
}

export function reminderSet(whenEn: string, whenHi: string, delayed: boolean): Localized {
  if (delayed) {
    return {
      en: `Quiet hours are on, so the reminder is set for ${whenEn}.`,
      hi: `शांत घंटे चालू हैं, इसलिए याद ${whenHi} पर रखी गई है।`,
    };
  }
  return {
    en: `Reminder set for ${whenEn}.`,
    hi: `याद ${whenHi} के लिए रखी गई है।`,
  };
}

export function messageConfirm(name: string): Localized {
  return {
    en: `Send this message to ${name}?`,
    hi: `${name} को यह संदेश भेजें?`,
  };
}

export function removeConfirm(name: string): Localized {
  return {
    en: `Remove ${name} from trusted contacts?`,
    hi: `भरोसेमंद संपर्कों से ${name} को हटाएँ?`,
  };
}

export function callConfirm(name: string): Localized {
  return {
    en: `Call ${name}?`,
    hi: `${name} को कॉल करें?`,
  };
}

export function callOpening(name: string): Localized {
  return {
    en: `Opening your phone to call ${name}. SAHAAY cannot confirm that the call connected.`,
    hi: `${name} को कॉल करने के लिए फ़ोन खुल रहा है। सहाय यह पुष्टि नहीं कर सकता कि कॉल जुड़ी।`,
  };
}

export function unconfirmedTitle(slot: Localized): Localized {
  return {
    en: `${slot.en} is still unconfirmed`,
    hi: `${slot.hi} की अभी पुष्टि नहीं हुई`,
  };
}

export function stepLabel(current: number, total: number): Localized {
  return {
    en: `Step ${current} of ${total}`,
    hi: `चरण ${current} / ${total}`,
  };
}

export function notifLabel(count: number): Localized {
  if (count === 1) return { en: "Notifications, 1 new", hi: "सूचनाएँ, 1 नई" };
  return { en: `Notifications, ${count} new`, hi: `सूचनाएँ, ${count} नई` };
}

export function familyCallMessage(name: string): Localized {
  const first = name.trim().split(/\s+/)[0] || name;
  return {
    en: `Hi ${first}, Mother is trying to call. Please reach out.`,
    hi: `नमस्ते ${first}, माँ कॉल करने की कोशिश कर रही हैं। कृपया संपर्क करें।`,
  };
}

export function sosFamilyAlert(): Localized {
  return {
    en: "Emergency SOS: Mother needs immediate help. Please reach out.",
    hi: "आपातकालीन एसओएस: माँ को तुरंत मदद चाहिए। कृपया संपर्क करें।",
  };
}

export function assistFamilyMessage(need: Localized): Localized {
  return {
    en: `Assistance request: ${need.en}`,
    hi: `सहायता अनुरोध: ${need.hi}`,
  };
}

export function familyRespondedNote(): Localized {
  return {
    en: "Priya is responding to the emergency SOS and is on the way.",
    hi: "प्रिया आपातकालीन एसओएस का जवाब दे रही है और रास्ते में है।",
  };
}

export function familyCheckMessage(name: string): Localized {
  const first = name.trim().split(/\s+/)[0] || name;
  return {
    en: `Hi ${first}, SAHAAY noticed that Mom has missed her medicines for 2 days. Please check on her.`,
    hi: `नमस्ते ${first}, SAHAAY ने देखा है कि माँ ने 2 दिन से दवा नहीं ली। कृपया उन पर ध्यान दें।`,
  };
}

export function familyMedicineNote(medicineName: string, people: string): Localized {
  return {
    en: `${medicineName} is still not marked taken. A note is saved on this device for ${people}. Nothing was sent to their phones.`,
    hi: `${medicineName} अभी तक ले ली गई दर्ज नहीं है। ${people} के लिए नोट इस डिवाइस पर सहेजा गया है। उनके फ़ोन पर कुछ नहीं भेजा गया।`,
  };
}

export function medicineSaved(name: string): Localized {
  return {
    en: `${name} marked as taken.`,
    hi: `${name} ले ली गई, ऐसा दर्ज हुआ।`,
  };
}

export function nextMedicineAnswer(name: string, whenEn: string, whenHi: string, unconfirmed: boolean): Localized {
  if (unconfirmed) {
    return {
      en: `${name} at ${whenEn} is still unconfirmed. That does not mean it was missed.`,
      hi: `${name} ${whenHi} की अभी पुष्टि नहीं हुई। इसका मतलब यह नहीं कि दवा छूट गई।`,
    };
  }
  return {
    en: `Your next medicine is ${name} at ${whenEn}.`,
    hi: `आपकी अगली दवा ${name} ${whenHi} पर है।`,
  };
}

export function habitAnswer(title: Localized): Localized {
  return {
    en: `Opening ${title.en}.`,
    hi: `${title.hi} खोल रहे हैं।`,
  };
}

export function paymentFeed(status: TxStatus, amount: string, name: string): Localized {
  const verb = {
    success: { en: "recorded as successful", hi: "सफल दर्ज हुआ" },
    failed: { en: "was not completed", hi: "पूरा नहीं हुआ" },
    pending: { en: "is still pending", hi: "अभी लंबित है" },
    cancelled: { en: "was cancelled", hi: "रद्द हुआ" },
  }[status];
  return {
    en: `${amount} to ${name} ${verb.en}. Demonstration only.`,
    hi: `${name} को ${amount} ${verb.hi}. केवल प्रदर्शन।`,
  };
}

export function minutesLabel(minutes: number): Localized {
  return reminderChoices.find((choice) => choice.minutes === minutes)?.label ?? copy.minutes30;
}
