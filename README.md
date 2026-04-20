# 💻 Zexy Fan Web App

## 📌 Project Overview
The `zexy_fan_web_app` is the primary consumer surface of the Zexy ecosystem. It provides an optimized, frictionless gateway for fans to consume exclusive payloads, seamlessly initiate WebRTC P2P viewerships, generate tips, and support their favorite creators.

**Target User**: Fans / Users

## 🛠 Tech Stack
- **Framework**: Next.js (React 18+)
- **Styling**: Tailwind CSS
- **State & Caching**: React Query (TanStack)
- **Streaming**: Native HTML5 WebRTC API + `socket.io-client`

## ✨ Key Features
- **P2P Video Consumers**: Seamlessly connects WebRTC consumer pipelines matching Broadcaster metrics organically.
- **Frictionless Tipping**: Dedicated interfaces handling micro-transactions inside live stream rooms immediately.
- **Premium Validations**: Integrates secure payment gateways unblocking native FastAPI locks via tokens instantaneously.
- **Responsive Layout**: Designed mobile-first adapting flawlessly into immersive desktop bounds.

## 🏗 Architecture Role
The Fan App relies strongly on lightweight read-heavy performance:
- **FastAPI**: Constantly checks permission flags (validating if tickets were paid via `/api/v1/live/join`) and executes write-heavy tips natively.
- **Node.js**: Operates strictly as a listener—absorbing WebRTC `answers` mapped toward the React Native Creator.

## 📂 Basic Folder Structure
```text
zexy_fan_web_app/
├── src/
│   ├── app/              # Next.js 13+ App Router bounding pages
│   ├── components/       # Player overlaps, Chat bars, Tooltips
│   ├── hooks/            # useWebRTC bindings, useAuth hooks
│   ├── lib/              # API interfaces (Axios) resolving FastAPI boundaries
│   └── styles/           # Global Tailwind integrations
├── public/               # Static icons/assets
└── next.config.js
```

## 🚀 Setup Instructions
1. **Dependencies**: `npm install`
2. **Environment**: Map `NEXT_PUBLIC_API_URL` (FastAPI) and `NEXT_PUBLIC_SOCKET_URL` (Node.js).
3. **Boot**: `npm run dev` running organically on `localhost:3000`.

## 🔌 API & Integration Notes
- **Auth**: Expects `role: fan` mapped payloads.
- **WebRTC Lock**: Fans *cannot* dial the Node.js server to fetch offers until FastAPI explicitly returns successfully validating database payment conditions!

## 🔮 Future Scope
- Spatial audio chat layouts expanding into VIP consumer rooms natively.
- Infinite scroll timeline optimizations generating algorithmic recommendations natively.
