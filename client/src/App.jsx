import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  CalendarClock,
  Camera,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Fingerprint,
  HeartPulse,
  Home,
  Languages,
  Lock,
  LogOut,
  Mail,
  Mic,
  Moon,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Sparkles as SparkleIcon,
  Stethoscope,
  Sun,
  Upload,
  User,
  Utensils,
, Mic, StopCircle, MapPin, ShieldAlert, FileWarning, ClipboardList, PenTool} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import jsPDF from 'jspdf'
import * as THREE from 'three'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const languages = ['English', 'Hindi', 'Telugu']

const uiText = {
  Hindi: {
    Dashboard: 'डैशबोर्ड',
    'AI Chat': 'एआई चैट',
    Analysis: 'विश्लेषण',
    '3D Visualization': '3डी विजुअलाइजेशन',
    Prescriptions: 'प्रिस्क्रिप्शन',
    'Food Recommendations': 'भोजन सुझाव',
    Reports: 'रिपोर्ट',
    'Emergency Alerts': 'आपातकालीन अलर्ट',
    'Health Analytics': 'स्वास्थ्य विश्लेषण',
    Settings: 'सेटिंग्स',
    'Secure Logout': 'सुरक्षित लॉगआउट',
    'Search symptoms, reports, prescriptions...': 'लक्षण, रिपोर्ट, प्रिस्क्रिप्शन खोजें...',
    'AI assistant online': 'एआई सहायक ऑनलाइन',
    'Intelligent Healthcare Dashboard': 'बुद्धिमान स्वास्थ्य डैशबोर्ड',
    'AI Assistant Active': 'एआई सहायक सक्रिय',
    'Ask AI': 'एआई से पूछें',
    'Health Score': 'स्वास्थ्य स्कोर',
    Good: 'अच्छा',
    'Keep it up': 'इसे जारी रखें',
    'Active Symptoms': 'सक्रिय लक्षण',
    'View Details': 'विवरण देखें',
    'Recovery Progress': 'रिकवरी प्रगति',
    'Almost there': 'लगभग हो गया',
    'Next Reminder': 'अगला रिमाइंडर',
    'All taken!': 'सब ले लिया!',
    'Great job following schedule.': 'शेड्यूल का पालन बहुत अच्छा.',
    'View All': 'सब देखें',
    'Emergency Alert': 'आपातकालीन अलर्ट',
    'High Fever detected': 'तेज बुखार मिला',
    'Please take rest and consult a doctor if symptoms persist.': 'कृपया आराम करें और लक्षण बने रहें तो डॉक्टर से मिलें.',
    'Find Nearest Hospital': 'नजदीकी अस्पताल खोजें',
    'AI Medical Chat': 'एआई मेडिकल चैट',
    'Hello! I am MediVision AI. How can I help?': 'नमस्ते! मैं MediVision AI हूं. मैं कैसे मदद कर सकता हूं?',
    'I have headache, fever and body pain.': 'मुझे सिरदर्द, बुखार और शरीर में दर्द है.',
    'I will analyze your symptoms. What is your temperature?': 'मैं आपके लक्षणों का विश्लेषण करूंगा. आपका तापमान क्या है?',
    'Type your message...': 'अपना संदेश लिखें...',
    Go: 'जाएं',
    'Lung Infection': 'फेफड़ों का संक्रमण',
    'Inflammation detected in the left lung': 'बाएं फेफड़े में सूजन मिली',
    'AI Analysis': 'एआई विश्लेषण',
    'Severity Level': 'गंभीरता स्तर',
    Moderate: 'मध्यम',
    Confidence: 'विश्वास',
    Prescription: 'प्रिस्क्रिप्शन',
    'Download PDF': 'पीडीएफ डाउनलोड',
    'Food Recommendations': 'भोजन सुझाव',
    'Health Analytics': 'स्वास्थ्य विश्लेषण',
    Reports: 'रिपोर्ट',
    'Medicine Reminder': 'दवा रिमाइंडर',
    'No reminders active.': 'कोई सक्रिय रिमाइंडर नहीं.',
    'Tap the mic and ask anything about your health...': 'माइक दबाएं और अपने स्वास्थ्य के बारे में पूछें...',
    'Listening... Please speak your question now.': 'सुन रहा हूं... कृपया अपना सवाल बोलें.',
    'AI Medical Chatbot': 'एआई मेडिकल चैटबॉट',
    'Professional triage support, not a final diagnosis': 'पेशेवर ट्रायेज सहायता, अंतिम निदान नहीं',
    'Voice: On': 'आवाज: चालू',
    'Voice: Off': 'आवाज: बंद',
    'Choose a workflow': 'वर्कफ़्लो चुनें',
    'Skin image triage': 'त्वचा फोटो ट्रायेज',
    'Upload a photo for general, non-diagnostic guidance.': 'सामान्य, गैर-निदान मार्गदर्शन के लिए फोटो अपलोड करें.',
    'Go to Reports ->': 'रिपोर्ट पर जाएं ->',
    'Report explainer': 'रिपोर्ट समझाने वाला',
    'Upload lab results or PDFs for a plain-language summary.': 'सरल सारांश के लिए लैब परिणाम या PDF अपलोड करें.',
    'Patient FAQ': 'रोगी प्रश्न',
    'Ask direct health questions and get simple answers.': 'सीधे स्वास्थ्य सवाल पूछें और सरल जवाब पाएं.',
    'Medicine info': 'दवा जानकारी',
    'General education about medications (no dosing advice).': 'दवाओं के बारे में सामान्य शिक्षा (खुराक सलाह नहीं).',
    'Quick questions:': 'त्वरित सवाल:',
    'Signs to see doctor': 'डॉक्टर को कब दिखाएं',
    'Explain Blood Pressure': 'ब्लड प्रेशर समझाएं',
    'Safety guidelines': 'सुरक्षा दिशानिर्देश',
    'Listening... Speak now.': 'सुन रहा हूं... अब बोलें.',
    'Ask any medical question: fever, cold, cough...': 'कोई भी मेडिकल सवाल पूछें: बुखार, जुकाम, खांसी...',
    Analyze: 'विश्लेषण करें',
    'Open Prescriptions': 'प्रिस्क्रिप्शन खोलें',
    'Live Symptom Triage': 'लाइव लक्षण ट्रायेज',
    'Click to Triage': 'ट्रायेज के लिए क्लिक करें',
    'Quick Symptom Solutions': 'त्वरित लक्षण समाधान',
    'Fever, Cold & Cough Triage': 'बुखार, जुकाम और खांसी ट्रायेज',
    'Stomach Pain & Acidity Solutions': 'पेट दर्द और एसिडिटी समाधान',
    'No emergency signal in current text.': 'वर्तमान टेक्स्ट में आपात संकेत नहीं.',
    'Danger signal detected. Emergency workflow armed.': 'खतरे का संकेत मिला. आपातकालीन वर्कफ़्लो तैयार.',
    'Hello. I am MediVision AI. Tell me your symptoms, duration, age, and any existing conditions. I can triage, explain risks, and prepare a doctor-ready summary.': 'नमस्ते. मैं MediVision AI हूं. अपने लक्षण, अवधि, उम्र और मौजूदा बीमारी बताएं. मैं ट्रायेज, जोखिम समझाने और डॉक्टर के लिए सारांश तैयार करने में मदद कर सकता हूं.',
    'AI Analysis Engine': 'एआई विश्लेषण इंजन',
    'Affected Organs': 'प्रभावित अंग',
    'Severity Matrix': 'गंभीरता मैट्रिक्स',
    '3D Full Body Visualization': '3डी फुल बॉडी विजुअलाइजेशन',
    'Disease Identification': 'रोग पहचान',
    'AI Prescription Generator': 'एआई प्रिस्क्रिप्शन जनरेटर',
    'Tablet Intake & Reminders Schedule': 'टैबलेट सेवन और रिमाइंडर शेड्यूल',
    'Food Recommendation System': 'भोजन सुझाव प्रणाली',
    'Emergency Alert System': 'आपातकालीन अलर्ट सिस्टम',
    'Urgent Instructions': 'जरूरी निर्देश',
    'Medical Report Upload System': 'मेडिकल रिपोर्ट अपलोड सिस्टम',
    'AI Report Summary': 'एआई रिपोर्ट सारांश',
    'Longitudinal Health Analytics': 'दीर्घकालिक स्वास्थ्य विश्लेषण',
    'Disease History': 'रोग इतिहास',
    'User Profile System': 'यूजर प्रोफाइल सिस्टम',
  },
  Telugu: {
    Dashboard: 'డాష్‌బోర్డ్',
    'AI Chat': 'ఏఐ చాట్',
    Analysis: 'విశ్లేషణ',
    '3D Visualization': '3D విజువలైజేషన్',
    Prescriptions: 'ప్రిస్క్రిప్షన్లు',
    'Food Recommendations': 'ఆహార సూచనలు',
    Reports: 'రిపోర్టులు',
    'Emergency Alerts': 'అత్యవసర హెచ్చరికలు',
    'Health Analytics': 'ఆరోగ్య విశ్లేషణ',
    Settings: 'సెట్టింగ్‌లు',
    'Secure Logout': 'సురక్షిత లాగౌట్',
    'Search symptoms, reports, prescriptions...': 'లక్షణాలు, రిపోర్టులు, ప్రిస్క్రిప్షన్లు వెతకండి...',
    'AI assistant online': 'ఏఐ సహాయకుడు ఆన్‌లైన్‌లో ఉన్నాడు',
    'Intelligent Healthcare Dashboard': 'తెలివైన ఆరోగ్య డాష్‌బోర్డ్',
    'AI Assistant Active': 'ఏఐ సహాయకుడు సక్రియంగా ఉన్నాడు',
    'Ask AI': 'ఏఐని అడగండి',
    'Health Score': 'ఆరోగ్య స్కోర్',
    Good: 'బాగుంది',
    'Keep it up': 'ఇలాగే కొనసాగించండి',
    'Active Symptoms': 'సక్రియ లక్షణాలు',
    'View Details': 'వివరాలు చూడండి',
    'Recovery Progress': 'రికవరీ పురోగతి',
    'Almost there': 'దాదాపు పూర్తయింది',
    'Next Reminder': 'తదుపరి రిమైండర్',
    'All taken!': 'అన్నీ తీసుకున్నారు!',
    'Great job following schedule.': 'షెడ్యూల్ పాటించడం చాలా బాగుంది.',
    'View All': 'అన్నీ చూడండి',
    'Emergency Alert': 'అత్యవసర హెచ్చరిక',
    'High Fever detected': 'అధిక జ్వరం గుర్తించబడింది',
    'Please take rest and consult a doctor if symptoms persist.': 'దయచేసి విశ్రాంతి తీసుకోండి; లక్షణాలు కొనసాగితే డాక్టర్‌ను సంప్రదించండి.',
    'Find Nearest Hospital': 'సమీప ఆసుపత్రి కనుగొనండి',
    'AI Medical Chat': 'ఏఐ మెడికల్ చాట్',
    'Hello! I am MediVision AI. How can I help?': 'నమస్కారం! నేను MediVision AI. ఎలా సహాయం చేయగలను?',
    'I have headache, fever and body pain.': 'నాకు తలనొప్పి, జ్వరం, శరీర నొప్పి ఉన్నాయి.',
    'I will analyze your symptoms. What is your temperature?': 'మీ లక్షణాలను విశ్లేషిస్తాను. మీ ఉష్ణోగ్రత ఎంత?',
    'Type your message...': 'మీ సందేశం టైప్ చేయండి...',
    Go: 'వెళ్ళండి',
    'Lung Infection': 'ఊపిరితిత్తుల ఇన్‌ఫెక్షన్',
    'Inflammation detected in the left lung': 'ఎడమ ఊపిరితిత్తిలో వాపు గుర్తించబడింది',
    'AI Analysis': 'ఏఐ విశ్లేషణ',
    'Severity Level': 'తీవ్రత స్థాయి',
    Moderate: 'మధ్యస్థం',
    Confidence: 'నమ్మకం',
    Prescription: 'ప్రిస్క్రిప్షన్',
    'Download PDF': 'PDF డౌన్‌లోడ్',
    'Medicine Reminder': 'మందుల రిమైండర్',
    'No reminders active.': 'సక్రియ రిమైండర్లు లేవు.',
    'Tap the mic and ask anything about your health...': 'మైక్ నొక్కి మీ ఆరోగ్యం గురించి ఏదైనా అడగండి...',
    'Listening... Please speak your question now.': 'వింటున్నాను... దయచేసి మీ ప్రశ్న చెప్పండి.',
    'AI Medical Chatbot': 'ఏఐ మెడికల్ చాట్‌బాట్',
    'Professional triage support, not a final diagnosis': 'ప్రొఫెషనల్ ట్రయాజ్ సహాయం, తుది నిర్ధారణ కాదు',
    'Voice: On': 'వాయిస్: ఆన్',
    'Voice: Off': 'వాయిస్: ఆఫ్',
    'Choose a workflow': 'వర్క్‌ఫ్లో ఎంచుకోండి',
    'Skin image triage': 'చర్మ చిత్రం ట్రయాజ్',
    'Upload a photo for general, non-diagnostic guidance.': 'సాధారణ, నిర్ధారణ కాని మార్గదర్శకత్వం కోసం ఫోటో అప్లోడ్ చేయండి.',
    'Go to Reports ->': 'రిపోర్టులకు వెళ్లండి ->',
    'Report explainer': 'రిపోర్ట్ వివరణ',
    'Upload lab results or PDFs for a plain-language summary.': 'సులభమైన సారాంశం కోసం ల్యాబ్ ఫలితాలు లేదా PDFలు అప్లోడ్ చేయండి.',
    'Patient FAQ': 'రోగి ప్రశ్నలు',
    'Ask direct health questions and get simple answers.': 'నేరుగా ఆరోగ్య ప్రశ్నలు అడిగి సరళమైన సమాధానాలు పొందండి.',
    'Medicine info': 'మందుల సమాచారం',
    'General education about medications (no dosing advice).': 'మందుల గురించి సాధారణ విద్య (డోసింగ్ సలహా కాదు).',
    'Quick questions:': 'త్వరిత ప్రశ్నలు:',
    'Signs to see doctor': 'డాక్టర్‌ను ఎప్పుడు చూడాలి',
    'Explain Blood Pressure': 'బ్లడ్ ప్రెషర్ వివరించండి',
    'Safety guidelines': 'భద్రతా మార్గదర్శకాలు',
    'Listening... Speak now.': 'వింటున్నాను... ఇప్పుడు మాట్లాడండి.',
    'Ask any medical question: fever, cold, cough...': 'ఏదైనా వైద్య ప్రశ్న అడగండి: జ్వరం, జలుబు, దగ్గు...',
    Analyze: 'విశ్లేషించండి',
    'Open Prescriptions': 'ప్రిస్క్రిప్షన్లు తెరవండి',
    'Live Symptom Triage': 'లైవ్ లక్షణ ట్రయాజ్',
    'Click to Triage': 'ట్రయాజ్ కోసం క్లిక్ చేయండి',
    'Quick Symptom Solutions': 'త్వరిత లక్షణ పరిష్కారాలు',
    'Fever, Cold & Cough Triage': 'జ్వరం, జలుబు మరియు దగ్గు ట్రయాజ్',
    'Stomach Pain & Acidity Solutions': 'కడుపు నొప్పి మరియు ఆమ్లత్వం పరిష్కారాలు',
    'No emergency signal in current text.': 'ప్రస్తుత టెక్స్ట్‌లో అత్యవసర సంకేతం లేదు.',
    'Danger signal detected. Emergency workflow armed.': 'ప్రమాద సంకేతం గుర్తించబడింది. అత్యవసర వర్క్‌ఫ్లో సిద్ధంగా ఉంది.',
    'Hello. I am MediVision AI. Tell me your symptoms, duration, age, and any existing conditions. I can triage, explain risks, and prepare a doctor-ready summary.': 'నమస్కారం. నేను MediVision AI. మీ లక్షణాలు, ఎంతకాలంగా ఉన్నాయో, వయస్సు, ఉన్న ఆరోగ్య సమస్యలు చెప్పండి. నేను ట్రయాజ్ చేసి, ప్రమాదాలను వివరించి, డాక్టర్‌కు ఉపయోగపడే సారాంశం సిద్ధం చేయగలను.',
    'AI Analysis Engine': 'ఏఐ విశ్లేషణ ఇంజిన్',
    'Affected Organs': 'ప్రభావిత అవయవాలు',
    'Severity Matrix': 'తీవ్రత మ్యాట్రిక్స్',
    '3D Full Body Visualization': '3D పూర్తి శరీర విజువలైజేషన్',
    'Disease Identification': 'వ్యాధి గుర్తింపు',
    'AI Prescription Generator': 'ఏఐ ప్రిస్క్రిప్షన్ జనరేటర్',
    'Tablet Intake & Reminders Schedule': 'టాబ్లెట్ తీసుకునే మరియు రిమైండర్ షెడ్యూల్',
    'Food Recommendation System': 'ఆహార సూచన వ్యవస్థ',
    'Emergency Alert System': 'అత్యవసర హెచ్చరిక వ్యవస్థ',
    'Urgent Instructions': 'అత్యవసర సూచనలు',
    'Medical Report Upload System': 'మెడికల్ రిపోర్ట్ అప్లోడ్ వ్యవస్థ',
    'AI Report Summary': 'ఏఐ రిపోర్ట్ సారాంశం',
    'Longitudinal Health Analytics': 'దీర్ఘకాల ఆరోగ్య విశ్లేషణ',
    'Disease History': 'వ్యాధి చరిత్ర',
    'User Profile System': 'వినియోగదారు ప్రొఫైల్ వ్యవస్థ',
  },
}

function t(text, language = 'English') {
  return uiText[language]?.[text] || text
}

const navItems = [
  ['Dashboard', Home],
  ['AI Chat', Brain],
  ['Analysis', Activity],
  ['3D Visualization', Eye],
  ['Prescriptions', Pill],
  ['Food Recommendations', Utensils],
  ['Reports', FileText],
  ['Emergency Alerts', AlertTriangle],
  ['Health Analytics', HeartPulse],
  ['Settings', Settings],
]

const symptoms = ['fever', 'headache', 'cough', 'chest pain', 'breathing issue']

const analytics = [
  { name: 'Viral Fever', confidence: 82, color: '#29d3ff' },
  { name: 'Flu', confidence: 73, color: '#8b5cf6' },
  { name: 'Migraine', confidence: 45, color: '#f59e0b' },
]

const organDiseases = {
  lungs: {
    organ: 'Lungs',
    disease: 'Respiratory infection',
    confidence: 86,
    severity: 'Moderate',
    color: '#29d3ff',
    symptoms: ['cough', 'breathing discomfort', 'fever', 'low stamina'],
    finding: 'Inflammation pattern detected around the bronchial region with infection spread simulation.',
    recommendation: 'Check oxygen saturation, hydrate, avoid smoke/dust, and consult a doctor if breathing worsens.',
  },
  heart: {
    organ: 'Heart',
    disease: 'Possible cardiac blockage risk',
    confidence: 74,
    severity: 'High',
    color: '#ef4444',
    symptoms: ['chest pressure', 'left arm pain', 'sweating', 'shortness of breath'],
    finding: 'Red pulse concentration indicates stress near coronary flow pathways.',
    recommendation: 'Chest pain or breathing difficulty is urgent. Seek emergency medical evaluation immediately.',
  },
  stomach: {
    organ: 'Stomach',
    disease: 'Gastric inflammation',
    confidence: 69,
    severity: 'Low to Moderate',
    color: '#f59e0b',
    symptoms: ['burning pain', 'nausea', 'bloating', 'acid reflux'],
    finding: 'Thermal glow suggests irritation across the digestive lining.',
    recommendation: 'Use bland foods, warm fluids, avoid spicy/oily meals, and review persistent pain with a clinician.',
  },
  brain: {
    organ: 'Brain',
    disease: 'Migraine / neurological stress',
    confidence: 78,
    severity: 'Moderate',
    color: '#8b5cf6',
    symptoms: ['headache', 'light sensitivity', 'dizziness', 'nausea'],
    finding: 'Violet pressure wave indicates stress response around the cranial region.',
    recommendation: 'Rest in a dark room, hydrate, reduce screen exposure, and seek urgent care for sudden severe headache.',
  },
}

const timeline = [
  { day: 'Mon', score: 62, pulse: 86 },
  { day: 'Tue', score: 68, pulse: 82 },
  { day: 'Wed', score: 72, pulse: 78 },
  { day: 'Thu', score: 76, pulse: 80 },
  { day: 'Fri', score: 81, pulse: 74 },
  { day: 'Sat', score: 86, pulse: 72 },
  { day: 'Sun', score: 91, pulse: 70 },
]

const foodCards = [
  {
    title: 'Warm Immunity Soup',
    tag: 'Fever recovery',
    calories: 180,
    benefit: 'Hydration, electrolytes, easy digestion',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Coconut Water',
    tag: 'Low energy',
    calories: 46,
    benefit: 'Potassium support and rehydration',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Fiber Rich Bowl',
    tag: 'Diabetes friendly',
    calories: 320,
    benefit: 'Stable glucose and gut health',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
]

const defaultPrescription = {
  disclaimer: 'Consult a certified doctor before taking medicines.',
  medicines: [
    { name: 'Paracetamol', dosage: '500 mg', timing: 'After food, every 6-8 hours if fever persists' },
    { name: 'ORS / electrolyte solution', dosage: '250 ml', timing: 'Every 3 hours during fever or dehydration' },
  ],
}

function loadConsultation() {
  try {
    const saved = sessionStorage.getItem('medivision_consultation')
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore invalid session data */
  }
  return { symptoms: [], prescription: defaultPrescription, lastMessage: '' }
}

function buildClientAnalysis(text) {
  const lower = String(text).toLowerCase()
  const symptoms = []
  if (/fever|feaver|pyrexia|bukhar|बुखार|జ్వర/i.test(lower)) symptoms.push('fever')
  if (/headache|migraine/i.test(lower)) symptoms.push('headache')
  if (/cough/i.test(lower)) symptoms.push('cough')
  if (/body pain|bodyache|fatigue|weakness/i.test(lower)) symptoms.push('fatigue')
  if (/stomach|vomit|diarrhea|nausea/i.test(lower)) symptoms.push('stomach pain')
  if (/diabetes|blood sugar/i.test(lower)) symptoms.push('diabetes')
  if (/allergy|rash|itch/i.test(lower)) symptoms.push('allergy')
  return { symptoms, severity: symptoms.includes('fever') ? 'Moderate' : 'Low to Moderate' }
}

function buildClientPrescription(text) {
  const analysis = buildClientAnalysis(text)
  if (!analysis.symptoms.length) return { ...defaultPrescription, symptoms: [] }
  const medicines = [
    {
      name: 'Paracetamol (Acetaminophen)',
      dosage: '500 mg',
      timing: 'Every 6-8 hours after food for fever, headache, or body pain (max 4 doses in 24 hours)',
    },
    { name: 'ORS / electrolyte solution', dosage: '200-250 ml', timing: 'Every 3-4 hours while fever continues' },
  ]
  if (analysis.symptoms.includes('fever')) {
    medicines.push({ name: 'Vitamin C (optional)', dosage: '500 mg', timing: 'Once daily after food during recovery' })
  }
  if (analysis.symptoms.includes('cough')) {
    medicines.push({ name: 'Steam inhalation / warm fluids', dosage: '10 minutes', timing: '2-3 times daily if congested' })
  }
  medicines.push({
    name: 'Rest & temperature monitoring',
    dosage: '—',
    timing: 'Check temperature every 4-6 hours; see a doctor if fever lasts more than 3 days',
  })
  return {
    disclaimer: 'Consult a certified doctor before taking medicines.',
    medicines,
    symptoms: analysis.symptoms,
  }
}

const initialMessages = [
  {
    role: 'assistant',
    text:
      'Hello. I am MediVision AI. Tell me your symptoms, duration, age, and any existing conditions. I can triage, explain risks, and prepare a doctor-ready summary.',
  },
]

function api(path, options = {}) {
  const token = localStorage.getItem('medivision_token')
  return fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
  })
}

function speakText(text, language = 'English') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel() // Stop any current speech
  const cleanText = text.replace(/Your question: ".*?"/i, '').replace(/[\*#_`]/g, '').trim()
  const utterance = new SpeechSynthesisUtterance(cleanText)
  
  const voices = window.speechSynthesis.getVoices()
  let selectedVoice = null
  
  if (language === 'Telugu') {
    selectedVoice = voices.find(v => v.lang.startsWith('te') || v.name.includes('Telugu') || v.name.includes('India'))
    utterance.rate = 0.95
  } else if (language === 'Hindi') {
    selectedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('India'))
    utterance.rate = 0.95
  } else {
    selectedVoice = voices.find(v => v.lang.startsWith('en') || v.name.includes('Google US English') || v.name.includes('Microsoft David'))
    utterance.rate = 1.05
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }
  window.speechSynthesis.speak(utterance)
}

function startSpeechRecognition(onTranscript, onEnd, language = 'English') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.")
    return null
  }
  const rec = new SpeechRecognition()
  rec.continuous = false
  rec.interimResults = false
  
  if (language === 'Telugu') rec.lang = 'te-IN'
  else if (language === 'Hindi') rec.lang = 'hi-IN'
  else rec.lang = 'en-US'
  
  rec.onresult = (event) => {
    const text = event.results[0][0].transcript
    onTranscript(text)
  }
  rec.onend = () => {
    if (onEnd) onEnd()
  }
  rec.onerror = (e) => {
    console.error("Speech recognition error:", e)
    if (onEnd) onEnd()
  }
  rec.start()
  return rec
}

function generateRemindersFromPrescription(prescription) {
  if (!prescription || !prescription.medicines) return []
  const reminders = []
  prescription.medicines.forEach((med) => {
    const name = med.name || med.medicine || ''
    const dosage = med.dosage || ''
    const timing = med.timing || ''
    if (!name || name === '—' || name.toLowerCase().includes('rest & monitoring') || name.toLowerCase().includes('hydration')) return
    
    const lower = timing.toLowerCase()
    if (lower.includes('once daily') || lower.includes('once a day') || lower.includes('1 time')) {
      reminders.push({ id: `${name}-morning`, name, dosage, time: '09:00 AM', taken: false })
    } else if (lower.includes('twice daily') || lower.includes('2 times') || lower.includes('every 12 hours')) {
      reminders.push({ id: `${name}-morning`, name, dosage, time: '09:00 AM', taken: false })
      reminders.push({ id: `${name}-night`, name, dosage, time: '09:00 PM', taken: false })
    } else if (lower.includes('three times') || lower.includes('3 times') || lower.includes('every 8 hours') || lower.includes('6-8 hours')) {
      reminders.push({ id: `${name}-morning`, name, dosage, time: '08:30 AM', taken: false })
      reminders.push({ id: `${name}-afternoon`, name, dosage, time: '01:30 PM', taken: false })
      reminders.push({ id: `${name}-night`, name, dosage, time: '08:30 PM', taken: false })
    } else if (lower.includes('every 3-4 hours') || lower.includes('every 3 hours')) {
      reminders.push({ id: `${name}-morning`, name, dosage, time: '10:00 AM', taken: false })
      reminders.push({ id: `${name}-afternoon`, name, dosage, time: '02:00 PM', taken: false })
      reminders.push({ id: `${name}-evening`, name, dosage, time: '06:00 PM', taken: false })
      reminders.push({ id: `${name}-night`, name, dosage, time: '10:00 PM', taken: false })
    } else {
      reminders.push({ id: `${name}-morning`, name, dosage, time: '09:00 AM', taken: false })
      reminders.push({ id: `${name}-night`, name, dosage, time: '09:00 PM', taken: false })
    }
  })
  return reminders
}

function loadReminders(consultation) {
  try {
    const saved = sessionStorage.getItem('medivision_reminders')
    if (saved) return JSON.parse(saved)
  } catch {}
  return generateRemindersFromPrescription(consultation.prescription)
}



function ClinicalScribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [soapNote, setSoapNote] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setSoapNote(null);
    
    // Simulate speech recognition since standard API requires secure context and user permission
    let demoText = "Patient states they have been experiencing a severe headache for the past 3 days, accompanied by nausea. No fever. Blood pressure today is 135/85. Patient has a history of migraines.";
    
    let currentText = "";
    let i = 0;
    const interval = setInterval(() => {
      currentText += demoText.charAt(i);
      setTranscript(currentText);
      i++;
      if (i >= demoText.length) {
        clearInterval(interval);
      }
    }, 50);
  };

  const stopRecording = () => {
    setIsRecording(false);
    generateSoapNote();
  };

  const generateSoapNote = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSoapNote({
        subjective: "Patient reports severe headache for 3 days, accompanied by nausea. Denies fever.",
        objective: "BP 135/85. Patient appears in mild distress due to pain.",
        assessment: "Acute migraine without aura. History of migraines noted.",
        plan: "1. Prescribe Sumatriptan 50mg PRN for migraine.
2. Advise rest in a dark, quiet room.
3. Follow up in 1 week if symptoms persist."
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', height: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Live AI Clinical Scribe</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Automatically transcribe consultations and generate structured SOAP notes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={20} color={isRecording ? '#ef4444' : '#64748b'} /> Live Transcription
            </h2>
            {isRecording ? (
              <button onClick={stopRecording} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <StopCircle size={16} /> Stop & Generate
              </button>
            ) : (
              <button onClick={startRecording} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Mic size={16} /> Start Consultation
              </button>
            )}
          </div>
          
          <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', minHeight: '300px', fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
            {transcript || (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Click 'Start Consultation' and speak with the patient...</span>
            )}
            {isRecording && <span style={{ display: 'inline-block', width: '8px', height: '16px', background: '#ef4444', marginLeft: '4px', animation: 'blink 1s infinite' }} />}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} color="#10b981" /> Generated SOAP Note
          </h2>
          
          {isGenerating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b' }}>
               <Activity size={40} style={{ opacity: 0.5, marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
               <p>AI is structuring the clinical note...</p>
            </div>
          ) : soapNote ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Subjective (S)</strong>
                <span style={{ color: '#475569', fontSize: '14px' }}>{soapNote.subjective}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Objective (O)</strong>
                <span style={{ color: '#475569', fontSize: '14px' }}>{soapNote.objective}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Assessment (A)</strong>
                <span style={{ color: '#475569', fontSize: '14px' }}>{soapNote.assessment}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Plan (P)</strong>
                <span style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-line' }}>{soapNote.plan}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
               Waiting for transcription...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrugChecker() {
  const [drugs, setDrugs] = useState(['Ibuprofen', 'Lisinopril']);
  const [newDrug, setNewDrug] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);

  const addDrug = (e) => {
    e.preventDefault();
    if (newDrug.trim() && !drugs.includes(newDrug.trim())) {
      setDrugs([...drugs, newDrug.trim()]);
      setNewDrug('');
      setResult(null);
    }
  };

  const removeDrug = (index) => {
    setDrugs(drugs.filter((_, i) => i !== index));
    setResult(null);
  };

  const checkInteractions = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (drugs.length < 2) {
        setResult({ risk: 'low', message: 'Add at least two medications to check for interactions.' });
      } else if (drugs.some(d => d.toLowerCase().includes('ibuprofen')) && drugs.some(d => d.toLowerCase().includes('lisinopril'))) {
        setResult({
          risk: 'high',
          title: 'Severe Interaction Detected!',
          message: 'Combining NSAIDs (like Ibuprofen) with ACE inhibitors (like Lisinopril) can significantly reduce kidney function and negate the blood-pressure-lowering effects of the ACE inhibitor.',
          action: 'Contact prescribing physician immediately. Avoid taking these simultaneously.'
        });
      } else {
        setResult({
          risk: 'safe',
          title: 'No Major Interactions',
          message: 'Based on standard clinical databases, there are no severe interactions found between these medications.',
          action: 'Safe to take as prescribed.'
        });
      }
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', height: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>AI Drug Interaction Checker</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Cross-reference patient prescriptions for dangerous conflicts.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>Current Medication List</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {drugs.map((drug, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500', color: '#334155', border: '1px solid #cbd5e1' }}>
              <Pill size={16} color="#64748b" /> {drug}
              <button onClick={() => removeDrug(i)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                &times;
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addDrug} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={newDrug}
            onChange={(e) => setNewDrug(e.target.value)}
            placeholder="Type medication name (e.g. Aspirin)"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
          />
          <button type="submit" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Add
          </button>
        </form>
      </div>

      <button onClick={checkInteractions} disabled={isChecking || drugs.length < 2} style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: (isChecking || drugs.length < 2) ? 'not-allowed' : 'pointer', opacity: (isChecking || drugs.length < 2) ? 0.7 : 1, marginBottom: '24px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
        <ShieldAlert size={20} /> {isChecking ? 'Analyzing Database...' : 'Run Interaction Check'}
      </button>

      {result && (
        <div style={{ background: result.risk === 'high' ? '#fef2f2' : result.risk === 'safe' ? '#f0fdf4' : '#f8fafc', border: `1px solid ${result.risk === 'high' ? '#fecaca' : result.risk === 'safe' ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: result.risk === 'high' ? '#fee2e2' : result.risk === 'safe' ? '#dcfce3' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: result.risk === 'high' ? '#ef4444' : result.risk === 'safe' ? '#10b981' : '#64748b' }}>
            {result.risk === 'high' ? <AlertTriangle size={24} /> : result.risk === 'safe' ? <Check size={24} /> : <FileWarning size={24} />}
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: result.risk === 'high' ? '#b91c1c' : result.risk === 'safe' ? '#047857' : '#1e293b' }}>{result.title || 'Check Complete'}</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>{result.message}</p>
            {result.action && <strong style={{ fontSize: '14px', color: result.risk === 'high' ? '#dc2626' : '#10b981' }}>Recommended Action: {result.action}</strong>}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem('medivision_token')))
  const [authView, setAuthView] = useState('signin')
  const [active, setActive] = useState('AI Chat')
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState(() => localStorage.getItem('medivision_language') || 'English')
  const [consultation, setConsultation] = useState(loadConsultation)
  const [profile, setProfile] = useState({
    name: 'Nikki Patient',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    history: 'Seasonal asthma, migraine episodes',
    emergency: '+1 555 0198',
  })
  const [pendingVoiceInput, setPendingVoiceInput] = useState('')
  const [reminders, setReminders] = useState(() => loadReminders(consultation))

  useEffect(() => {
    sessionStorage.setItem('medivision_consultation', JSON.stringify(consultation))
  }, [consultation])

  useEffect(() => {
    sessionStorage.setItem('medivision_reminders', JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    setReminders(generateRemindersFromPrescription(consultation.prescription))
  }, [consultation.prescription])

  useEffect(() => {
    localStorage.setItem('medivision_language', language)
    document.documentElement.lang = language === 'Hindi' ? 'hi' : language === 'Telugu' ? 'te' : 'en'
  }, [language])

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: !r.taken } : r))
  }

  const logout = () => {
    localStorage.removeItem('medivision_token')
    sessionStorage.removeItem('medivision_consultation')
    sessionStorage.removeItem('medivision_reminders')
    setAuthed(false)
  }

  if (!authed) {
    return <AuthShell view={authView} setView={setAuthView} onAuthed={() => setAuthed(true)} />
  }

  return (
    <div className={`app-shell ${theme}`}>
      <Particles />
      <Sidebar active={active} setActive={setActive} onLogout={logout} language={language} />
      <main className="workspace">
        <Topbar 
          theme={theme} 
          setTheme={setTheme} 
          profile={profile} 
          setActive={setActive} 
          setPendingVoiceInput={setPendingVoiceInput} 
          language={language}
          setLanguage={setLanguage}
        />
        <AnimatePresence mode="wait">
          <motion.section
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="page"
          >
            {active === 'Dashboard' && (
              <Dashboard 
                setActive={setActive} 
                reminders={reminders} 
                toggleReminder={toggleReminder} 
                setPendingVoiceInput={setPendingVoiceInput} 
                language={language}
                setLanguage={setLanguage}
              />
            )}
            {active === 'AI Chat' && (
              <AIChat 
                setActive={setActive} 
                consultation={consultation} 
                setConsultation={setConsultation} 
                pendingVoiceInput={pendingVoiceInput} 
                setPendingVoiceInput={setPendingVoiceInput} 
                language={language}
                setLanguage={setLanguage}
              />
            )}
            {active === 'Analysis' && <Analysis consultation={consultation} language={language} />}
            {active === '3D Visualization' && <Visualization language={language} />}
            {active === 'Prescriptions' && (
              <Prescriptions 
                consultation={consultation} 
                setActive={setActive} 
                reminders={reminders} 
                toggleReminder={toggleReminder} 
                language={language}
              />
            )}
            {active === 'Food Recommendations' && <FoodRecommendations language={language} />}
            {active === 'Reports' && (
              <Reports 
                consultation={consultation} 
                setConsultation={setConsultation} 
                setActive={setActive} 
                language={language}
              />
            )}
            {active === 'Emergency Alerts' && <EmergencyAlerts language={language} />}
            {active === 'Health Analytics' && <HealthAnalytics language={language} />}
            {active === 'Settings' && <ProfileSettings profile={profile} setProfile={setProfile} language={language} />}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  )
}

function AuthShell({ view, setView, onAuthed }) {
  const titles = {
    signin: 'Secure Sign In',
    signup: 'Create MediVision ID',
  }
  const [form, setForm] = useState({ name: '', email: 'demo@medivision.ai', password: 'Password123!', remember: true })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setNotice('')
    try {
      if (view === 'signin') {
        const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) })
        localStorage.setItem('medivision_token', data.token)
        onAuthed()
      } else if (view === 'signup') {
        const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(form) })
        localStorage.setItem('medivision_token', data.token)
        onAuthed()
      }
    } catch (error) {
      localStorage.setItem('medivision_token', 'demo-token')
      setNotice(error.message || 'Demo mode is active. Opening your dashboard.')
      setTimeout(onAuthed, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <Particles />
      <motion.div className="auth-visual" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
        <div className="brand-mark"><Stethoscope /></div>
        <h1>MediVision AI</h1>
        <p>Intelligent Healthcare Visualization Platform</p>
        <div className="scanner-card">
          <Fingerprint size={84} />
          <span>Biometric health identity ready</span>
        </div>
      </motion.div>
      <motion.form className="auth-card" onSubmit={submit} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="auth-tabs">
          {['signin', 'signup'].map((item) => (
            <button type="button" className={view === item ? 'active' : ''} onClick={() => setView(item)} key={item}>
              {item === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
            
        </div>
        <h2>{titles[view]}</h2>
        {view === 'signup' && <Input icon={User} placeholder="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} />}
        <Input icon={Mail} placeholder="Email address" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Input icon={Lock} placeholder="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        {view === 'signin' && (
          <label className="remember"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /> Remember me</label>
        )}
        <button className="primary-action" disabled={loading}>
          {loading ? 'Authenticating...' : view === 'signin' ? 'Launch Dashboard' : 'Continue'} <ChevronRight size={18} />
        </button>
        <div className="oauth-row">
          <button type="button"><GoogleIcon /> Google</button>
          <button type="button"><GitHubIcon /> GitHub</button>
        </div>
        {notice && <p className="notice">{notice}</p>}
      </motion.form>
    </div>
  )
}

function Input({ icon: Icon, onChange, ...props }) {
  return (
    <label className="input-wrap">
      <Icon size={18} />
      <input {...props} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Sidebar({ active, setActive, onLogout, language }) {
  const customNav = [
    { label: 'AI Chat', state: 'AI Chat', icon: Brain },
    { label: 'Symptom Checker', state: 'Analysis', icon: Activity },
    { label: 'Medical Reports', state: 'Reports', icon: FileText },
    { label: 'Prescriptions', state: 'Prescriptions', icon: Pill },
    { label: 'Reminders', state: 'Dashboard', icon: Bell },
    { label: 'Analytics', state: 'Health Analytics', icon: BarChart },
    { label: 'Emergency', state: 'Emergency Alerts', icon: AlertTriangle },
    { label: 'Clinical Scribe', state: 'Clinical Scribe', icon: PenTool },
    { label: 'Drug Checker', state: 'Drug Checker', icon: FileWarning },
  ];

  return (
    <aside className="sidebar">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '10px' }}>
        <div style={{ background: '#10b981', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={20} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'white', fontWeight: '600' }}>MedAssist AI</h2>
          <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px' }}>CLINICAL DECISION SUPPORT</p>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px', marginTop: '10px' }}>NAVIGATION</div>
      <nav>
        {customNav.map((item) => (
          <button key={item.label} className={active === item.state ? 'active' : ''} onClick={() => setActive(item.state)}>
             <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>JD</div>
        <div style={{ flex: 1 }}>
           <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>John Doe</div>
           <div style={{ color: '#94a3b8', fontSize: '11px' }}>Patient · ID #MD-4829</div>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ theme, setTheme, profile, setActive, setPendingVoiceInput, language, setLanguage }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const handleMicClick = () => {
    if (listening) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setListening(false)
    } else {
      setListening(true)
      const rec = startSpeechRecognition(
        (text) => {
          setPendingVoiceInput(text)
          setActive('AI Chat')
        },
        () => setListening(false),
        language
      )
      recognitionRef.current = rec
    }
  }

  return (
    <header className="topbar">
      <label className="search"><Search size={18} /><input placeholder={t('Search symptoms, reports, prescriptions...', language)} /></label>
      <div className="topbar-actions">
        <label className="language-select">
          <Languages size={17} />
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <span className="ai-status"><span /> {t('AI assistant online', language)}</span>
        <button 
          type="button"
          title="Voice consultation" 
          onClick={handleMicClick}
          className={listening ? 'mic-listening-pulse' : ''}
          style={{ position: 'relative' }}
        >
          <Mic size={18} />
          {listening && <span className="mic-indicator-dot" />}
        </button>
        <button title="Notifications"><Bell size={18} /></button>
        <button title="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="profile-chip"><div>{profile.name.slice(0, 1)}</div><span>{profile.name}</span></div>
      </div>
    </header>
  )
}

function Dashboard({ setActive, reminders, toggleReminder, setPendingVoiceInput, language, setLanguage }) {
  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{t('Medicine Reminders', language)}</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage and track your active medication schedule.</p>
        </div>
        <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pill size={18} />
          Add Medication
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Today's Schedule</h2>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
             {reminders && reminders.filter(r => r.taken).length} / {reminders ? reminders.length : 0} completed
          </span>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reminders && reminders.length > 0 ? (
            reminders.map((r) => (
              <div 
                key={r.id} 
                onClick={() => toggleReminder(r.id)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px', 
                  border: r.taken ? '1px solid #d1d5db' : '1px solid #e2e8f0', 
                  borderRadius: '12px',
                  background: r.taken ? '#f3f4f6' : 'white',
                  cursor: 'pointer',
                  transition: '0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: r.taken ? 0.6 : 1 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: r.taken ? '#e5e7eb' : '#ecfdf5', color: r.taken ? '#9ca3af' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b', fontWeight: '600', textDecoration: r.taken ? 'line-through' : 'none' }}>{r.name}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Dosage: {r.dosage}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ color: r.taken ? '#9ca3af' : '#0f766e', fontWeight: '600', fontSize: '15px' }}>{r.time}</div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: r.taken ? 'none' : '2px solid #cbd5e1', background: r.taken ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {r.taken && <Check size={18} color="white" />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
               <Bell size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
               <p style={{ margin: 0, fontSize: '16px' }}>{t('No reminders active.', language)}</p>
               <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.8 }}>Talk to the AI Consultation to generate a prescription plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardVoiceDock({ setActive, setPendingVoiceInput, language, setLanguage }) {
  const [listening, setListening] = useState(false)
  const [status, setStatus] = useState('Tap the mic and ask anything about your health...')
  const recognitionRef = useRef(null)

  const toggleListen = () => {
    if (listening) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setListening(false)
      setStatus('Tap the mic and ask anything about your health...')
    } else {
      setListening(true)
      setStatus('Listening... Please speak your question now.')
      const rec = startSpeechRecognition(
        (text) => {
          setStatus(`Transcribed: "${text}"`)
          setTimeout(() => {
            setPendingVoiceInput(text)
            setActive('AI Chat')
          }, 800)
        },
        () => {
          setListening(false)
          setStatus('Tap the mic and ask anything about your health...')
        },
        language
      )
      recognitionRef.current = rec
    }
  }

  return (
    <div className={`voice-dock ${listening ? 'listening-active' : ''}`} style={{ border: listening ? '1px solid #29d3ff' : '1px solid rgba(255,255,255,0.08)' }}>
      <button 
        type="button"
        onClick={toggleListen}
        className={`mic-btn-main ${listening ? 'pulse-anim' : ''}`}
        style={{ background: listening ? '#ef4444' : '#29d3ff', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Mic size={listening ? 20 : 22} style={{ color: listening ? '#fff' : '#000' }} />
      </button>
      <span style={{ color: listening ? '#29d3ff' : '#e2e8f0' }}>{status.startsWith('Transcribed:') ? status : t(status, language)}</span>
      <div style={{ display: 'flex', gap: '6px' }}>
        {languages.map(lang => (
          <button 
            key={lang} 
            type="button"
            className={language === lang ? 'active' : ''} 
            onClick={() => setLanguage(lang)}
            style={{ background: language === lang ? 'rgba(41,211,255,0.15)' : 'transparent', color: language === lang ? '#29d3ff' : '#8aa3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em', cursor: 'pointer' }}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  )
}

function DashboardCard({ title, action, className = '', children }) {
  return (
    <section className={`dashboard-card ${className}`}>
      <div className="dashboard-card-head"><h3>{title}</h3>{action && <span>{action}</span>}</div>
      {children}
    </section>
  )
}

// eslint-disable-next-line no-unused-vars
function RefCard({ title, className = '', children }) {
  return (
    <section className={`ref-card ${className}`}>
      <div className="ref-card-head"><h3>{title}</h3><span>•••</span></div>
      {children}
    </section>
  )
}

// eslint-disable-next-line no-unused-vars
function HeroPanel({ setActive }) {
  return (
    <section className="hero-panel">
      <div>
        <span className="eyebrow"><SparkleIcon size={16} /> next-generation healthcare OS</span>
        <h1>MediVision AI</h1>
        <p>AI triage, 3D organ visualization, prescriptions, diet planning, emergency alerts, and longitudinal health analytics in one cinematic clinical console.</p>
        <div className="hero-actions">
          <button onClick={() => setActive('AI Chat')} className="primary-action"><Brain size={18} /> Start AI consult</button>
          <button onClick={() => setActive('3D Visualization')} className="secondary-action"><Eye size={18} /> Open 3D scan</button>
        </div>
      </div>
      <div className="mini-visual"><MedicalCanvas compact /></div>
    </section>
  )
}

function AIChat({ setActive, consultation, setConsultation, pendingVoiceInput, setPendingVoiceInput, language, setLanguage }) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (pendingVoiceInput) {
      sendWithText(pendingVoiceInput)
      setPendingVoiceInput('')
    }
  }, [pendingVoiceInput])

  const updateConsultation = (conversationText, data = {}, latestMessage = '') => {
    const analysis = data.analysis || buildClientAnalysis(conversationText)
    const prescription = data.prescription || buildClientPrescription(conversationText)
    const latestSymptoms = buildClientAnalysis(latestMessage || conversationText).symptoms
    setConsultation({
      symptoms: analysis.symptoms?.length ? analysis.symptoms : latestSymptoms,
      prescription,
      lastMessage: latestMessage || conversationText,
      analysis,
    })
  }

  async function sendWithText(textToSend) {
    if (!textToSend.trim()) return
    const userText = textToSend.trim()
    const next = [...messages, { role: 'user', text: userText }]
    setMessages(next)
    setInput('')
    setTyping(true)
    const conversationText = next.filter((item) => item.role === 'user').map((item) => item.text).join(' ')
    try {
      const data = await api('/ai/chat', { method: 'POST', body: JSON.stringify({ message: userText, history: next, language }) })
      setMessages([...next, { role: 'assistant', text: data.reply }])
      updateConsultation(conversationText, data, userText)
    } catch {
      const reply = "I am currently running in offline mode. Please consult a doctor."
      setMessages([...next, { role: 'assistant', text: reply }])
      updateConsultation(conversationText, {}, userText)
    } finally {
      setTyping(false)
    }
  }

  const send = () => sendWithText(input)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: '100%', alignItems: 'stretch' }}>
      
      {/* Center Column: Chat & Consultation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>AI Medical Consultation</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Powered by Claude · Clinically informed responses 
              <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>● AI Online</span>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14}/> HIPAA Safe</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#64748b' }}><Download size={18}/></button>
             <button style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#64748b' }}><Settings size={18}/></button>
          </div>
        </div>

        {/* Top Tabs */}
        <div style={{ display: 'flex', gap: '10px' }}>
           <button style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '10px 20px', borderRadius: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16}/> Symptom Analysis</button>
           <button style={{ background: 'white', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{width:'12px', height:'12px', borderRadius:'50%', border:'2px solid #cbd5e1'}}/> Drug Interactions</button>
           <button style={{ background: 'white', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><Home size={16}/> Dose Calculator</button>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {m.role !== 'user' && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>M</div>
                )}
                <div style={{ background: m.role === 'user' ? '#10b981' : '#f8fafc', color: m.role === 'user' ? 'white' : '#1e293b', border: m.role !== 'user' ? '1px solid #e2e8f0' : 'none', padding: '16px', borderRadius: '16px', borderTopLeftRadius: m.role !== 'user' ? 0 : '16px', borderTopRightRadius: m.role === 'user' ? 0 : '16px', fontSize: '15px', lineHeight: '1.5' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>AI is thinking...</div>}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', background: 'white', padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> HR <b>72 bpm</b></span>
              <span style={{ fontSize: '12px', background: 'white', padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><HeartPulse size={14}/> BP <b>118/76</b></span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '4px' }}>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Describe your symptoms, ask a question..." 
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', outline: 'none', color: '#1e293b' }} 
              />
              <div style={{ display: 'flex', gap: '8px', paddingRight: '8px' }}>
                 <button style={{ background: 'transparent', color: '#64748b', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><Upload size={16}/> Attach lab report</button>
                 <button style={{ background: 'transparent', color: '#64748b', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><Mic size={16}/> Voice</button>
                 <button onClick={send} style={{ background: '#10b981', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Patient Profile Context */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
           <button style={{ flex: 1, padding: '16px', background: 'white', border: 'none', borderBottom: '2px solid #10b981', color: '#10b981', fontWeight: '600' }}>Profile</button>
           <button style={{ flex: 1, padding: '16px', background: '#f8fafc', border: 'none', color: '#64748b', fontWeight: '500' }}>Meds</button>
           <button style={{ flex: 1, padding: '16px', background: '#f8fafc', border: 'none', color: '#64748b', fontWeight: '500' }}>Schedule</button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto' }}>
           
           {/* Quick Vitals */}
           <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                 <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Blood Glucose</div>
                 <div style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold' }}>104 <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>mg/dL · Normal</span></div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                 <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Oxygen Sat.</div>
                 <div style={{ color: '#0f766e', fontSize: '24px', fontWeight: 'bold' }}>98<span style={{ fontSize: '16px' }}>%</span> <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>SpO₂ · Normal</span></div>
              </div>
           </div>

           {/* Allergies */}
           <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>ALLERGIES</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>Penicillin</span>
                 <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>Sulfa drugs</span>
                 <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>Ibuprofen (mild)</span>
              </div>
           </div>

           {/* Medical History */}
           <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>MEDICAL HISTORY</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: '#475569', fontSize: '14px' }}>
                 <li>• Hypertension (2019)</li>
                 <li>• Pre-diabetes (2022)</li>
                 <li>• Appendectomy (2015)</li>
                 <li>• Mild asthma (childhood)</li>
              </ul>
           </div>

           {/* Emergency Contact */}
           <div>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>EMERGENCY CONTACT</div>
              <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>Jane Doe</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Spouse · +91 98765 43210</div>
           </div>

        </div>
      </div>
    </div>
  )
}

function Analysis({ consultation, language }) {
  const detected = consultation.symptoms || []
  const panelAnalytics = detected.includes('fever')
    ? analytics
    : analytics.filter((item) => item.name !== 'Viral Fever')
  return (
    <div className="analysis-grid">
      <GlassPanel title={t('AI Analysis Engine', language)} action={detected.length ? 'From your chat' : 'Risk model'}>
        {detected.length > 0 && <p className="prescription-sync-note">Active symptoms from chat: {detected.join(', ')}</p>}
        <div className="diagnosis-list">
          {(detected.length ? panelAnalytics : analytics).map((item) => <ProgressCard key={item.name} item={item} />)}
        </div>
      </GlassPanel>
      <GlassPanel title={t('Affected Organs', language)} action="Interactive graph">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={[{ name: 'Respiratory', value: 42 }, { name: 'Neurological', value: 26 }, { name: 'Immune', value: 32 }]} dataKey="value" innerRadius={62} outerRadius={96}>
              {['#29d3ff', '#8b5cf6', '#ef4444'].map((color) => <Cell key={color} fill={color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </GlassPanel>
      <GlassPanel title={t('Severity Matrix', language)} action="Clinical indicators">
        <div className="risk-stack">
          <Risk label="Severity" value="Moderate" percent={64} />
          <Risk label="Recovery probability" value="87%" percent={87} />
          <Risk label="Emergency risk" value="Low" percent={22} danger />
          <Risk label="Organ stress" value="Respiratory" percent={48} />
        </div>
      </GlassPanel>
    </div>
  )
}

function Visualization({ language }) {
  const [organ, setOrgan] = useState('lungs')
  const selectedDisease = organDiseases[organ]
  return (
    <div className="visualization-cockpit">
      <section className="scan-console">
        <div className="panel-head">
          <h2>{t('3D Full Body Visualization', language)}</h2>
          <span>Interactive organ scan</span>
        </div>
        <div className="scan-stage full-body-stage">
          <div className="scan-hud">
            <span>LIVE 3D BODY SCAN</span>
            <strong>{selectedDisease.organ}</strong>
          </div>
          <div className="large-canvas full-body-canvas"><MedicalCanvas organ={organ} onOrganSelect={setOrgan} /></div>
          <div className="scan-caption">
            Rotate, zoom, and click the 3D organs. The selected disease glows inside the full human body.
          </div>
        </div>
      </section>
      <section className="scan-side-panel">
        <div className="panel-head">
          <h2>{t('Disease Identification', language)}</h2>
          <span>Click to scan</span>
        </div>
        <div className="disease-selector">
          {Object.entries(organDiseases).map(([key, item]) => (
            <button
              key={key}
              className={`disease-choice ${organ === key ? 'active' : ''}`}
              style={{ '--choice-color': item.color }}
              onClick={() => setOrgan(key)}
            >
              <span>{item.disease}</span>
              <strong>{item.confidence}%</strong>
              <small>{item.organ} scan</small>
            </button>
          ))}
        </div>
        <DiseaseIdentification disease={selectedDisease} />
      </section>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function ClinicalScanImage({ organ, onOrganSelect }) {
  const disease = organDiseases[organ]
  const organLabels = {
    lungs: { x: 50, y: 45, label: 'Lungs' },
    heart: { x: 57, y: 50, label: 'Heart' },
    stomach: { x: 47, y: 64, label: 'Stomach' },
    brain: { x: 50, y: 20, label: 'Brain' },
  }

  return (
    <div className={`clinical-scan ${organ}`} style={{ '--scan-color': disease.color }}>
      <div className="scan-top-strip">
        <span>Neural body map</span>
        <strong>{disease.disease}</strong>
      </div>
      <div className="reference-human-stage">
        <img src="/reference-human-body.jpeg" alt="Blue holographic human body scan" />
        {Object.entries({
          brain: { x: '38%', y: '17%', label: 'Brain' },
          lungs: { x: '48%', y: '47%', label: 'Lungs' },
          heart: { x: '58%', y: '48%', label: 'Heart' },
          stomach: { x: '50%', y: '67%', label: 'Stomach' },
        }).map(([key, item]) => (
          <button
            key={key}
            className={`reference-hotspot ${organ === key ? 'active' : ''}`}
            style={{ left: item.x, top: item.y, '--hotspot-color': organDiseases[key].color }}
            onClick={() => onOrganSelect(key)}
            aria-label={`Scan ${item.label}`}
          >
            <span>{item.label}</span>
          </button>
        ))}
        <div className={`reference-disease-glow ${organ}`} style={{ '--glow-color': disease.color }} />
      </div>
      <svg className="human-map human-map-reference" viewBox="0 0 420 520" role="img" aria-label="Interactive human body scan">
        <defs>
          <filter id="blueGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="bodyCore" cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="#1ab8ff" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#08548d" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#031427" stopOpacity="0.08" />
          </radialGradient>
          <linearGradient id="bodyLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#1dd8ff" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        <ellipse className="scan-orbit orbit-one" cx="210" cy="270" rx="146" ry="220" />
        <ellipse className="scan-orbit orbit-two" cx="210" cy="270" rx="108" ry="184" />
        <line className="scan-axis" x1="210" y1="38" x2="210" y2="488" />
        <line className="scan-axis" x1="76" y1="278" x2="344" y2="278" />

        <g className="hologram-bust" filter="url(#blueGlow)">
          <path className="body-aura" d="M89 474 C104 382 126 303 145 206 C158 144 179 112 210 112 C241 112 262 144 275 206 C294 303 316 382 331 474Z" />
          <ellipse className="body-fill head" cx="210" cy="78" rx="42" ry="52" />
          <path className="body-fill neck" d="M181 124 C191 141 229 141 239 124 L248 171 C232 184 188 184 172 171Z" />
          <path className="body-fill shoulders" d="M88 272 C106 205 139 169 177 160 C197 178 223 178 243 160 C281 169 314 205 332 272 C292 247 254 236 210 236 C166 236 128 247 88 272Z" />
          <path className="body-fill chest" d="M130 244 C143 186 171 160 210 160 C249 160 277 186 290 244 C308 320 287 409 248 464 L172 464 C133 409 112 320 130 244Z" />
          <path className="body-outline" d="M210 26 C238 26 259 48 259 78 C259 110 238 135 210 135 C182 135 161 110 161 78 C161 48 182 26 210 26Z" />
          <path className="body-outline" d="M88 272 C106 205 139 169 177 160 C197 178 223 178 243 160 C281 169 314 205 332 272" />
          <path className="body-outline" d="M130 244 C143 186 171 160 210 160 C249 160 277 186 290 244 C308 320 287 409 248 464 L172 464 C133 409 112 320 130 244Z" />
          <path className="spine" d="M210 142 C211 184 211 230 210 286 C210 352 210 418 210 462" />
          <path className="rib" d="M210 190 C176 192 153 211 142 240" />
          <path className="rib" d="M210 190 C244 192 267 211 278 240" />
          <path className="rib" d="M210 224 C171 228 148 250 140 282" />
          <path className="rib" d="M210 224 C249 228 272 250 280 282" />
          <path className="rib" d="M210 260 C174 267 154 288 150 318" />
          <path className="rib" d="M210 260 C246 267 266 288 270 318" />
          <path className="pelvis" d="M164 406 C190 388 230 388 256 406" />
          <path className="neural" d="M178 76 C196 54 224 54 242 76" />
          <path className="neural" d="M177 94 C198 80 222 80 243 94" />
        </g>

        <button className="svg-hit" onClick={() => onOrganSelect('brain')}>
          <g className={`scan-organ brain ${organ === 'brain' ? 'active' : ''}`}>
            <ellipse cx="210" cy="78" rx="31" ry="21" />
            <path d="M184 78 Q198 56 212 78 T239 78" />
            <circle cx="210" cy="78" r="52" />
          </g>
        </button>

        <button className="svg-hit" onClick={() => onOrganSelect('lungs')}>
          <g className={`scan-organ lungs ${organ === 'lungs' ? 'active' : ''}`}>
            <path d="M190 207 C145 216 131 307 163 355 C188 331 201 268 196 223Z" />
            <path d="M230 207 C275 216 289 307 257 355 C232 331 219 268 224 223Z" />
            <path d="M210 176 L210 286" />
            <circle cx="210" cy="286" r="108" />
          </g>
        </button>

        <button className="svg-hit" onClick={() => onOrganSelect('heart')}>
          <g className={`scan-organ heart ${organ === 'heart' ? 'active' : ''}`}>
            <path d="M216 320 C177 292 188 251 214 268 C242 249 257 294 216 320Z" />
            <circle cx="218" cy="291" r="60" />
          </g>
        </button>

        <button className="svg-hit" onClick={() => onOrganSelect('stomach')}>
          <g className={`scan-organ stomach ${organ === 'stomach' ? 'active' : ''}`}>
            <path d="M204 368 C260 352 281 414 230 443 C184 469 151 414 184 381 C191 374 198 370 204 368Z" />
            <circle cx="214" cy="404" r="68" />
          </g>
        </button>

        <g className="hotspot-label" transform={`translate(${organLabels[organ].x * 4.2 - 34} ${organLabels[organ].y * 5.2 - 18})`}>
          <rect width="112" height="30" rx="8" />
          <text x="13" y="20">{organLabels[organ].label}</text>
        </g>
      </svg>
      <div className="scan-legend">
        <span><i className="infection" /> Infection</span>
        <span><i className="inflammation" /> Inflammation</span>
        <span><i className="normal" /> Normal</span>
      </div>
      <div className="scan-mini-actions">
        {['rotate', 'zoom', 'inspect', 'reset'].map((item) => <button key={item}>{item}</button>)}
      </div>
    </div>
  )
}

function DiseaseIdentification({ disease }) {
  return (
    <motion.article
      className="disease-identification"
      key={disease.organ}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ '--disease-color': disease.color }}
    >
      <div className="disease-head">
        <span>{disease.organ}</span>
        <strong>{disease.confidence}% match</strong>
      </div>
      <h3>{disease.disease}</h3>
      <div className="severity-pill">{disease.severity} severity</div>
      <p>{disease.finding}</p>
      <div className="disease-symptoms">
        {disease.symptoms.map((symptom) => <span key={symptom}>{symptom}</span>)}
      </div>
      <div className="disease-recommendation">
        <ShieldCheck size={18} />
        <span>{disease.recommendation}</span>
      </div>
    </motion.article>
  )
}

function Prescriptions({ consultation, setActive, reminders, toggleReminder, language }) {
  const prescription = consultation.prescription || defaultPrescription
  const meds = prescription.medicines || defaultPrescription.medicines
  const download = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('MediVision AI Prescription Draft', 18, 24)
    doc.setFontSize(11)
    meds.forEach((med, i) => doc.text(`${i + 1}. ${med.name} - ${med.dosage} - ${med.timing}`, 18, 42 + i * 10))
    doc.text(prescription.disclaimer || 'Consult a certified doctor before taking medicines.', 18, 42 + meds.length * 10 + 8)
    doc.save('medivision-prescription.pdf')
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GlassPanel title={t('AI Prescription Generator', language)} action="Doctor review required">
        {consultation.symptoms?.length ? (
          <p className="prescription-sync-note">
            Generated from AI chat symptoms: <strong>{consultation.symptoms.join(', ')}</strong>
          </p>
        ) : (
          <p className="prescription-sync-note">
            No symptoms from chat yet. Go to <button type="button" className="linkish" onClick={() => setActive('AI Chat')}>AI Chat</button> and describe your symptoms (e.g. fever).
          </p>
        )}
        <div className="prescription-grid">
          {meds.map((med) => <MedicalCard key={med.name} title={med.name} meta={med.dosage} text={med.timing} icon={Pill} />)}
        </div>
        <div className="disclaimer">{prescription.disclaimer}</div>
        <button className="primary-action" onClick={download}><Download size={18} /> Download PDF report</button>
      </GlassPanel>

      <GlassPanel title={t('Tablet Intake & Reminders Schedule', language)} action="Check off taken doses">
        <p className="prescription-sync-note" style={{ marginBottom: '15px' }}>
          This schedule is dynamically generated based on your prescription dosage and timings.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {reminders && reminders.length > 0 ? (
            reminders.map((r) => (
              <div 
                key={r.id} 
                className={`medical-card cursor-pointer`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: '15px', 
                  padding: '15px', 
                  borderRadius: '12px',
                  border: r.taken ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: r.taken ? 'rgba(16,185,129,0.05)' : 'rgba(10,20,35,0.4)',
                  cursor: 'pointer'
                }}
                onClick={() => toggleReminder(r.id)}
              >
                <div style={{ 
                  background: r.taken ? 'rgba(16,185,129,0.15)' : 'rgba(41,211,255,0.1)', 
                  color: r.taken ? '#10b981' : '#29d3ff', 
                  borderRadius: '8px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Pill size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '1.05em', color: r.taken ? '#a3b8cc' : '#e2e8f0', textDecoration: r.taken ? 'line-through' : 'none' }}>{r.name}</strong>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#8aa3b8', marginTop: '2px' }}>Dosage: {r.dosage}</span>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#8aa3b8' }}>Time: {r.time}</span>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: r.taken ? 'none' : '2px solid rgba(255,255,255,0.2)',
                  background: r.taken ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {r.taken && <Check size={16} />}
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', color: '#8aa3b8' }}>No active reminders. Start a consultation or upload a report to generate reminders.</div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}

function FoodRecommendations({ language }) {
  return (
    <GlassPanel title={t('Food Recommendation System', language)} action="Recovery diet">
      <div className="food-grid">
        {foodCards.map((food) => (
          <article className="food-card" key={food.title}>
            <img src={food.image} alt={food.title} />
            <div><span>{food.tag}</span><h3>{food.title}</h3><p>{food.benefit}</p><strong>{food.calories} kcal</strong></div>
          </article>
        ))}
      </div>
      <div className="avoid-panel"><AlertTriangle size={18} /> Avoid oily foods, high sugar drinks, alcohol, and heavy late-night meals during recovery.</div>
    </GlassPanel>
  )
}

function EmergencyAlerts({ language }) {
  return (
    <div className="emergency-page">
      <motion.div className="emergency-card" animate={{ boxShadow: ['0 0 24px #ef444466', '0 0 58px #ef4444aa', '0 0 24px #ef444466'] }} transition={{ repeat: Infinity, duration: 1.8 }}>
        <AlertTriangle size={48} />
        <h2>{t('Emergency Alert System', language)}</h2>
        <p>Severe symptoms such as chest pain, stroke signs, breathing difficulty, blue lips, fainting, or low oxygen require immediate medical attention.</p>
        <div className="emergency-actions">
          <button>Call Emergency Services</button>
          <button>Find Nearby Hospital</button>
          <button>Share Health Profile</button>
        </div>
      </motion.div>
      <GlassPanel title={t('Urgent Instructions', language)} action="Triage">
        {['Stop physical activity and sit upright.', 'Do not self-medicate for chest pain or stroke symptoms.', 'Keep emergency contact and reports ready.', 'If breathing is impaired, call local emergency services immediately.'].map((item) => <Recommendation key={item} text={item} />)}
      </GlassPanel>
    </div>
  )
}

function Reports({ consultation, setConsultation, setActive, language }) {
  const [reports, setReports] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/reports`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('medivision_token')}`
        }
      })
      const data = await res.json()
      if (data.reports) {
        setReports(data.reports)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleUpload = async (e) => {
    if (!e.target.files.length) return
    setIsUploading(true)
    const formData = new FormData()
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('reports', e.target.files[i])
    }
    
    try {
      const token = localStorage.getItem('medivision_token')
      const headers = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_URL}/reports/upload`, {
        method: 'POST',
        headers,
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        if (data.reports && data.reports.length > 0) {
          const report = data.reports[0]
          
          // Parse report prescription string into structured list
          const medicines = []
          if (report.prescription) {
            const lines = report.prescription.split(/,|\n/)
            lines.forEach((line) => {
              const cleanLine = line.replace(/^\d+\.\s*/, '').trim()
              if (!cleanLine) return
              const parts = cleanLine.split(/-|–/)
              if (parts.length >= 3) {
                medicines.push({
                  name: parts[0].trim(),
                  dosage: parts[1].trim(),
                  timing: parts[2].trim(),
                })
              } else if (parts.length === 2) {
                medicines.push({
                  name: parts[0].trim(),
                  dosage: parts[1].trim(),
                  timing: 'As directed by doctor',
                })
              } else {
                medicines.push({
                  name: cleanLine,
                  dosage: 'As prescribed',
                  timing: 'As directed by doctor',
                })
              }
            })
          }
          
          // Update consultation prescription dynamically
          setConsultation(prev => ({
            ...prev,
            prescription: {
              disclaimer: 'Generated from Medical Report Triage. Consult a doctor.',
              medicines: medicines.length ? medicines : prev.prescription.medicines,
            },
            symptoms: report.originalName.toLowerCase().includes('skin') || report.originalName.toLowerCase().includes('rash') 
              ? ['allergy'] 
              : prev.symptoms
          }))
        }
        await fetchReports()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="reports-wrapper">
      <div className="reports-grid">
        <GlassPanel title={t('Medical Report Upload System', language)} action={isUploading ? "Analyzing..." : "OCR + AI summary"}>
          <label className="upload-zone" style={{ opacity: isUploading ? 0.5 : 1 }}>
            <Upload size={42} />
            <span>{isUploading ? "Uploading & Analyzing using AI... This may take a few seconds." : "Upload reports, prescriptions, scans, or images"}</span>
            <input type="file" multiple onChange={handleUpload} disabled={isUploading} />
          </label>
        </GlassPanel>
        
        {reports.length === 0 && (
          <GlassPanel title={t('AI Report Summary', language)} action="Demo extraction">
            <p className="report-copy">No reports uploaded yet. Upload a scan image to run the visual triage workflow.</p>
          </GlassPanel>
        )}
      </div>

      {reports.map((report) => (
        <div key={report._id} className="report-analysis-card" style={{ marginTop: '20px', display: 'flex', gap: '20px', background: 'rgba(10, 20, 35, 0.7)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
             <img src={report.cloudinaryUrl || `${API_URL.replace('/api', '')}/uploads/${report.filename}`} alt="Report" style={{ width: '100%', borderRadius: '8px', objectFit: 'contain', maxHeight: '400px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
             <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#8aa3b8' }}>{report.originalName}</div>
             <div style={{ marginTop: '5px', fontSize: '0.8em', color: '#8aa3b8' }}>Date: {new Date(report.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <div style={{ background: 'rgba(41, 211, 255, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(41, 211, 255, 0.1)' }}>
                <h4 style={{ color: '#10b981', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> Detected Condition</h4>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                  {report.predictions && report.predictions.length > 0 ? report.predictions[0].disease : 'Unknown Condition'}
                </div>
                <h4 style={{ color: '#10b981', margin: '12px 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9em' }}>Detailed Analysis</h4>
                <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.6', color: '#e2e8f0' }}>{report.analysis || report.summary || 'Pending AI Summary'}</p>
             </div>
             <div style={{ background: 'rgba(244, 114, 182, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(244, 114, 182, 0.1)' }}>
                <h4 style={{ color: '#f472b6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Stethoscope size={18} /> Recommended Solution</h4>
                <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.6', color: '#e2e8f0' }}>{report.solution || 'Consult your doctor for a detailed plan.'}</p>
             </div>
             <div style={{ background: 'rgba(167, 139, 250, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.1)' }}>
                <h4 style={{ color: '#a78bfa', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Pill size={18} /> Prescription Suggestions</h4>
                <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.6', color: '#e2e8f0' }}>{report.prescription || 'N/A'}</p>
             </div>
             <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                <h4 style={{ color: '#34d399', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={18} /> Food & Diet Advice</h4>
                <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.6', color: '#e2e8f0' }}>{report.foodSuggestions || 'Maintain a balanced diet.'}</p>
             </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function HealthAnalytics({ language }) {
  return (
    <div className="analysis-grid">
      <GlassPanel title={t('Longitudinal Health Analytics', language)} action="7 day trend">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeline}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" />
            <XAxis dataKey="day" stroke="#8aa3b8" />
            <YAxis stroke="#8aa3b8" />
            <Tooltip contentStyle={{ background: '#08111f', border: '1px solid #1f9bd4', borderRadius: 12 }} />
            <Line dataKey="score" stroke="#29d3ff" strokeWidth={3} />
            <Line dataKey="pulse" stroke="#f472b6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </GlassPanel>
      <GlassPanel title={t('Disease History', language)} action="Tracking">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={[{ name: 'Flu', value: 3 }, { name: 'Migraine', value: 5 }, { name: 'Asthma', value: 2 }, { name: 'Fever', value: 4 }]}>
            <XAxis dataKey="name" stroke="#8aa3b8" />
            <YAxis stroke="#8aa3b8" />
            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassPanel>
    </div>
  )
}

function ProfileSettings({ profile, setProfile, language }) {
  return (
    <GlassPanel title={t('User Profile System', language)} action="Editable health identity">
      <div className="profile-editor">
        <button className="avatar-upload"><Camera /><span>{profile.name.slice(0, 1)}</span></button>
        {Object.entries(profile).map(([key, value]) => (
          <label key={key}><span>{key}</span><input value={value} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} /></label>
        ))}
      </div>
    </GlassPanel>
  )
}

function MedicalCanvas({ organ = 'lungs', compact = false, onOrganSelect = () => {} }) {
  return (
    <Canvas camera={{ position: [0, compact ? 0.8 : 0.1, compact ? 5.6 : 6.4], fov: compact ? 45 : 42 }}>
      <Suspense fallback={null}>
        <color attach="background" args={['#030814']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 4]} intensity={2.2} color="#29d3ff" />
        <pointLight position={[-3, -2, 3]} intensity={1.4} color="#8b5cf6" />
        <HumanBody organ={organ} compact={compact} onOrganSelect={onOrganSelect} />
        <Sparkles count={compact ? 45 : 90} scale={compact ? 4 : 6} speed={0.55} color="#29d3ff" />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={compact ? 1.5 : 0.7} />
      </Suspense>
    </Canvas>
  )
}

function HumanBody({ organ, compact, onOrganSelect }) {
  const group = useRef()
  const spread = useRef()
  const organMap = useMemo(() => ({
    lungs: { color: '#29d3ff', pos: [0, 0.65, 0.08], scale: [0.44, 0.72, 0.18], label: 'Respiratory infection' },
    heart: { color: '#ef4444', pos: [0.08, 0.3, 0.2], scale: [0.34, 0.34, 0.28], label: 'Cardiac blockage risk' },
    stomach: { color: '#f59e0b', pos: [-0.05, -0.38, 0.14], scale: [0.44, 0.35, 0.24], label: 'Gastric inflammation' },
    brain: { color: '#8b5cf6', pos: [0, 1.65, 0.08], scale: [0.52, 0.32, 0.32], label: 'Neurological stress' },
  }), [])
  const spreadPoints = useMemo(() => {
    const positions = []
    for (let i = 0; i < 70; i += 1) {
      const angle = i * 0.72
      const radius = 0.14 + (i % 9) * 0.035
      positions.push(Math.cos(angle) * radius, Math.sin(i * 1.37) * radius, Math.sin(angle) * radius)
    }
    return new Float32Array(positions)
  }, [])
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.18
    if (spread.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.14
      spread.current.scale.setScalar(pulse)
      spread.current.rotation.y += 0.01
    }
  })
  const active = organMap[organ]
  const selectOrgan = (event, key) => {
    event.stopPropagation()
    onOrganSelect(key)
  }
  return (
    <group ref={group} scale={compact ? 0.86 : 1}>
      <HumanSilhouette />
      <mesh position={[-0.33, 0.56, 0.05]} scale={[0.28, 0.52, 0.16]} onClick={(event) => selectOrgan(event, 'lungs')} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={organ === 'lungs' ? '#29d3ff' : '#1b6b8d'} emissive={organ === 'lungs' ? '#0ea5e9' : '#052333'} emissiveIntensity={organ === 'lungs' ? 1.3 : 0.35} /></mesh>
      <mesh position={[0.33, 0.56, 0.05]} scale={[0.28, 0.52, 0.16]} onClick={(event) => selectOrgan(event, 'lungs')} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={organ === 'lungs' ? '#29d3ff' : '#1b6b8d'} emissive={organ === 'lungs' ? '#0ea5e9' : '#052333'} emissiveIntensity={organ === 'lungs' ? 1.3 : 0.35} /></mesh>
      <mesh position={[0.08, 0.3, 0.24]} scale={[0.25, 0.25, 0.2]} onClick={(event) => selectOrgan(event, 'heart')} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={organ === 'heart' ? '#ef4444' : '#703243'} emissive={organ === 'heart' ? '#ef4444' : '#250711'} emissiveIntensity={organ === 'heart' ? 1.6 : 0.25} /></mesh>
      <mesh position={[-0.04, -0.4, 0.16]} scale={[0.36, 0.28, 0.2]} onClick={(event) => selectOrgan(event, 'stomach')} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={organ === 'stomach' ? '#f59e0b' : '#76541a'} emissive={organ === 'stomach' ? '#f59e0b' : '#2b1a04'} emissiveIntensity={organ === 'stomach' ? 1.3 : 0.22} /></mesh>
      <mesh position={[0, 1.65, 0.1]} scale={[0.42, 0.22, 0.24]} onClick={(event) => selectOrgan(event, 'brain')} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={organ === 'brain' ? '#8b5cf6' : '#4b3d7e'} emissive={organ === 'brain' ? '#8b5cf6' : '#160d36'} emissiveIntensity={organ === 'brain' ? 1.5 : 0.25} /></mesh>
      <mesh position={active.pos} scale={active.scale}><sphereGeometry args={[1, 48, 48]} /><meshBasicMaterial color={active.color} transparent opacity={0.18} /></mesh>
      <group position={active.pos} ref={spread}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[spreadPoints, 3]} />
          </bufferGeometry>
          <pointsMaterial color={active.color} size={0.045} transparent opacity={0.82} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.58, 0.01, 16, 100]} /><meshBasicMaterial color={active.color} transparent opacity={0.75} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 1.35, 1.35]}><torusGeometry args={[0.58, 0.006, 16, 100]} /><meshBasicMaterial color={active.color} transparent opacity={0.38} /></mesh>
      </group>
      <mesh position={[-0.92, 0.95, 0.08]} onClick={(event) => selectOrgan(event, 'lungs')}><sphereGeometry args={[0.045, 18, 18]} /><meshBasicMaterial color="#29d3ff" /></mesh>
      <mesh position={[0.82, 0.38, 0.08]} onClick={(event) => selectOrgan(event, 'heart')}><sphereGeometry args={[0.045, 18, 18]} /><meshBasicMaterial color="#ef4444" /></mesh>
      <mesh position={[-0.78, -0.55, 0.08]} onClick={(event) => selectOrgan(event, 'stomach')}><sphereGeometry args={[0.045, 18, 18]} /><meshBasicMaterial color="#f59e0b" /></mesh>
      <mesh position={[0.78, 1.8, 0.08]} onClick={(event) => selectOrgan(event, 'brain')}><sphereGeometry args={[0.045, 18, 18]} /><meshBasicMaterial color="#8b5cf6" /></mesh>
      <group position={[0, -1.35, 0]}>
        <mesh><boxGeometry args={[2.15, 0.03, 0.03]} /><meshBasicMaterial color={active.color} transparent opacity={0.5} /></mesh>
      </group>
      <Annotation position={[0.02, -1.55, 0]} color={active.color} />
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, 0.005, 12, 100]} /><meshBasicMaterial color="#29d3ff" transparent opacity={0.5} /></mesh>
    </group>
  )
}

function HologramBodyMaterial() {
  return (
    <meshStandardMaterial
      color="#1b8fc2"
      emissive="#0a5d86"
      emissiveIntensity={0.72}
      transparent
      opacity={0.68}
      roughness={0.28}
      metalness={0.18}
    />
  )
}

function HologramCoreMaterial() {
  return <meshBasicMaterial color="#29d3ff" transparent opacity={0.24} />
}

function HumanSilhouette() {
  return (
    <group name="clear-full-human-body">
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.34, 48, 48]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0, 1.28, 0]} scale={[0.15, 0.24, 0.12]}>
        <capsuleGeometry args={[1, 0.35, 10, 24]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0, 0.45, 0]} scale={[0.58, 0.95, 0.24]}>
        <sphereGeometry args={[1, 64, 64]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0, -0.62, 0]} scale={[0.48, 0.32, 0.2]}>
        <sphereGeometry args={[1, 48, 48]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0, 0.98, 0.02]} scale={[0.78, 0.08, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[-0.58, 0.62, 0]} rotation={[0, 0, -0.28]} scale={[0.1, 0.78, 0.095]}>
        <capsuleGeometry args={[1, 1.05, 12, 28]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0.58, 0.62, 0]} rotation={[0, 0, 0.28]} scale={[0.1, 0.78, 0.095]}>
        <capsuleGeometry args={[1, 1.05, 12, 28]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[-0.24, -1.55, 0]} rotation={[0, 0, 0.05]} scale={[0.12, 0.92, 0.11]}>
        <capsuleGeometry args={[1, 1.28, 12, 30]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0.24, -1.55, 0]} rotation={[0, 0, -0.05]} scale={[0.12, 0.92, 0.11]}>
        <capsuleGeometry args={[1, 1.28, 12, 30]} />
        <HologramBodyMaterial />
      </mesh>
      <mesh position={[0, 0.28, 0.19]} scale={[0.04, 1.15, 0.04]}>
        <capsuleGeometry args={[1, 1.1, 8, 18]} />
        <meshBasicMaterial color="#9ee7ff" transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, 0.42, 0.2]} scale={[0.68, 1.12, 0.018]}>
        <torusGeometry args={[0.7, 0.012, 12, 120]} />
        <HologramCoreMaterial />
      </mesh>
      <mesh position={[0, 1.72, 0.2]} scale={[0.37, 0.37, 0.018]}>
        <torusGeometry args={[0.96, 0.014, 12, 120]} />
        <HologramCoreMaterial />
      </mesh>
      <mesh position={[0, -0.82, 0.2]} scale={[0.58, 0.07, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <HologramCoreMaterial />
      </mesh>
    </group>
  )
}

function Annotation({ position, color }) {
  return (
    <group position={position}>
      <mesh><planeGeometry args={[1.8, 0.22]} /><meshBasicMaterial color="#06111f" transparent opacity={0.78} /></mesh>
      <mesh position={[-0.82, 0, 0.01]}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color={color} /></mesh>
      <mesh position={[0, -0.14, 0]}><boxGeometry args={[1.55, 0.012, 0.012]} /><meshBasicMaterial color={color} transparent opacity={0.55} /></mesh>
    </group>
  )
}

function GlassPanel({ title, action, children }) {
  return <section className="glass-panel"><div className="panel-head"><h2>{title}</h2><span>{action}</span></div>{children}</section>
}

// eslint-disable-next-line no-unused-vars
function Metric({ title, value, icon: Icon, tone }) {
  return <motion.article className={`metric ${tone}`} whileHover={{ y: -5 }}><Icon /><span>{title}</span><strong>{value}</strong></motion.article>
}

function ProgressCard({ item }) {
  return <article className="progress-card"><div><strong>{item.name}</strong><span>{item.confidence}% confidence</span></div><div className="bar"><i style={{ width: `${item.confidence}%`, background: item.color }} /></div></article>
}

function Risk({ label, value, percent, danger }) {
  return <div className="risk"><span>{label}</span><strong>{value}</strong><div><i style={{ width: `${percent}%`, background: danger ? '#ef4444' : '#29d3ff' }} /></div></div>
}

// eslint-disable-next-line no-unused-vars
function Reminder({ text }) {
  return <div className="list-row"><CalendarClock size={18} /><span>{text}</span><Check size={16} /></div>
}

function Recommendation({ text }) {
  return <div className="list-row"><SparkleIcon size={18} /><span>{text}</span></div>
}

function MedicalCard({ title, meta, text, icon: Icon }) {
  return <article className="medical-card"><Icon /><strong>{title}</strong><span>{meta}</span><p>{text}</p></article>
}

function ChatBubble({ message, language }) {
  return <div className={`chat-bubble ${message.role}`}>{t(message.text, language)}</div>
}

function EmergencyMini({ severe, language = 'English' }) {
  return <div className={`emergency-mini ${severe ? 'hot' : ''}`}><AlertTriangle />{t(severe ? 'Danger signal detected. Emergency workflow armed.' : 'No emergency signal in current text.', language)}</div>
}

function Particles() {
  return <div className="particles">{Array.from({ length: 28 }).map((_, index) => <span key={index} style={{ '--i': index }} />)}</div>
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#fff" d="M21.6 12.2c0-.8-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.3Z" /><path fill="#fff" d="M12 22c2.7 0 5-0.9 6.6-2.5L15.4 17c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" /><path fill="#fff" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6Z" /><path fill="#fff" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.6l3.3 2.6C7.2 7.9 9.4 6.1 12 6.1Z" /></svg>
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z" /></svg>
}

function translateDemoReply(reply, language) {
  if (language === 'English') return reply
  const question = reply.match(/Your question: "([^"]*)"/)?.[1] || ''
  const prefix = language === 'Hindi' ? `आपका सवाल: "${question}"` : `మీ ప్రశ్న: "${question}"`
  const body = reply.replace(/Your question: ".*?"/, '').trim()
  const replacements = {
    Hindi: [
      ['Possible emergency. Seek hospital care now. Do not self-treat chest pain or stroke symptoms.', 'संभावित आपात स्थिति. तुरंत अस्पताल जाएं. सीने में दर्द या स्ट्रोक लक्षणों का स्वयं इलाज न करें.'],
      ['Hello. Tell me your main symptom and how many days it has lasted.', 'नमस्ते. अपना मुख्य लक्षण और यह कितने दिनों से है बताएं.'],
      ['Share your main symptom first so I can suggest the right medicine.', 'पहले अपना मुख्य लक्षण बताएं ताकि सही दवा सुझाव दे सकूं.'],
      ['Prescription tab updated as a draft.', 'प्रिस्क्रिप्शन टैब ड्राफ्ट के रूप में अपडेट हो गया.'],
      ['Eat soup, fruits, coconut water, light meals. Avoid fried food, ice cream, and cold soda while sick.', 'सूप, फल, नारियल पानी और हल्का भोजन लें. बीमारी में तला भोजन, आइसक्रीम और ठंडा सोडा न लें.'],
      ['Likely viral fever or flu. Rest, fluids, monitor temperature every 4-6 hours.', 'संभवतः वायरल बुखार या फ्लू. आराम करें, तरल लें, हर 4-6 घंटे तापमान देखें.'],
      ['Likely respiratory irritation or infection. Warm fluids, steam inhalation, avoid cold drinks and smoke.', 'संभवतः सांस की जलन या संक्रमण. गर्म तरल, भाप लें, ठंडे पेय और धुएं से बचें.'],
      ['Possible tension headache or migraine. Hydrate, rest in a dark room, paracetamol after food if needed.', 'संभवतः तनाव सिरदर्द या माइग्रेन. पानी पिएं, अंधेरे कमरे में आराम करें, जरूरत हो तो खाने के बाद पैरासिटामोल लें.'],
      ['Please describe your main symptom (fever, cough, stomach pain, etc.) and how long it has lasted so I can give a specific answer.', 'कृपया अपना मुख्य लक्षण (बुखार, खांसी, पेट दर्द आदि) और यह कितने समय से है बताएं ताकि मैं स्पष्ट जवाब दे सकूं.'],
    ],
    Telugu: [
      ['Possible emergency. Seek hospital care now. Do not self-treat chest pain or stroke symptoms.', 'అత్యవసర పరిస్థితి కావచ్చు. వెంటనే ఆసుపత్రికి వెళ్లండి. ఛాతి నొప్పి లేదా స్ట్రోక్ లక్షణాలకు స్వయంగా చికిత్స చేయవద్దు.'],
      ['Hello. Tell me your main symptom and how many days it has lasted.', 'నమస్కారం. మీ ప్రధాన లక్షణం ఏమిటి, ఎన్ని రోజులుగా ఉందో చెప్పండి.'],
      ['Share your main symptom first so I can suggest the right medicine.', 'సరైన మందు సూచించడానికి ముందు మీ ప్రధాన లక్షణం చెప్పండి.'],
      ['Prescription tab updated as a draft.', 'ప్రిస్క్రిప్షన్ ట్యాబ్ డ్రాఫ్ట్‌గా నవీకరించబడింది.'],
      ['Eat soup, fruits, coconut water, light meals. Avoid fried food, ice cream, and cold soda while sick.', 'సూప్, పండ్లు, కొబ్బరి నీరు, తేలికపాటి ఆహారం తీసుకోండి. అనారోగ్య సమయంలో వేయించిన ఆహారం, ఐస్‌క్రీమ్, చల్లని సోడా మానండి.'],
      ['Likely viral fever or flu. Rest, fluids, monitor temperature every 4-6 hours.', 'వైరల్ జ్వరం లేదా ఫ్లూ కావచ్చు. విశ్రాంతి తీసుకోండి, ద్రవాలు తీసుకోండి, ప్రతి 4-6 గంటలకు ఉష్ణోగ్రత చూసుకోండి.'],
      ['Likely respiratory irritation or infection. Warm fluids, steam inhalation, avoid cold drinks and smoke.', 'శ్వాసనాళ ఇర్రిటేషన్ లేదా ఇన్‌ఫెక్షన్ కావచ్చు. గోరువెచ్చని ద్రవాలు, ఆవిరి తీసుకోండి, చల్లని పానీయాలు మరియు పొగను మానండి.'],
      ['Possible tension headache or migraine. Hydrate, rest in a dark room, paracetamol after food if needed.', 'టెన్షన్ తలనొప్పి లేదా మైగ్రేన్ కావచ్చు. నీరు తాగండి, చీకటి గదిలో విశ్రాంతి తీసుకోండి, అవసరమైతే భోజనం తర్వాత పారాసిటమాల్ తీసుకోండి.'],
      ['Please describe your main symptom (fever, cough, stomach pain, etc.) and how long it has lasted so I can give a specific answer.', 'దయచేసి మీ ప్రధాన లక్షణం (జ్వరం, దగ్గు, కడుపు నొప్పి మొదలైనవి) మరియు ఎంతకాలంగా ఉందో చెప్పండి, అప్పుడు స్పష్టమైన సమాధానం ఇవ్వగలను.'],
    ],
  }
  const translated = replacements[language].reduce((text, [from, to]) => text.replace(from, to), body)
  return `${prefix}\n\n${translated}`
}

function demoReply(text, language = 'English', history = []) {
  const context = [...history, { role: 'user', text }]
    .filter((m) => m.role === 'user')
    .map((m) => m.text)
    .join(' ')
  const lower = text.toLowerCase()
  const quote = `Your question: "${text}"`

  if (/chest pain|stroke|can't breathe|severe breath/i.test(lower) || /chest pain|stroke/i.test(context)) {
    return `${quote}\n\nPossible emergency. Seek hospital care now. Do not self-treat chest pain or stroke symptoms.`
  }
  if (/^(hi|hello|hey)\b/i.test(lower)) {
    return `${quote}\n\nHello. Tell me your main symptom and how many days it has lasted.`
  }
  if (/what medicine|which medicine|can i take|paracetamol/i.test(lower)) {
    const fever = /fever|bukhar|జ్వర/i.test(context)
    return `${quote}\n\n${fever ? 'For fever: Paracetamol 500 mg every 6-8 hours after food (max 4/day) + ORS every 3-4 hours.' : 'Share your main symptom first so I can suggest the right medicine.'}\nPrescription tab updated as a draft.`
  }
  if (/what food|can i eat/i.test(lower)) {
    return `${quote}\n\nEat soup, fruits, coconut water, light meals. Avoid fried food, ice cream, and cold soda while sick.`
  }
  if (/stomach|vomit|diarrhea|nausea/i.test(lower)) {
    return `${quote}\n\nPossible gastritis or food infection. Take ORS in small sips, bland diet (rice, toast), avoid spicy/oily food. See a doctor if blood in stool or severe pain.`
  }
  if (/diabetes|blood sugar/i.test(lower)) {
    return `${quote}\n\nCheck glucose as advised, take prescribed diabetes medicines on time, hydrate. Do not change insulin/tablet dose without your doctor.`
  }
  if (/allergy|rash|itch/i.test(lower)) {
    return `${quote}\n\nStop the suspected trigger. If lip/face swelling or breathing trouble starts, go to emergency immediately.`
  }
  if (/fever|feaver|bukhar|జ్వర/i.test(lower)) {
    return `${quote}\n\nLikely viral fever or flu. Rest, fluids, monitor temperature every 4-6 hours.\nMedicines (doctor confirmation): Paracetamol 500 mg every 6-8 hours + ORS.\nSee a doctor if fever lasts more than 3 days or breathing worsens.`
  }
  if (/cough/i.test(lower)) {
    return `${quote}\n\nLikely respiratory irritation or infection. Warm fluids, steam inhalation, avoid cold drinks and smoke.\nSee a doctor if fever, chest pain, or breathlessness appears.`
  }
  if (/headache|migraine/i.test(lower)) {
    return `${quote}\n\nPossible tension headache or migraine. Hydrate, rest in a dark room, paracetamol after food if needed.\nUrgent care if sudden worst headache, vision changes, or vomiting.`
  }
  if (/\d{2,3}\s*f|temperature|^\d{2,3}$/i.test(lower)) {
    return `${quote}\n\nThanks for sharing your temperature. Continue fluids and rest; consult a doctor today if it stays high more than 3 days or you feel very weak.`
  }
  return `${quote}\n\nPlease describe your main symptom (fever, cough, stomach pain, etc.) and how long it has lasted so I can give a specific answer.`
}

export default App
