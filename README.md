# Web application school project

> A full-stack professional web application built with **React**, **Node.js (JavaScript)**, **MySQL** (Azure Database for MySQL), and deployed on **Microsoft Azure**. Features include authentication, user profiles with photos, real-time chat, and a polished UI/UX. NOT FINISHED.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + JavaScript | UI framework |
| **Styling** | Tailwind CSS + shadcn/ui | Component library & design system |
| **Routing** | React Router v6 | Client-side navigation |
| **State** | Zustand | Global state management |
| **Real-time** | Socket.io-client | Live chat |
| **Backend** | Node.js + Express (JavaScript) | REST API + WebSocket server |
| **ORM** | Prisma | Database access & migrations |
| **Database** | MySQL (Azure Database for MySQL) | Persistent data |
| **Auth** | JWT (access + refresh tokens) | Stateless authentication |
| **Storage** | Azure Blob Storage | Profile photos & media |
| **Hosting** | Azure App Service (API) + Azure Static Web Apps (Frontend) | Cloud deployment |
| **Secrets** | Azure Key Vault | Secure config management |
| **CDN** | Azure CDN | Fast static asset delivery |

## Development THINGHY...

All the FRONTEND is for later; i'll use POSTMAN.

### Phase 1 — Project Setup
- [x] Do all the stuff for the Database conection, use StarUML for a dedicated User and use Prisma for modifying the SQL database; oh and don't forget the migration...

### Phase 2 — Azure Infrastructure (for later, OMG)...
- [ ] Create an **Azure Resource Group** (logical container for all services)
- [ ] Provision **Azure Database for MySQL Flexible Server**
- [ ] Provision **Azure Blob Storage** account + container (`profile-photos`)
- [ ] Provision **Azure App Service** (Node.js 20, Linux)
- [ ] Provision **Azure Static Web Apps**
- [ ] Provision **Azure Key Vault** and add all secrets
- [ ] Configure App Service to pull secrets from Key Vault via Managed Identity
- [ ] Run Prisma migrations against the Azure MySQL instance

### Phase 3 — Authentication System
- [x] `POST /api/auth/register` — hash password with **bcrypt**, store user in DB
- [x] `POST /api/auth/login` — validate credentials, return **JWT access token** (15 min) + **refresh token** (7 days)
- [x] `POST /api/auth/refresh` — issue new access token using refresh token
- [x] `POST /api/auth/logout` — invalidate refresh token in DB
- [ ] Frontend: Login page with form validation
- [ ] Frontend: Register page with password strength indicator
- [ ] Frontend: Store token in memory (NOT localStorage) using Zustand; store refresh token in `httpOnly` cookie
- [ ] Frontend: Axios interceptor to auto-refresh token on 401 responses
- [ ] Protected route component that redirects unauthenticated users

### Phase 4 — User Profiles
- [x] DB model: `User` (id, email, username, passwordHash, bio, avatarUrl, createdAt)
- [x] `GET /api/users/:id` — get public profile
- [x] `PUT /api/users/:id` — update profile (bio, username) — authenticated, own profile only
- [x] `POST /api/users/:id/avatar` — upload photo to **Azure Blob Storage**, save URL in DB
- [ ] Frontend: Profile page displaying user info and avatar
- [ ] Frontend: Edit profile form
- [ ] Frontend: Avatar upload with image preview before submission
- [ ] Frontend: Image compression before upload (use `browser-image-compression` library)

### Phase 5 — Real-Time Chat
- [ ] DB models: `ChatRoom`, `Message` (id, roomId, senderId, content, createdAt)
- [ ] `GET /api/rooms` — list available chat rooms
- [ ] `POST /api/rooms` — create a new room
- [ ] `GET /api/rooms/:id/messages` — get message history (paginated)
- [ ] Socket.io server: `join-room`, `leave-room`, `send-message`, `receive-message` events
- [ ] Frontend: Chat page with room list sidebar + message area
- [ ] Frontend: Real-time message display with Socket.io-client
- [ ] Frontend: Message timestamps and sender avatars
- [ ] Frontend: Auto-scroll to latest message
- [ ] Frontend: Typing indicators

### Phase 6 — UI/UX Polish
- [ ] Install and configure **shadcn/ui** component library
- [ ] Implement consistent color theme and dark/light mode toggle
- [ ] Responsive layout (mobile-first with Tailwind CSS breakpoints)
- [ ] Loading skeletons for async content (profiles, messages)
- [ ] Toast notifications for success/error feedback
- [ ] 404 and error boundary pages
- [ ] Page transitions / animations with **Framer Motion**

### Phase 7 — CI/CD & Deployment
- [ ] GitHub Actions workflow: on push to `main` → build and deploy frontend to Azure Static Web Apps
- [ ] GitHub Actions workflow: on push to `main` → build and deploy backend to Azure App Service
- [ ] Configure environment variables in Azure App Service settings
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on Azure Static Web Apps; configure on App Service)

---

## Security Checklist

> These are non-negotiable security practices for a professional application.

### Authentication & Tokens
- [x] Passwords hashed with **bcrypt** (cost factor ≥ 12) — never store plain text
- [x] JWT access tokens short-lived (15 minutes)
- [x] Refresh tokens stored in DB; invalidated on logout
- [x] Token stored in **httpOnly, Secure, SameSite=Strict** cookie — not localStorage
- [x] Rate limit auth endpoints (max 10 attempts / 15 min per IP) with `express-rate-limit`

### API Security (LATER...)
- [ ] **Helmet.js** — sets secure HTTP headers automatically
- [ ] **CORS** — whitelist only your frontend domain
- [ ] Input validation on every endpoint with **Zod** (schema-based validation)
- [ ] SQL injection prevention via **Prisma** (parameterized queries — never raw string SQL)
- [ ] File upload validation: check MIME type AND magic bytes; limit size to 5 MB
- [ ] User can only modify their own resources (authorization checks in controllers)

### Infrastructure
- [ ] All secrets stored in **Azure Key Vault**, never in code or committed `.env` files
- [x] `.env` file added to `.gitignore` immediately
- [ ] Azure MySQL: firewall rules — only allow App Service IP
- [ ] Azure Blob Storage: container is private; serve photos via signed URLs or App Service proxy
- [ ] Enable **Azure Defender for MySQL** for threat detection

