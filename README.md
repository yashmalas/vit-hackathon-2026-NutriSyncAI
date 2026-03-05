# NutriSync AI 🧬
### Your Real-Time Bio-Adaptive Nutrition Ecosystem

> **HACKARENA'26** — Theme: "AI-Driven Smart Healthcare"

---

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local   # Fill in your keys
npm run dev
# → http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env         # Fill in your keys
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs  (Swagger UI)
```

---

## 🏗️ Architecture

```
nutrisync-ai/
├── frontend/                    # Next.js 14 (App Router)
│   ├── app/
│   │   ├── page.tsx             # ✅ Landing page with animated hero
│   │   ├── auth/
│   │   │   ├── login/           # ✅ Split-screen login
│   │   │   └── signup/          # ✅ Split-screen signup
│   │   ├── onboarding/          # ✅ 4-step health profile wizard
│   │   └── (app)/               # ✅ Authenticated app layout
│   │       ├── dashboard/       # ✅ Vitals + charts + meal preview
│   │       ├── diet-plan/       # ✅ AI meal plan + swap modal
│   │       ├── food-scan/       # ✅ Upload + Clarifai scan animation
│   │       ├── tracker/         # ✅ Meal log form + daily ledger
│   │       └── insights/        # ✅ Risk gauges + AI recommendations
│   └── components/
│       ├── ui/                  # ✅ GlowCard, MacroRing, RiskGauge, etc.
│       ├── charts/              # ✅ WeeklyTrendChart, MacroDoughnutChart
│       └── layout/              # ✅ Sidebar (desktop), MobileNav (mobile)
│
└── backend/                     # FastAPI
    ├── main.py                  # ✅ App entry + CORS
    ├── routes/
    │   ├── auth.py              # ✅ /signup, /login, /health-profile
    │   ├── diet.py              # ✅ /generate-diet (Gemini API)
    │   ├── food.py              # ✅ /analyze-food (Clarifai)
    │   ├── tracker.py           # ✅ /log-meal, /daily-nutrition, /weekly-stats
    │   └── risk.py              # ✅ /predict-risk (scikit-learn)
    ├── services/
    │   ├── gemini_service.py    # ✅ Gemini API diet generation
    │   ├── food_service.py      # ✅ Clarifai food recognition
    │   ├── risk_service.py      # ✅ scikit-learn risk model (auto-trains)
    │   └── firebase_service.py  # ✅ Firestore CRUD helpers
    └── requirements.txt
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#040d12` | Page backgrounds |
| `--bg-surface` | `#0a1929` | Panels, sidebar |
| `--bg-card` | `#0f2137` | Cards |
| `--accent-primary` | `#00e5ff` | CTAs, focus, active |
| `--accent-secondary` | `#76ff03` | Success, health |
| `--accent-danger` | `#ff1744` | Alerts, errors |
| `--accent-warm` | `#ff9100` | Calories, fat |

**Fonts**: Syne (headings) · DM Sans (body) · JetBrains Mono (data/numbers)

---

## 🤖 AI Services

| Service | Purpose | Auth |
|---------|---------|------|
| Google Gemini 1.5 Pro | Diet plan generation | `GEMINI_API_KEY` |
| Clarifai Food Recognition | Food image analysis | `CLARIFAI_PAT` |
| scikit-learn | Risk prediction (runs locally) | None |
| Firebase Auth | User authentication | Firebase config |
| Firebase Firestore | User data persistence | Firebase config |
| Firebase Storage | Food image uploads | Firebase config |

---

## 🔑 Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Backend (`.env`)
```
GEMINI_API_KEY=...
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
CLARIFAI_PAT=...
```

---

## 📱 Key Pages

1. **`/`** — Landing page with animated hex grid, floating particles, and feature cards
2. **`/auth/signup`** — Biopunk split-screen signup form
3. **`/auth/login`** — Matching login form
4. **`/onboarding`** — 4-step health wizard (personal info → goals → lifestyle → environment)
5. **`/dashboard`** — Vitals, macro rings, 7-day chart, today's meals
6. **`/diet-plan`** — AI-generated daily meal plan with swap modal
7. **`/food-scan`** — Drag-and-drop food photo scanner with animated analysis
8. **`/tracker`** — Real-time meal logging + daily nutrient ledger
9. **`/insights`** — Risk gauges, micronutrient status, AI recommendations

---

## 🏆 Demo Flow (Judge Path)

```
/ → Get Started → /auth/signup → /onboarding → /dashboard
 → Diet Plan → /diet-plan (AI meals)
 → Food Scan → /food-scan (upload + analysis)
 → Tracker → /tracker (log meal)
 → Insights → /insights (risk gauges)
```
