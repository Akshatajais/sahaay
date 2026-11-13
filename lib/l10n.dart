import 'models.dart';

class Copy {
  static const home = Localized('Home', 'होम');
  static const money = Localized('Money', 'पैसे');
  static const medicines = Localized('Medicines', 'दवाइयाँ');
  static const myDay = Localized('My Day', 'मेरा दिन');
  static const help = Localized('Help', 'सहायता');
  static const settings = Localized('Settings', 'सेटिंग्स');
  static const family = Localized('Family', 'परिवार');
  static const contacts = Localized('Contacts', 'संपर्क');
  static const voice = Localized('Voice', 'आवाज़');
  static const notifications = Localized('Notifications', 'सूचनाएँ');
  static const myFamily = Localized('My family', 'मेरा परिवार');
  static const todaysMedicines = Localized("Today's medicines", 'आज की दवाइयाँ');
  static const markTaken = Localized('Mark as taken', 'दवा ले ली है');
  static const remindLater = Localized('Remind me later', 'मुझे बाद में याद दिलाएँ');
  static const needsAttention = Localized('Needs attention', 'ध्यान दें');
  static const upcoming = Localized('Upcoming', 'आने वाली');
  static const taken = Localized('Taken', 'ले ली गई');
  static const unconfirmed = Localized('Unconfirmed. Not marked as missed.', 'पुष्टि नहीं। छूटी हुई नहीं मानी गई।');
  static const readAloud = Localized('Read aloud', 'ज़ोर से पढ़ें');
  static const allDone = Localized('All caught up', 'सब दर्ज हो गया');
  static const seeMedicines = Localized("See today's medicines", 'आज की दवाइयाँ देखें');
  static const back = Localized('Back', 'वापस');
  static const close = Localized('Close', 'बंद करें');
  static const continueLabel = Localized('Continue', 'आगे बढ़ें');
  static const call = Localized('Call', 'कॉल');
  static const message = Localized('Message', 'संदेश');
  static const done = Localized('Done', 'हो गया');
  static const undo = Localized('Undo', 'पहले जैसा करें');
  static const language = Localized('Language', 'भाषा');
  static const textSize = Localized('Text size', 'अक्षर का आकार');
  static const smaller = Localized('Smaller text', 'छोटा अक्षर');
  static const larger = Localized('Larger text', 'बड़ा अक्षर');
  static const textDefault = Localized('Default', 'सामान्य');
  static const textLarge = Localized('Large', 'बड़ा');
  static const textLarger = Localized('Larger', 'और बड़ा');
  static const sound = Localized('Sound', 'ध्वनि');
  static const vibration = Localized('Vibration', 'कंपन');
  static const voiceGuidance = Localized('Voice guidance', 'आवाज़ मार्गदर्शन');
  static const quietHours = Localized('Quiet hours', 'शांत घंटे');
  static const sharePayments = Localized('Show payment results in notifications', 'सूचनाओं में भुगतान परिणाम दिखाएँ');
  static const privacy = Localized('Privacy', 'गोपनीयता');
  static const privacyBody = Localized(
    'This demonstration stays on this device. It does not give medical advice, move real money, or send real messages.',
    'यह प्रदर्शन इसी डिवाइस पर रहता है। यह चिकित्सकीय सलाह नहीं देता, असली पैसे नहीं भेजता, और असली संदेश नहीं भेजता।',
  );
  static const clearData = Localized('Clear demonstration data', 'प्रदर्शन डेटा मिटाएँ');
  static const clearTitle = Localized('Clear saved data?', 'सहेजा डेटा मिटाएँ?');
  static const clearConfirm = Localized(
    'Names, reminders, and demonstration payments saved on this device will be replaced with the sample.',
    'इस डिवाइस पर सहेजे नाम, यादें और प्रदर्शन भुगतान नमूने से बदल जाएँगे।',
  );
  static const nameEn = Localized('Name in English', 'अंग्रेज़ी में नाम');
  static const nameHi = Localized('Name in Hindi', 'हिन्दी में नाम');
  static const selected = Localized('Selected', 'चुना गया');
  static const chooseReminder = Localized('When should we remind you?', 'कब याद दिलाएँ?');
  static const minutes15 = Localized('15 minutes', '15 मिनट');
  static const minutes30 = Localized('30 minutes', '30 मिनट');
  static const minutes60 = Localized('1 hour', '1 घंटा');
  static const minutes120 = Localized('2 hours', '2 घंटे');
  static const reminderAlready = Localized('Reminder already set', 'याद दिलाया जा चुका है');
  static const nextReminder = Localized('Next reminder', 'अगली याद');
  static const markedDone = Localized('Marked done for today.', 'आज के लिए हो गया दर्ज हुआ।');
  static const habitTime = Localized('Time', 'समय');
  static const sendMoney = Localized('Send money', 'पैसे भेजें');
  static const receiveMoney = Localized('Receive money', 'पैसे प्राप्त करें');
  static const recentPayments = Localized('Recent payments', 'हाल के भुगतान');
  static const scanQr = Localized('Scan QR', 'क्यूआर स्कैन');
  static const tryDemoScan = Localized('Try demo scan', 'डेमो स्कैन करें');
  static const verifiedDemo = Localized('Verified demo UPI', 'सत्यापित डेमो यूपीआई');
  static const enterNumber = Localized('Enter number', 'नंबर लिखें');
  static const amountTitle = Localized('Enter the amount', 'राशि लिखें');
  static const aboveLimit = Localized('Above ₹10,000. Cannot complete.', '₹10,000 से अधिक। पूरा नहीं हो सकता।');
  static const reviewTitle = Localized('Check and confirm', 'जाँचें और पुष्टि करें');
  static const confirmPayment = Localized('Confirm payment', 'भुगतान की पुष्टि करें');
  static const notRealAuth = Localized('No UPI PIN is asked. No real money moves.', 'यूपीआई पिन नहीं माँगा जाता। असली पैसे नहीं जाते।');
  static const paymentSuccessful = Localized('Payment successful', 'भुगतान सफल');
  static const paymentUnsuccessful = Localized('Payment unsuccessful', 'भुगतान असफल');
  static const backToMoney = Localized('Back to money', 'पैसे पर वापस');
  static const failedLimit = Localized(
    'Amounts above ₹10,000 cannot be completed in this demonstration. No money was sent.',
    '₹10,000 से अधिक राशि इस प्रदर्शन में पूरी नहीं हो सकती। पैसे नहीं भेजे गए।',
  );
  static const successBody = Localized('No money was sent. This is a demonstration.', 'पैसे नहीं भेजे गए। यह एक प्रदर्शन है।');
  static const qrDemo = Localized(
    'Demonstration QR code. Scanning it will not send or receive real money.',
    'यह प्रदर्शन क्यूआर कोड है। स्कैन करने से असली पैसे नहीं जाएँगे और न मिलेंगे।',
  );
  static const demoAddress = Localized('sahaay.demo@okaxis', 'sahaay.demo@okaxis');
  static const howCanIHelp = Localized('How can I help?', 'मैं आपकी क्या मदद करूँ?');
  static const tapMic = Localized('Tap the mic and speak', 'माइक पर टैप करके बोलें');
  static const listening = Localized('Listening', 'सुन रहे हैं');
  static const stop = Localized('Stop', 'रोकें');
  static const trySaying = Localized('Try saying', 'ऐसे बोलकर देखें');
  static const cmdDaughter = Localized('Call my daughter', 'मेरी बेटी को कॉल करें');
  static const cmdMedicine = Localized('When is my next medicine?', 'मेरी अगली दवा कब है?');
  static const cmdSend = Localized('Help me send money', 'मुझे पैसे भेजने में मदद करें');
  static const typeQuestion = Localized('Or type your question', 'या अपना सवाल लिखें');
  static const ask = Localized('Ask', 'पूछें');
  static const notSure = Localized(
    'I am not sure what to do with that. Please try a suggestion below.',
    'मुझे यह समझ नहीं आया। नीचे दिया सुझाव आज़माएँ।',
  );
  static const sendConfirm = Localized(
    'No payment will be sent until you choose a person and confirm the amount.',
    'जब तक आप व्यक्ति और राशि की पुष्टि नहीं करते, कोई भुगतान नहीं होगा।',
  );
  static const helpOpened = Localized('The help screen is open. I have not sent an SOS alert.', 'सहायता स्क्रीन खुल गई है। मैंने एसओएस सूचना नहीं भेजी।');
  static const openedHome = Localized('Opening home.', 'होम खोल रहे हैं।');
  static const callWho = Localized('Who should I call? Try “call my daughter”.', 'किसे कॉल करूँ? “मेरी बेटी को कॉल करें” कहें।');
  static const noSpeech = Localized('I did not hear anything. Please try again or type your request.', 'मुझे कुछ सुनाई नहीं दिया। फिर कोशिश करें या लिखें।');
  static const voiceMissing = Localized('Voice recognition is not available. You can type your request.', 'आवाज़ पहचान उपलब्ध नहीं है। आप अपना अनुरोध लिख सकते हैं।');
  static const familyInformedTitle = Localized('We keep your family informed', 'हम आपके परिवार को सूचित रखते हैं');
  static const familyInformedBody = Localized(
    'If you miss your medicines for 2 days, we automatically notify your trusted contact.',
    'अगर आप 2 दिन तक दवा नहीं लेते, तो हम आपके भरोसेमंद संपर्क को अपने आप सूचित करते हैं।',
  );
  static const chatFrom = Localized('Automatic notification from Sahaay', 'Sahaay की स्वचालित सूचना');
  static const sentAuto = Localized('Sent automatically', 'अपने आप भेजा गया');
  static const onDevice = Localized('Saved on this device', 'इस डिवाइस पर सहेजा गया');
  static const wellDone = Localized('Well done!', 'बहुत खूब!');
  static const backHome = Localized('Back to home', 'होम पर वापस जाएँ');
  static const noMore = Localized('No more medicines to confirm today.', 'आज पुष्टि के लिए कोई और दवा नहीं बची।');
  static const stillToConfirm = Localized('Still to confirm', 'अभी पुष्टि बाकी है');
  static const markRemaining = Localized('Mark remaining as taken', 'बाकी दवाएँ ले ली हैं');
  static const takeNow = Localized('Take now', 'अभी लें');
  static const viewAll = Localized('View all', 'सभी देखें');
  static const youSent = Localized('You sent', 'आपने भेजा');
  static const youReceived = Localized('You received', 'आपको मिला');
  static const failed = Localized('Failed', 'असफल');
  static const demonstration = Localized('Demonstration', 'प्रदर्शन');
  static const savedNote = Localized('Follow the medicine label. No medical advice.', 'दवा के लेबल को मानें। चिकित्सकीय सलाह नहीं।');
  static const reminderTime = Localized('Reminder time', 'याद दिलाने का समय');
  static const confirmMark = Localized('Mark these as taken?', 'इन दवाओं को ले ली हुई मानें?');
  static const qrPreparing = Localized('Preparing the QR code', 'क्यूआर कोड तैयार हो रहा है');
  static const qrStep1 = Localized('Open a UPI app.', 'यूपीआई ऐप खोलें।');
  static const qrStep2 = Localized('Choose scan and pay.', 'स्कैन करके भुगतान चुनें।');
  static const qrStep3 = Localized('Know that this code is only a demonstration.', 'जान लें कि यह कोड केवल प्रदर्शन के लिए है।');
  static const completePayment = Localized('Complete demonstration', 'प्रदर्शन पूरा करें');
  static const recordUnsuccessful = Localized('Record unsuccessful payment', 'असफल भुगतान दर्ज करें');
  static const cancelPayment = Localized('Cancel payment', 'भुगतान रद्द करें');
  static const failedDemo = Localized('This demonstration payment was not completed. No money was sent.', 'यह प्रदर्शन भुगतान पूरा नहीं हुआ। पैसे नहीं भेजे गए।');
  static const pendingBody = Localized('This payment is still pending. You can complete or cancel the demonstration.', 'यह भुगतान अभी लंबित है। आप प्रदर्शन पूरा कर सकते हैं या रद्द कर सकते हैं।');
  static const payCancelled = Localized('This payment was cancelled. Nothing was sent.', 'यह भुगतान रद्द हुआ। कुछ नहीं भेजा गया।');
  static const successPayNote = Localized('No money sent. No PIN.', 'पैसे नहीं भेजे गए। पिन नहीं।');
  static const rowContacts = Localized('Alert your emergency contacts.', 'अपने आपातकालीन संपर्कों को सूचित करें।');
  static const rowLocation = Localized('Share your current location.', 'अपना वर्तमान स्थान साझा करें।');
  static const rowAccess = Localized('Make emergency assistance accessible.', 'आपातकालीन सहायता उपलब्ध रखें।');
  static const alertStatus = Localized('Alert sent', 'सूचना भेजी गई');
  static const acknowledged = Localized('Acknowledged', 'स्वीकार किया');
  static const responding = Localized('Responding', 'जवाब दे रही हैं');
  static const paymentCancelledBody = Localized('This payment was cancelled. Nothing was sent.', 'यह भुगतान रद्द हुआ। कुछ नहीं भेजा गया।');
  static const afterBreakfast = Localized('After breakfast', 'नाश्ते के बाद');
  static const afterLunch = Localized('After lunch', 'दोपहर के खाने के बाद');
  static const afterDinner = Localized('After dinner', 'रात के खाने के बाद');
  static const morning = Localized('Morning', 'सुबह');
  static const afternoon = Localized('Afternoon', 'दोपहर');
  static const evening = Localized('Evening', 'शाम');
  static const morningMed = Localized('Morning medicine', 'सुबह की दवा');
  static const afternoonMed = Localized('Afternoon medicine', 'दोपहर की दवा');
  static const nightMed = Localized('Night medicine', 'रात की दवा');
  static const water = Localized('Drink water', 'पानी पिएँ');
  static const walk = Localized('Go for a walk', 'टहलने जाएँ');
  static const stretch = Localized('Stretch gently', 'हल्का व्यायाम करें');
  static const rest = Localized('Take a break', 'थोड़ा आराम करें');
  static const markAllRead = Localized('Mark all read', 'सभी पढ़ी हुई मानें');
  static const newItem = Localized('New', 'नई');
  static const emptyNotes = Localized('No notifications yet.', 'अभी कोई सूचना नहीं।');
  static const open = Localized('Open', 'खुला');
  static const iveTaken = Localized("I've taken it", 'दवा ले ली है');
  static const daughter = Localized('Daughter', 'बेटी');
  static const son = Localized('Son', 'बेटा');
  static const sister = Localized('Sister', 'बहन');
  static const brother = Localized('Brother', 'भाई');
  static const spouse = Localized('Spouse', 'जीवनसाथी');
  static const friend = Localized('Friend', 'मित्र');
  static const other = Localized('Other', 'अन्य');
  static const successful = Localized('Successful', 'सफल');
  static const unsuccessful = Localized('Unsuccessful', 'असफल');
  static const pending = Localized('Pending', 'लंबित');
  static const cancelled = Localized('Cancelled', 'रद्द');
  static const medicineTimes = Localized('Medicine reminder times', 'दवा की याद का समय');
  static const habitTimes = Localized('Daily habit times', 'दिन की आदतों का समय');
  static const familyPrefs = Localized('Family notification choices', 'परिवार की सूचना चुनें');
  static const clear = Localized('Clear', 'साफ़ करें');
  static const deleteDigit = Localized('Delete digit', 'अंक मिटाएँ');
  static const youSaid = Localized('You said', 'आपने कहा');
  static const openSend = Localized('Open send money', 'पैसे भेजना खोलें');
  static const sosTitle = Localized('Sahaay Emergency', 'सहाय आपातकाल');
  static const areYouOk = Localized('Are you okay?', 'क्या आप ठीक हैं?');
  static const chooseNeed = Localized('We are here to help you. Choose what you need.', 'हम आपकी मदद के लिए यहाँ हैं। चुनें कि आपको क्या चाहिए।');
  static const emergencySos = Localized('EMERGENCY SOS', 'आपातकालीन एसओएस');
  static const needImmediate = Localized('I need immediate help', 'मुझे तुरंत मदद चाहिए');
  static const alertFamily = Localized('Alert my family and start emergency assistance', 'मेरे परिवार को सूचित करें और आपातकालीन सहायता शुरू करें');
  static const callMyFamily = Localized('Call my family', 'मेरे परिवार को कॉल करें');
  static const speakTrust = Localized('I need to speak to someone I trust.', 'मुझे किसी भरोसेमंद व्यक्ति से बात करनी है।');
  static const needAssist = Localized('I need some assistance', 'मुझे कुछ सहायता चाहिए');
  static const notEmergency = Localized("I need help, but it's not an emergency.", 'मुझे मदद चाहिए, पर यह आपातकाल नहीं है।');
  static const locationShare = Localized(
    'My location will be shared when you request emergency help.',
    'जब आप आपातकालीन मदद माँगेंगे, तब आपका स्थान साझा किया जाएगा।',
  );
  static const startAsk = Localized('Start Emergency SOS?', 'आपातकालीन एसओएस शुरू करें?');
  static const startBody = Localized(
    'Sahaay will alert your emergency contacts and share your current location if available.',
    'सहाय आपके आपातकालीन संपर्कों को सूचित करेगा और उपलब्ध होने पर आपका वर्तमान स्थान साझा करेगा।',
  );
  static const yesStart = Localized('Yes, Start SOS', 'हाँ, एसओएस शुरू करें');
  static const cancel = Localized('Cancel', 'रद्द करें');
  static const live = Localized('LIVE', 'लाइव');
  static const activated = Localized('SOS Activated', 'एसओएस चालू है');
  static const activatedBody = Localized('We are contacting your emergency contacts.', 'हम आपके आपातकालीन संपर्कों से संपर्क कर रहे हैं।');
  static const alertSent = Localized('Alert sent to emergency contacts', 'आपातकालीन संपर्कों को सूचना भेज दी गई');
  static const locationStarted = Localized('Location sharing started', 'स्थान साझा करना शुरू हो गया');
  static const waitingFamily = Localized('Waiting for family response', 'परिवार के जवाब की प्रतीक्षा');
  static const call112 = Localized('CALL 112 – Emergency Services', '112 पर कॉल करें – आपातकालीन सेवाएँ');
  static const cancelSos = Localized('Cancel SOS', 'एसओएस रद्द करें');
  static const daughterResponding = Localized('Your daughter is responding!', 'आपकी बेटी जवाब दे रही है!');
  static const priyaOnWay = Localized('Priya has received your alert and is on the way.', 'प्रिया को आपकी सूचना मिल गई है और वह रास्ते में है।');
  static const onTheWay = Localized('On the way', 'रास्ते में');
  static const waiting = Localized('Waiting', 'प्रतीक्षा');
  static const showResponding = Localized('Show Priya responding', 'प्रिया का जवाब दिखाएँ');
  static const showWaiting = Localized('Show waiting again', 'फिर प्रतीक्षा दिखाएँ');
  static const whatNeed = Localized('What do you need help with?', 'आपको किस बात में मदद चाहिए?');
  static const danger = Localized(
    'If you are in immediate danger or need urgent medical assistance, use Emergency SOS.',
    'अगर तुरंत खतरा हो या जल्दी चिकित्सा मदद चाहिए, तो आपातकालीन एसओएस का उपयोग करें।',
  );
  static const submitRequest = Localized('Submit request', 'अनुरोध भेजें');
  static const requestSubmitted = Localized('Request submitted', 'अनुरोध भेज दिया गया');
  static const requestBody = Localized('Priya has been asked to help with this.', 'प्रिया से इस काम में मदद माँगी गई है।');
  static const callPriya = Localized('Call Priya', 'प्रिया को कॉल करें');
  static const calling = Localized('Calling...', 'कॉल हो रही है...');
  static const endCall = Localized('End call', 'कॉल समाप्त करें');
  static const speaker = Localized('Speaker', 'स्पीकर');
  static const mute = Localized('Mute', 'म्यूट');
  static const cancelAsk = Localized('Are you sure you want to cancel SOS?', 'क्या आप वाकई एसओएस रद्द करना चाहते हैं?');
  static const yesCancel = Localized('Yes, Cancel SOS', 'हाँ, एसओएस रद्द करें');
  static const stillNeed = Localized('No, I Still Need Help', 'नहीं, मुझे अभी भी मदद चाहिए');
  static const cancelledTitle = Localized('SOS cancelled', 'एसओएस रद्द हो गया');
  static const cancelledBody = Localized('The emergency alert has been cancelled.', 'आपातकालीन सूचना रद्द कर दी गई है।');
  static const backToSos = Localized('Back to Sahaay Emergency', 'सहाय आपातकाल पर वापस');
  static const yourLocation = Localized('Your current location', 'आपका वर्तमान स्थान');
  static const liveShared = Localized('Live location shared', 'लाइव स्थान साझा है');
  static const assistance = Localized('Assistance', 'सहायता');
  static const emergencyLabel = Localized('Emergency SOS', 'आपातकालीन एसओएस');
  static const services = Localized('Emergency Services', 'आपातकालीन सेवाएँ');
  static const quietStart = Localized('Quiet hours start', 'शांत घंटे शुरू');
  static const quietEnd = Localized('Quiet hours end', 'शांत घंटे खत्म');
  static const noPayments = Localized('No payments yet.', 'अभी कोई भुगतान नहीं है।');
  static const overdue = Localized('Overdue', 'अभी भी बाकी');
  static const due = Localized('Due', 'बाकी');

  static const needs = [
    Localized('I need help with my medicines.', 'मुझे दवाइयों में मदद चाहिए।'),
    Localized('I need help at home.', 'मुझे घर पर मदद चाहिए।'),
    Localized('I need help going somewhere.', 'मुझे कहीं जाने में मदद चाहिए।'),
    Localized("I'm not feeling well.", 'मेरी तबीयत ठीक नहीं है।'),
    Localized('I want to talk to someone.', 'मैं किसी से बात करना चाहता हूँ।'),
    Localized('Something else.', 'कुछ और।'),
  ];

  static Localized relation(String id) {
    return switch (id) {
      'daughter' => daughter,
      'son' => son,
      'sister' => sister,
      'brother' => brother,
      'spouse' => spouse,
      'friend' => friend,
      _ => other,
    };
  }

  static Localized slotGroup(String slot) {
    return switch (slot) {
      'morning' => morning,
      'afternoon' => afternoon,
      _ => evening,
    };
  }

  static Localized slotTitle(String slot) {
    return switch (slot) {
      'morning' => morningMed,
      'afternoon' => afternoonMed,
      _ => nightMed,
    };
  }

  static Localized slotWhen(String slot) {
    return switch (slot) {
      'morning' => afterBreakfast,
      'afternoon' => afterLunch,
      _ => afterDinner,
    };
  }

  static Localized habitTitle(String id) {
    return switch (id) {
      'water' => water,
      'walk' => walk,
      'stretch' => stretch,
      _ => rest,
    };
  }

  static Localized txStatus(String status) {
    return switch (status) {
      'success' => successful,
      'failed' => unsuccessful,
      'cancelled' => cancelled,
      _ => pending,
    };
  }

  static Localized medStatus(String status) {
    return switch (status) {
      'taken' => taken,
      'upcoming' => upcoming,
      _ => needsAttention,
    };
  }
}
