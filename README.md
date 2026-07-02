# MediVision AI - Intelligent Healthcare Visualization Platform

A futuristic AI-powered healthcare operating system built with React, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Node.js, Express, MongoDB, JWT, bcrypt, and AI provider hooks for OpenAI or Gemini.

## Structure

- `client/` - React + Vite frontend with dashboard, auth UI, AI chatbot, analytics, 3D visualization, prescriptions, food recommendations, reports, emergency alerts, and profile settings.
- `server/` - Express API with auth routes, protected health data routes, report upload, MongoDB models, JWT middleware, bcrypt encryption, and AI chat/analyze services.

## Run Locally

```bash
cd server
copy .env.example .env
npm run dev
```

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5174`
Backend: `http://localhost:5000/api/status`

## AI Setup

Add one provider key to `server/.env`:

```bash
OPENAI_API_KEY=your_key
```

or

```bash
GEMINI_API_KEY=your_key
```

Without a key, the API uses safe local demo responses so the platform remains usable during development.

## Medical Safety

The app is a clinical decision-support prototype. It includes a medicine disclaimer and emergency escalation flows, but users must consult certified healthcare professionals for diagnosis and medication.
