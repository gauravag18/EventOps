<h1 align="center"> EventOps </h1>
<p align="center"> Orchestrating Seamless Event Experiences with Precision and Scalability </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**EventOps** is a comprehensive, end-to-end event management and ticketing ecosystem designed to bridge the gap between event organizers and attendees through a unified, high-performance web interface.

> In the modern digital landscape, organizing events often involves a fragmented mess of disparate tools for registration, team coordination, and ticket verification. Organizers struggle with real-time data synchronization, while attendees often face friction in discovering events and managing their digital passes. This fragmentation leads to operational inefficiencies and a poor user experience.

EventOps solves these challenges by providing a centralized "Command Center" for the entire event lifecycle. Built with a component-based architecture and a robust data layer, it enables organizers to create, manage, and scale events while providing attendees with a frictionless journey—from discovering local happenings on an interactive map to instant QR-code ticket verification at the venue gates.

### Architecture Overview
The system leverages a **Component-based Architecture** powered by **React** and **Next.js**, ensuring a modular and maintainable codebase. The backend logic is encapsulated within Next.js API routes and Server Actions, providing a secure bridge between the frontend and the **Prisma-managed** database layer. High-speed data operations are further optimized using **Redis** for caching, ensuring that event details and registration states are served with sub-millisecond latency.

---

## ✨ Key Features

### 📅 For Event Organizers: Operational Excellence
- 🏗️ **Streamlined Event Creation:** Utilize the `CreateEventForm` and `LocationPicker` to launch events with precise geographic data and rich metadata.
- 👥 **Team & Collaboration Management:** Invite co-organizers via the `InviteOrganizerPanel` and manage team permissions through dedicated `api/teams` endpoints.
- 📊 **Organizer Dashboard:** A high-level overview of event performance, registration metrics, and attendee lists, all accessible through a dedicated `organizer/dashboard`.
- ✏️ **Dynamic Content Management:** Real-time editing capabilities for active events, allowing for updates to schedules, descriptions, or locations on the fly.

### 🎟️ For Attendees: Frictionless Participation
- 🔍 **Advanced Event Discovery:** Navigate through a curated list of events using `EventFilters` and a powerful `EventsBrowser` to find the perfect experience.
- 🗺️ **Interactive Geospatial View:** Visualize event locations globally using the integrated `EventMap` powered by Leaflet, ensuring users can find events near them.
- 📱 **Digital Ticket Wallet:** Access all registered events in a personalized `AttendeeDashboard` and view individual tickets with unique identifiers.
- ⚡ **Instant Registration:** A seamless `RegistrationModal` workflow that handles complex sign-up logic and secures your spot in seconds.

### 🛡️ System-Wide Infrastructure
- 🔐 **Robust Authentication:** Secure user sessions and role-based access control (RBAC) managed by **NextAuth**, supporting both standard logins and email verification workflows.
- 📸 **Cloud-Native Media:** Integrated image handling via **Cloudinary** for event banners and organizer profiles, ensuring optimized delivery.
- 📧 **Automated Communication:** Built-in `mailer.ts` using **Nodemailer** to handle transactional emails, verification codes, and ticket confirmations.
- 🔳 **QR Code Ecosystem:** Automatic generation and verification of tickets using QR technology, enabling rapid check-ins at physical locations.

---

## 🛠️ Tech Stack & Architecture

EventOps is built using a modern, type-safe stack designed for reliability and developer productivity.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **Next.js (v16.1.3)** | Core Framework | Provides hybrid static & server rendering, optimized routing, and a superior developer experience. |
| **React (v19.2.3)** | UI Library | Leverages the latest concurrent features and component-based UI paradigms. |
| **TypeScript** | Type Safety | Ensures codebase scalability and reduces runtime errors through strict static typing. |
| **Prisma (v6.19.2)** | ORM | Provides a type-safe database client and simplified schema migrations. |
| **Redis (Upstash)** | Caching | Facilitates ultra-fast data retrieval for frequently accessed event details and session data. |
| **Tailwind CSS** | Styling | Enables rapid UI development with a utility-first approach and highly optimized production builds. |
| **Leaflet** | Mapping | An open-source library for interactive maps, essential for the EventMap functionality. |
| **Cloudinary** | Image Hosting | Offloads heavy image processing and ensures responsive delivery of event assets. |
| **NextAuth** | Authentication | A complete, secure authentication solution for Next.js applications. |

---

## 📁 Project Structure

The codebase is organized following Next.js App Router conventions, separating concerns between UI, business logic, and data access.

```
gauravag18-EventOps/
├── 📁 app/                         # Main application directory (App Router)
│   ├── 📁 (pages)/                 # Grouped application routes
│   │   ├── 📁 attendee/            # Attendee-specific views (Dashboard, Tickets)
│   │   ├── 📁 event/               # Event detail and listing pages
│   │   ├── 📁 organizer/           # Organizer tools (Create, Edit, Dashboard)
│   │   └── 📁 profile/             # User profile management
│   ├── 📁 actions/                 # Server Actions for tickets and events
│   ├── 📁 api/                     # RESTful API endpoints
│   │   ├── 📁 auth/                # Authentication & NextAuth handlers
│   │   ├── 📁 events/              # Event CRUD and management logic
│   │   ├── 📁 tickets/             # Ticket generation and verification
│   │   └── 📁 upload/              # Cloudinary media upload handling
│   ├── 📄 globals.css              # Global styles and Tailwind imports
│   └── 📄 layout.tsx               # Root application layout
├── 📁 components/                  # Reusable UI components
│   ├── 📄 EventMap.tsx             # Interactive Leaflet map integration
│   ├── 📄 CreateEventForm.tsx      # Multi-step event creation logic
│   ├── 📄 RegistrationModal.tsx    # Attendee sign-up modal
│   └── 📄 Navbar.tsx               # Main application navigation
├── 📁 lib/                         # Core utilities and business logic
│   ├── 📁 services/                # Specialized service layers (e.g., Attendee)
│   ├── 📄 prisma.ts                # Database client initialization
│   ├── 📄 redis.ts                 # Redis/Upstash connection logic
│   ├── 📄 mailer.ts                # Nodemailer configuration
│   └── 📄 auth.ts                  # NextAuth configuration and providers
├── 📁 prisma/                      # Database layer
│   └── 📄 schema.prisma            # Database schema and models
├── 📁 public/                      # Static assets and images
├── 📄 next.config.ts               # Next.js configuration
├── 📄 package.json                 # Dependency management and scripts
├── 📄 tsconfig.json                # TypeScript compiler configuration
└── 📄 tailwind.config.ts           # Tailwind CSS design system configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the development environment and get the project running locally.

### Prerequisites
- **Node.js:** Ensure you have the latest LTS version installed.
- **Package Manager:** `npm` is used for this project.
- **Redis Instance:** Access to a Redis server (compatible with Upstash or ioredis).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gauravag18/EventOps.git
   cd EventOps
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the Database:**
   Generate the Prisma client to enable type-safe queries.
   ```bash
   npm run postinstall
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory and provide the necessary credentials (Database URL, Redis URL, Cloudinary credentials, NextAuth Secret, and SMTP settings).

### Running the Application

- **Development Mode:**
  Launch the development server with hot-reloading.
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:3000`.

- **Production Build:**
  Compile and optimize the application for production.
  ```bash
  npm run build
  npm run start
  ```

---

## 🔧 Usage

EventOps provides distinct workflows tailored to different user roles.

### 1. The Organizer Workflow
*   **Sign Up/Login:** Create an account and verify your email to access organizer features.
*   **Create Event:** Navigate to `/organizer/create-event`. Fill in the details, use the `LocationPicker` to drop a pin on the map, and upload banners via the form.
*   **Manage Team:** Open the `InviteOrganizerPanel` on your event page to add collaborators via email.
*   **Track Registrations:** Monitor the `organizer/dashboard` to see real-time ticket sales and attendee data.

### 2. The Attendee Workflow
*   **Discover:** Browse the `/events` page. Use filters to narrow down by category or date.
*   **Register:** Click "Register" on an event detail page. If the event is paid or requires a ticket, the `RegistrationModal` will guide you through the process.
*   **Access Tickets:** Visit `attendee/dashboard` to view your QR-coded tickets.
*   **Check-in:** Present your QR code at the event for verification via the `api/tickets/verify` endpoint used by staff.

---

## 🤝 Contributing

We welcome contributions to improve EventOps! Your input helps make this project better for everyone.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Improve code, documentation, or features
4. **Test thoroughly** - Ensure all functionality works as expected
   ```bash
   npm run lint
   ```
5. **Commit your changes** - Write clear, descriptive commit messages
   ```bash
   git commit -m 'Add: Amazing new feature that does X'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Submit your changes for review

### Development Guidelines

- ✅ **Style:** Follow the existing TypeScript and Tailwind CSS conventions.
- 📝 **Documentation:** Add comments for complex logic, especially within the `lib/services` and `api/` routes.
- 🧪 **Stability:** Ensure that any changes to the Prisma schema are reflected in the generated client.
- 🎯 **Atomic Commits:** Keep commits focused on a single logical change.

---

## 📝 License

This project is licensed under the **Apache License** - see the [LICENSE](LICENSE) file for complete details.


---
