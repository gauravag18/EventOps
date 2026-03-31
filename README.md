# EventOps (Command Center)

**The high-performance event orchestration platform built for the modern editorial web.**

EventOps is an end-to-end ticketing and event management ecosystem designed with a "Performance-First" philosophy. It bridges the gap between organizers and attendees through a sharp, manga-inspired interface that prioritizes speed, accessibility, and operational precision.

---

## Performance Architecture (Zero-Latency Shell)

Unlike traditional event platforms that suffer from database-induced latency, EventOps utilizes a **Parallel SSR/CSR Decoupling** strategy to achieve sub-second page loads:

- **Redis-Backed SSR Shell:** Event metadata, capacity stats, and structural layouts are served instantly from an O(1) Redis cache.
- **Asynchronous Hydration:** Personalized user state (registration status, team membership, messaging) is fetched in parallel after the initial shell render, ensuring the UI is never blocked by authentication or slow database queries.
- **Notification Shielding:** Critical high-frequency endpoints (like notification polling) are protected by a 30-second Redis grace-cache to prevent database connection exhaustion.

## Core Pillars

### Editorial Manga Aesthetic
A distinctive design language featuring high-contrast monochrome accents, conic wisp gradients, and "Action Line" hero sections. The UI feels alive, responsive, and premium.

### Organizer Command Center
- **Dynamic Event Creation:** Multi-step forms with integrated location pinning.
- **Team Management:** Invite collaborators and manage permissions with real-time sync.
- **Unified Messaging:** A centralized hub for organizer-to-attendee communication with instant status updates.

### Attendee Experience
- **Fluid Event Discovery:** Advanced filtering by category, date, and venue type.
- **Instant Registration:** QR-coded digital wallet with seamless checkout flows.
- **Team Dashboards:** Built-in support for Hackathons and Competitions with collaborative team management features.

## The Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Vanilla CSS + Tailwind (Sharp-Editorial Theme)
- **Database:** Prisma ORM + Neon (PostgreSQL)
- **Caching:** Upstash Redis (Global Event & User State)
- **Auth:** NextAuth.js (Session-based security)
- **Messaging:** Integrated Internal Query System

## Local Development

### 1. Requirements
- Node.js (Latest LTS)
- A PostgreSQL instance (Neon recommended)
- A Redis instance (Upstash recommended)

### 2. Setup
```bash
# Clone and Install
git clone https://github.com/gauravag18/EventOps.git
cd EventOps
npm install

# Database Synchronization
npx prisma generate
npx prisma db push
```

### 3. Environment Variables
Create a `.env` in the root directory:
```env
# Database & Redis
DATABASE_URL="your-postgresql-url"
REDIS_URL="your-redis-url"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Media & Email
CLOUDINARY_URL="your-cloudinary-url"
SMTP_HOST="your-smtp"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

### 4. Run
```bash
npm run dev
```

---

## 📝 License
Licensed under the Apache License 2.0. Built with precision by the EventOps Team.
