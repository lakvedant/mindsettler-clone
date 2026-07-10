# 🧘 MindSettler: A Unified Mental Wellness Ecosystem

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://mindsettler-clone.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://mongodb.com)
[![SVNIT Surat](https://img.shields.io/badge/Institute-SVNIT%20Surat-orange?style=for-the-badge)](https://www.svnit.ac.in)
[![GWOC 2026](https://img.shields.io/badge/GWOC%202026-Winner%20🏆-gold?style=for-the-badge)](https://github.com)

> **🏆 Winner — Google Winter of Code (GWOC) 2026**

**MindSettler** is a professional-grade mental health platform built to democratize access to specialized therapy. Designed by an AI student at **NIT Surat**, this project addresses the logistical friction in mental healthcare through an automated booking engine, a secure internal economy (Wallet), and smart-activation digital session rooms.

🚀 **Live Link:** [https://mindsettler-clone.vercel.app/](https://mindsettler-clone.vercel.app/)

---

## 🎯 The "Problem vs. Solution" Philosophy

### 1. The Friction Problem
**Problem:** Traditional healthcare platforms have high drop-off rates due to "Transaction Anxiety" at the point of booking.  
**Solution:** The **MindSettler Wallet**. By pre-loading credits, users can book a session with a single click. This also enables instant, frictionless refunds if a session is rescheduled or rejected by the administrator.

### 2. The Ghost Link Problem
**Problem:** Users often struggle with when to join a session, leading to missed appointments.  
**Solution:** **Smart-Room Logic**. Meeting links are hidden and "Room Locked" until exactly **10 minutes before** the session (IST), providing a clear, stress-free countdown.

### 3. The Security Gap
**Problem:** Public APIs are vulnerable to brute-force attacks and spam.  
**Solution:** **Tiered Rate Limiting**. Stricter limits are applied to Auth and Corporate inquiry routes to prevent bot abuse using `express-rate-limit`.

---

## ✨ Core Features

### 💰 Secure Virtual Wallet System
* **Atomic Transactions:** Backend ensures the wallet balance is debited simultaneously with the appointment creation using Mongoose sessions to prevent partial data states.
* **Instant Reversals:** If an admin cancels or rejects a session, funds are returned to the user's wallet instantly via automated transaction logic.

### 📅 Intelligent Therapy Scheduler & Bulk Broadcast
* **Time-Aware Filtering:** Automatically hides past time slots for the current day to prevent impossible bookings.
* **Specialized Modalities:** Choose from CBT, DBT, ACT, Schema Therapy, and more.
* **Bulk Availability Broadcast:** Administrators can publish availability slots for the next 30 days in a single click, featuring smart slot collision avoidance that merges new slots without overwriting active bookings.

### 🎥 Hybrid Session Ecosystem
* **Digital & Physical:** Support for both **Online (Video)** and **Offline (In-Clinic)** sessions.
* **Flexible Payments:** Dual-mode checkout allowing users to pay via **Virtual Wallet** for instant digital booking or **Cash-on-Arrival** for physical clinic visits.

### 📰 Dynamic Resource Hub & Admin CMS
* **Database-Backed Blogs:** Dynamic category management and article publishing, complete with custom tags, read-time tracking, and featured highlights.
* **Premium Article Paywall:** Support for locked, paid resources with a UTR-based bank transfer submission and review queue for offline payments.
* **Admin Management Console:** Full control panel to create, update, and delete blogs/categories, and approve/reject pending article access requests.

### 📧 Automated Email Notifications
* **Booking Confirmation:** Instant professional HTML email sent upon successful booking with session details and Google Calendar integration.
* **Status Alerts:** Real-time notifications sent via Nodemailer for session **Approvals** or **Rejections**.

### 🤖 Contextual AI Navigation
* **Intent Recognition:** An integrated chatbot that analyzes user queries to provide immediate support.
* **Smart Redirection:** Based on the conversation flow, the AI automatically triggers redirects to the **Booking Engine** (for personal therapy) or the **Corporate Portal** (for business inquiries), significantly reducing the user's "time-to-action."

---

## 🏗️ Architecture & Data Modeling

* **Mongoose Referencing:** Utilizes `DocumentReferences` for relational integrity between `Appointments`, `Blogs`, `BlogPayments`, and `Users`.
* **Lifecycle Hooks:** Backend triggers automated email controllers specifically during the `.save()` or `.findByIdAndUpdate()` lifecycle of an appointment.
* **Complex Aggregations & Highlights:** Uses MongoDB pipelines to filter available therapist slots based on real-time booking status, and manages site highlights (Main & Side) dynamically by shifting statuses automatically on new submissions.

---

## 🔐 Security & Optimization
* **JWT in HttpOnly Cookies:** Prevents XSS attacks by ensuring tokens are inaccessible via client-side JavaScript.
* **Helmet.js Integration:** Implements standard security headers (CSP, HSTS, etc.) to harden the Express server.
* **CORS Policy:** Strict whitelist-based CORS configuration to ensure only the MindSettler frontend can communicate with the API.

---

## 📂 Project Structure
```text
mindsettler-clone/
├── client/                # React (Vite) + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── api/          # Axios instance with withCredentials: true
│   │   ├── context/      # Auth & Wallet state management
│   │   └── pages/        # Dashboard, Booking, & Corporate Views
├── server/                # Node.js + Express
│   ├── middleware/       # Auth guards & Rate limiters
│   ├── controllers/      # Wallet transactions & Email logic
│   ├── templates/        # Professional HTML Email templates
│   └── models/           # Mongoose schemas (User, Appointment, Blog)
```

---

## ⚙️ Getting Started & Setup

Follow these steps to run the MindSettler application locally:

### Prerequisites
* **Node.js** (v16.x or higher)
* **npm** (v8.x or higher)
* **MongoDB** (Local instance or MongoDB Atlas account)

### Database Setup
1. **Local MongoDB**: Ensure your MongoDB service is running locally (`mongodb://localhost:27017/mindsettler`).
2. **MongoDB Atlas (Cloud)**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database user and whitelist your IP.
   - Obtain the connection URI and paste it in `server/.env` as `MONGO_URI`.

### Third-Party Services Integration
This application integrates with the following external services:
1. **Nodemailer & Email Server (SMTP)**:
   - Used for sending verification links and booking notifications.
   - If using **Gmail**, navigate to your Google Account settings, enable 2-step verification, and generate an **App Password** for `SENDER_PASSWORD`.
2. **AI Chatbot (OpenRouter / Google Gemini)**:
   - OpenRouter key is used for the chatbot to recognize booking/corporate inquiry intents.
   - Set up an account on [OpenRouter](https://openrouter.ai/) to get an API key and add it to `OPENROUTER_API_KEY`.
3. **UPI Payment Gateway**:
   - For premium resources/blogs, the UPI ID configuration in the client initiates payment prompts. Set `VITE_UPI_ID` to your valid VPI address.

### Local Installation & Running

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd mindsettler-clone
   ```

2. **Setup Server Environment Variables:**
   - Navigate to the `server` directory.
   - Copy `server/.env.example` to `server/.env` and fill in your keys:
     ```bash
     cd server
     cp .env.example .env
     ```
   - Install server dependencies:
     ```bash
     npm install
     ```
   - Start the backend server (runs on `http://localhost:4000`):
     ```bash
     npm start
     # or for development with nodemon:
     npm run dev
     ```

3. **Setup Client Environment Variables:**
   - In a new terminal window, navigate to the `client` directory.
   - Copy `client/.env.example` to `client/.env` and configure:
     ```bash
     cd client
     cp .env.example .env
     ```
   - Install client dependencies:
     ```bash
     npm install
     ```
   - Start the Vite development server (runs on `http://localhost:5173`):
     ```bash
     npm run dev
     ```

---

## ⚖️ License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.