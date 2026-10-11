# SocialOpti — Frontend

Frontend for **Intelligent Multi-Agent Framework for Social Media Content Optimization and Engagement Prediction** (IEEE Final Year Project).

Built with **React.js + Vite + Tailwind CSS**, matching the provided SocialOpti dashboard design language across every page. Frontend only — all data is dummy/mock data, no backend or AI is connected.

## Tech Stack
- React.js 18
- Vite 5
- Tailwind CSS 3
- React Router v6
- Framer Motion
- Recharts
- React Icons (Lucide, Simple Icons, Font Awesome 6 sets)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Pages

| Route | Page |
|---|---|
| `/` | Landing Page |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Dashboard |
| `/upload` | Upload Content |
| `/analysis` | Content Analysis |
| `/recommendations` | Recommendations |
| `/engagement-prediction` | Engagement Prediction |
| `/analytics` | Analytics Dashboard |
| `/history` | History |
| `/calendar` | Calendar (bonus, linked from sidebar) |
| `/profile` | Profile |
| `/settings` | Settings |

## Folder Structure

```
src/
├── components/
│   ├── layout/        # Sidebar, Topbar, DashboardLayout, MobileSidebarContent, ProtectedRoute, PageTransition
│   ├── ui/             # Card, Badge, ProgressBar, StatCard, PageHeader, PlatformIcon
│   └── charts/         # GaugeChart
├── context/
│   ├── ThemeContext.jsx # Light/dark mode, persisted to localStorage
│   └── AuthContext.jsx  # Client-side auth state, persisted to localStorage
├── data/
│   └── dummyData.js    # All mock/dummy data used across the app
├── pages/               # One file per route
├── App.jsx              # Route definitions (protected routes for the app shell)
├── main.jsx             # Entry point (wraps App in ThemeProvider + AuthProvider)
└── index.css            # Design tokens & global styles (Tailwind layers)
```

## App-Level Features
- **Authentication (demo)**: Login/Register/social buttons set a client-side auth flag (`AuthContext`, persisted to `localStorage`). All dashboard-style routes are wrapped in `ProtectedRoute` and redirect to `/login` if signed out; signing in sends you back to the page you tried to visit. This is a frontend-only simulation — no real credential validation.
- **Dark mode**: Toggle via the sun/moon icon in the topbar or Settings → Appearance. State persists across reloads (`ThemeContext` + Tailwind's `class` dark mode strategy).
- **Page transitions**: `PageTransition` fades/slides in page content on every route change inside the dashboard shell.

## Design System

Defined centrally in `tailwind.config.js`:
- **Primary**: Indigo/violet (`primary-500` = `#635BFF`)
- **Accents**: Blue, Purple, Green (success), Orange (warning), Teal, Red
- **Ink** (grayscale) scale for text & borders
- **Radius**: `xl2` (18px), `xl3` (20px), `xl4` (24px)
- **Shadows**: `card`, `cardHover`, `premium`, `glow`
- Fonts: **Plus Jakarta Sans** (display/headings) + **Inter** (body), loaded via Google Fonts in `index.html`

Reusable utility classes (`src/index.css`): `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input-field`, `.card`, `.card-hover`, `.glass`, `.badge`.

## Notes
- All data comes from `src/data/dummyData.js` — replace with real API calls when the backend/agents are ready.
- No backend, AI models, or external APIs are called; this is a UI-only deliverable.
- Auth is simulated entirely client-side for demo/navigation purposes — swap `AuthContext`'s `login`/`logout` for real API calls when a backend exists.
