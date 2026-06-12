const SYMPTOM_PATTERNS = [
  { id: 'fever', patterns: [/fever/i, /feaver/i, /pyrexia/i, /hot body/i, /high temp/i, /बुखार/i, /bukhar/i, /జ్వర/i] },
  { id: 'headache', patterns: [/headache/i, /head ache/i, /migraine/i, /head pain/i] },
  { id: 'cough', patterns: [/cough/i, /coughing/i, /खांसी/i, /దగ్గు/i, /sore throat/i] },
  { id: 'fatigue', patterns: [/fatigue/i, /tired/i, /weakness/i, /body pain/i, /bodyache/i, /myalgia/i] },
  { id: 'chest pain', patterns: [/chest pain/i, /chest pressure/i] },
  { id: 'breathing issue', patterns: [/shortness of breath/i, /breathing difficulty/i, /can't breathe/i, /wheez/i] },
  { id: 'stomach pain', patterns: [/stomach/i, /abdominal/i, /belly pain/i, /nausea/i, /vomit/i, /diarrhea/i, /loose motion/i] },
  { id: 'diabetes', patterns: [/diabetes/i, /blood sugar/i, /glucose/i, /sugar level/i] },
  { id: 'allergy', patterns: [/allergy/i, /allergic/i, /rash/i, /itching/i, /hives/i] },
]

const PROFILES = {
  fever: {
    causes: ['Viral fever', 'Flu', 'Seasonal infection'],
    care: 'Rest, fluids, light meals, sponge/tepid cloth if very hot, monitor every 4-6 hours.',
    meds: 'Paracetamol 500 mg every 6-8 hours after food (max 4/day) + ORS every 3-4 hours.',
    questions: ['Exact temperature?', 'How many days?', 'Any cough, rash, or urine burning?'],
  },
  cough: {
    causes: ['Upper respiratory infection', 'Allergic irritation', 'Post-viral cough'],
    care: 'Warm fluids, steam inhalation, avoid cold drinks and smoke, sleep with head elevated.',
    meds: 'Honey-lemon warm water; paracetamol only if fever/pain. Avoid random antibiotics without doctor advice.',
    questions: ['Dry or wet cough?', 'Any fever or chest pain?', 'Smoking or asthma history?'],
  },
  headache: {
    causes: ['Tension headache', 'Migraine', 'Dehydration', 'Sinus pressure'],
    care: 'Hydrate, rest in a dark quiet room, reduce screen time, regular meals.',
    meds: 'Paracetamol 500 mg after food if needed; avoid repeated painkiller stacking.',
    questions: ['Sudden worst headache ever?', 'Vision changes or vomiting?', 'How many hours/days?'],
  },
  'stomach pain': {
    causes: ['Gastritis', 'Food infection', 'Acidity', 'Constipation'],
    care: 'Bland diet (rice, toast, banana), small sips ORS, avoid spicy/oily food and NSAIDs on empty stomach.',
    meds: 'ORS and rest first; antacids only if a doctor/pharmacist already advised them for you.',
    questions: ['Diarrhea or vomiting?', 'Blood in stool?', 'Pain location (upper/lower)?'],
  },
  diabetes: {
    causes: ['Blood sugar fluctuation', 'Missed meal/medicine', 'Infection stress'],
    care: 'Check glucose as directed, take prescribed diabetes medicines on time, hydrate, light walk if safe.',
    meds: 'Do not change insulin/tablet dose without your diabetologist.',
    questions: ['Last sugar reading?', 'Taking metformin/insulin regularly?', 'Fever or infection now?'],
  },
  allergy: {
    causes: ['Food/medicine allergy', 'Pollen/dust', 'Skin reaction'],
    care: 'Stop suspected trigger, cool compress on rash, note swelling of lips/face.',
    meds: 'Antihistamine only if previously advised by doctor; seek urgent care if breathing/swelling worsens.',
    questions: ['New medicine or food?', 'Lip/face swelling?', 'Difficulty breathing?'],
  },
  emergency: {
    causes: ['Possible cardiac, respiratory, or neurological emergency'],
    care: 'Call emergency services or go to nearest hospital now. Do not drive yourself if severe.',
    meds: 'Do not self-medicate for chest pain or stroke symptoms.',
    questions: ['When did it start?', 'Oxygen level if known?', 'One-sided weakness or speech trouble?'],
  },
  general: {
    causes: ['Needs more symptom detail'],
    care: 'Describe main symptom, duration, age, and current medicines for a tailored answer.',
    meds: 'No specific medicine suggested until symptoms are clearer.',
    questions: ['Main symptom?', 'Duration?', 'Existing conditions or medicines?'],
  },
}

function extractSymptoms(text = '') {
  const lower = String(text).toLowerCase()
  return [...new Set(SYMPTOM_PATTERNS.filter(({ patterns }) => patterns.some((p) => p.test(lower))).map(({ id }) => id))]
}

function buildConversationText(messages = []) {
  return messages.filter((m) => m.role === 'user' && m.text).map((m) => m.text).join(' ')
}

function parseFacts(messages = []) {
  const text = buildConversationText(messages)
  const facts = { temperature: null, days: null, oxygen: null }
  const temp = text.match(/(\d{2,3}(?:\.\d+)?)\s*(?:°|degrees?)?\s*([fc]|fahrenheit|celsius)?/i)
  if (temp) {
    const value = Number(temp[1])
    const unit = (temp[2] || 'f').toLowerCase()
    facts.temperature = unit.startsWith('c') ? `${value}°C` : value > 45 ? `${value}°F` : `${value}°F`
  }
  const days = text.match(/(\d+)\s*(?:days?|din|రోజుల)/i)
  if (days) facts.days = Number(days[1])
  const spo2 = text.match(/(?:oxygen|spo2|o2)\s*[:=]?\s*(\d{2,3})/i)
  if (spo2) facts.oxygen = Number(spo2[1])
  return facts
}

function isEmergency(text = '') {
  return /(chest pain|shortness of breath|breathing difficulty|stroke|unconscious|blue lips|heart attack|severe breath)/i.test(
    text,
  )
}

function detectIntent(message = '', history = []) {
  const lower = String(message).toLowerCase().trim()
  const context = buildConversationText(history)
  const full = `${context} ${lower}`

  if (isEmergency(lower) || isEmergency(context)) return 'emergency'
  if (/signs.*see.*doctor|doctor.*signs|when.*see.*doctor/i.test(lower)) return 'signs_doctor'
  if (/blood pressure|bp reading|bp level|hypertension/i.test(lower)) return 'bp_explanation'
  if (/safety-first|safety.*design|disclaimer|medical.*boundaries/i.test(lower)) return 'safety_design'
  if (/patient faq|faq mode/i.test(lower)) return 'faq_mode'
  if (/medicine info|medication info/i.test(lower)) return 'med_info_mode'
  if (/^(hi|hello|hey|namaste|good morning)\b/i.test(lower)) return 'greeting'
  if (/(what medicine|which medicine|can i take|should i take|paracetamol|dolo|ibuprofen|crocin)/i.test(lower)) return 'medicine'
  if (/(what food|can i eat|diet|avoid eating)/i.test(lower)) return 'diet'
  if (/(how long|how many days|when will i recover|recovery time)/i.test(lower)) return 'duration'
  if (/(thank|thanks|ok understood|got it)/i.test(lower)) return 'thanks'
  if (extractSymptoms(lower).length) return 'symptoms'
  if (/\d{2,3}\s*(?:f|fahrenheit|c|celsius)?/i.test(lower) || /^\d{1,2}$/.test(lower)) return 'vitals'
  if (extractSymptoms(context).length && lower.length < 120) return 'follow_up'
  return 'general'
}

function pickPrimaryProfile(symptoms = [], intent) {
  if (intent === 'emergency' || symptoms.includes('chest pain') || symptoms.includes('breathing issue')) return 'emergency'
  const order = ['stomach pain', 'diabetes', 'allergy', 'fever', 'cough', 'headache', 'fatigue']
  for (const key of order) {
    if (symptoms.includes(key)) return key
  }
  return 'general'
}

function formatFacts(facts, language) {
  const parts = []
  if (facts.temperature) parts.push(language === 'Hindi' ? `तापमान: ${facts.temperature}` : language === 'Telugu' ? `ఉష్ణోగ్రత: ${facts.temperature}` : `Temperature noted: ${facts.temperature}`)
  if (facts.days) parts.push(language === 'Hindi' ? `अवधि: ${facts.days} दिन` : language === 'Telugu' ? `వ్యవధి: ${facts.days} రోజులు` : `Duration noted: ${facts.days} day(s)`)
  if (facts.oxygen) parts.push(language === 'Hindi' ? `ऑक्सीजन: ${facts.oxygen}%` : language === 'Telugu' ? `ఆక్సిజన్: ${facts.oxygen}%` : `Oxygen noted: ${facts.oxygen}%`)
  return parts.join(' | ')
}

function t(language, en, hi, te) {
  if (language === 'Hindi') return hi
  if (language === 'Telugu') return te
  return en
}

function replyForIntent({ message, history, language, intent, symptoms, facts, profileKey }) {
  const profile = PROFILES[profileKey] || PROFILES.general
  const quote = t(language, `Your question: "${message}"`, `आपका सवाल: "${message}"`, `మీ ప్రశ్న: "${message}"`)
  const factLine = formatFacts(facts, language)

  if (intent === 'greeting') {
    return t(
      language,
      `${quote}\n\nHello. Tell me your main symptom (fever, cough, stomach pain, etc.), how long it has lasted, and your temperature if you know it.`,
      `${quote}\n\nनमस्ते। मुख्य लक्षण (बुखार, खांसी, पेट दर्द), कितने दिन से है, और तापमान बताएं।`,
      `${quote}\n\nనమస్తే. ప్రధాన లక్షణం (జ్వరం, దగ్గు, కడుపు నొప్పి), ఎన్ని రోజులు, ఉష్ణోగ్రత చెప్పండి.`,
    )
  }

  if (intent === 'thanks') {
    return t(
      language,
      `${quote}\n\nYou're welcome. If symptoms worsen or new warning signs appear (chest pain, breathing trouble, confusion), seek medical care immediately.`,
      `${quote}\n\nआपका स्वागत है। अगर लक्षण बढ़ें या सीने में दर्द/सांस की तकलीफ हो, तुरंत डॉक्टर से मिलें।`,
      `${quote}\n\nస్వాగతం. లక్షణాలు మరింత తీవ్రమైతే లేదా శ్వాస ఇబ్బంది వస్తే వెంటనే డాక్టర్‌ను సంప్రదించండి.`,
    )
  }

  if (intent === 'emergency') {
    return t(
      language,
      `${quote}\n\nInitial assessment: Possible emergency.\nCare: Seek urgent hospital care now. Call local emergency services if symptoms are active.\nDo not self-treat chest pain, stroke signs, or severe breathing difficulty.`,
      `${quote}\n\nप्रारंभिक आकलन: संभावित आपातकाल।\nतुरंत अस्पताल जाएं। सीने में दर्द, स्ट्रोक या सांस की तकलीफ में खुद से दवा न लें।`,
      `${quote}\n\nప్రాథమిక అంచనా: అత్యవసర పరిస్థితి అవకాశం.\nవెంటనే ఆసుపత్రికి వెళ్లండి. ఛాతి నొప్పి, స్ట్రోక్, తీవ్ర శ్వాస ఇబ్బందిలో స్వయంగా మందులు తీసుకోవద్దు.`,
    )
  }

  if (intent === 'signs_doctor') {
    return t(
      language,
      `${quote}\n\nCommon warning signs that mean you should see a doctor immediately include:\n- **Chest Pain or Pressure**\n- **Difficulty Breathing** or severe shortness of breath\n- **Sudden Weakness or Numbness** on one side of your body\n- **High Fever** (above 103°F or 39.4°C) lasting more than 3 days\n- **Sudden Severe Headache** or stiff neck\n- **Confusion**, speech difficulty, or fainting spells.\n\nAlways consult a certified medical professional if you experience any of these signs.`,
      `${quote}\n\nडॉक्टर से तुरंत मिलने के मुख्य लक्षण:\n- सीने में दर्द या भारीपन\n- सांस लेने में कठिनाई\n- शरीर के एक तरफ अचानक कमजोरी या सुन्नता\n- ३ दिन से ज्यादा तेज बुखार (103°F से अधिक)\n- तेज सिरदर्द या गर्दन में अकड़न।`,
      `${quote}\n\nవెంటనే వైద్యుడిని సంప్రదించాల్సిన ముఖ్య లక్షణాలు:\n- ఛాతీ నొప్పి లేదా ఒత్తిడి\n- శ్వాస తీసుకోవడంలో ఇబ్బంది\n- శరీరం ఒక వైపు అకస్మాత్తుగా బలహీనపడటం లేదా తిమ్మిరి రావడం\n- 3 రోజుల కంటే ఎక్కువ కాలం ఉండే తీవ్రమైన జ్వరం (103°F కంటే ఎక్కువ)\n- తీవ్రమైన తలనొప్పి లేదా మెడ బిగుతుగా ఉండటం.`
    )
  }

  if (intent === 'bp_explanation') {
    return t(
      language,
      `${quote}\n\nBlood pressure readings consist of two numbers (systolic/diastolic in mmHg):\n- **Systolic (Top number)**: Pressure when your heart beats.\n- **Diastolic (Bottom number)**: Pressure when your heart rests between beats.\n\n**Categories**:\n- **Normal**: Below 120/80 mmHg.\n- **Elevated**: Systolic 120-129 and Diastolic <80 mmHg.\n- **Hypertension Stage 1**: Systolic 130-139 or Diastolic 80-89 mmHg.\n- **Hypertension Stage 2**: Systolic 140 or higher, or Diastolic 90 or higher.\n- **Hypertensive Crisis**: Over 180/120 mmHg (Requires immediate emergency attention!).`,
      `${quote}\n\nरक्तचाप (Blood Pressure) के दो अंक होते हैं:\n- **Systolic (ऊपर का अंक)**: दिल की धड़कन के समय का दबाव। सामान्य: 120 से कम।\n- **Diastolic (नीचे का अंक)**: दिल के आराम के समय का दबाव। सामान्य: 80 से कम।\n\n- सामान्य: 120/80 mmHg से कम\n- उच्च रक्तचाप: 130/80 mmHg या अधिक।`,
      `${quote}\n\nరక్తపోటు (Blood Pressure) లో రెండు సంఖ్యలు ఉంటాయి:\n- **సిస్టోలిక్ (పైన ఉండే సంఖ్య)**: గుండె కొట్టుకున్నప్పుడు ఒత్తిడి. సాధారణంగా: 120 కంటే తక్కువ.\n- **డయాస్టోలిక్ (క్రింద ఉండే సంఖ్య)**: గుండె విశ్రాంతి తీసుకుంటున్నప్పుడు ఒత్తిడి. సాధారణంగా: 80 కంటే తక్కువ.\n\n- సాధారణం: 120/80 mmHg కంటే తక్కువ\n- అధిక రక్తపోటు: 130/80 mmHg లేదా అంతకంటే ఎక్కువ.`
    )
  }


  if (intent === 'emergency') {
    return t(
      language,
      `⚠️ EMERGENCY WARNING: Severe symptoms detected. Please stop all physical activity and seek immediate medical care at the nearest hospital or call emergency services (911/108) immediately.`,
      `⚠️ आपातकालीन चेतावनी: गंभीर लक्षण पाए गए हैं। कृपया सभी शारीरिक गतिविधियाँ रोकें और तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें या निकटतम अस्पताल जाएँ।`,
      `⚠️ అత్యవసర హెచ్చరిక: తీవ్రమైన లక్షణాలు గుర్తించబడ్డాయి. దయచేసి శారీరక శ్రమను నిలిపివేసి, వెంటనే అత్యవసర వైద్య సేవలను సంప్రదించండి లేదా సమీప ఆసుపత్రికి వెళ్ళండి.`
    )
  }

  if (intent === 'medicine' || intent === 'diet' || intent === 'duration') {
    return t(
      language,
      `${quote}\n\nFor queries regarding medications, prescriptions, or diet plans, please navigate to the **Reports** tab and upload your medical scan or lab report. All customized explanations of findings, prescription suggestions, and food recommendations will be displayed directly beside your uploaded file.`,
      `${quote}\n\nदवाओं, प्रिस्क्रिप्शन या आहार से संबंधित जानकारी के लिए, कृपया **Reports** टैब पर जाएं और अपनी रिपोर्ट या स्कैन अपलोड करें। सभी विवरण फ़ाइल के ठीक बगल में दिखाई देंगे।`,
      `${quote}\n\nమందులు, ప్రిస్క్రిప్షన్లు లేదా ఆహార నియమాల కొరకు, దయచేసి **Reports** ట్యాబ్‌కు వెళ్లి మీ వైద్య నివేదిక లేదా స్కాన్‌ను అప్‌లోడ్ చేయండి. అన్ని వివరాలు మీ ఫైల్ పక్కనే చూపబడతాయి.`
    )
  }

  if (intent === 'vitals' || intent === 'follow_up' || intent === 'symptoms' || intent === 'general') {
    const symptomLabel = symptoms.length ? symptoms.join(', ') : t(language, 'reported symptoms', 'आपके बताए लक्षण', 'మీరు చెప్పిన లక్షణాలు')
    return t(
      language,
      `${quote}\n\nI have noted your symptom(s): ${symptomLabel}. To ensure patient safety, direct medical solutions are restricted in chat. Please check the dedicated **Symptom Checker** tab, where detailed possible causes, self-care measures, and warning signs have been updated and are displayed inline.`,
      `${quote}\n\nमैंने आपके लक्षण दर्ज कर लिए हैं: ${symptomLabel}। सुरक्षा कारणों से चैट में सीधे समाधान प्रतिबंधित हैं। कृपया समर्पित **Symptom Checker** टैब देखें, जहाँ संभावित कारण और सावधानियाँ दिखाई देंगी।`,
      `${quote}\n\nనేను మీ లక్షణాలను నమోదు చేసుకున్నాను: ${symptomLabel}. భద్రతా నిబంధనల ప్రకారం చాట్‌లో నేరుగా వైద్య సలహాలు ఇవ్వబడవు. దయచేసి **Symptom Checker** ట్యాబ్‌ను చూడండి, అక్కడ కారణాలు మరియు జాగ్రత్తలు వివరంగా ఇవ్వబడ్డాయి.`
    )
  }
}

function localMedicalReply(message, history = [], language = 'English') {
  const allMessages = [...(history || []), { role: 'user', text: message }]
  const conversationSymptoms = extractSymptoms(buildConversationText(allMessages))
  const messageSymptoms = extractSymptoms(message)
  const symptoms = [...new Set([...conversationSymptoms, ...messageSymptoms])]
  const intent = detectIntent(message, history)
  const facts = parseFacts(allMessages)
  const profileKey = pickPrimaryProfile(symptoms, intent)
  return replyForIntent({ message, history, language, intent, symptoms, facts, profileKey })
}

module.exports = {
  localMedicalReply,
  extractSymptoms,
  buildConversationText,
  parseFacts,
  detectIntent,
}
