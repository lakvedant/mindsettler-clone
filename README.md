# 🧘 MindSettler: A Unified Mental Wellness Ecosystem

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://mindsettler-taupe.vercel.app)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://mongodb.com)
[![SVNIT Surat](https://img.shields.io/badge/Institute-SVNIT%20Surat-orange?style=for-the-badge)](https://www.svnit.ac.in)
[![GWOC 2026](https://img.shields.io/badge/GWOC%202026-Winner%20🏆-gold?style=for-the-badge)](https://github.com)

> **🏆 Winner — Google Winter of Code (GWOC) 2026**

**MindSettler** is a professional-grade mental health platform built to democratize access to specialized therapy. Designed by an AI student at **NIT Surat**, this project addresses the logistical friction in mental healthcare through an automated booking engine, a secure internal economy (Wallet), and smart-activation digital session rooms.

🚀 **Live Link:** [https://mindsettler-taupe.vercel.app/](https://mindsettler-taupe.vercel.app/)

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

### 📅 Intelligent Therapy Scheduler
* **Time-Aware Filtering:** Automatically hides past time slots for the current day to prevent impossible bookings.
* **Specialized Modalities:** Choose from CBT, DBT, ACT, Schema Therapy, and more.

### 🎥 Hybrid Session Ecosystem
* **Digital & Physical:** Support for both **Online (Video)** and **Offline (In-Clinic)** sessions.
* **Flexible Payments:** Dual-mode checkout allowing users to pay via **Virtual Wallet** for instant digital booking or **Cash-on-Arrival** for physical clinic visits.

### 📧 Automated Email Notifications
* **Booking Confirmation:** Instant professional HTML email sent upon successful booking with session details and Google Calendar integration.
* **Status Alerts:** Real-time notifications sent via Nodemailer for session **Approvals** or **Rejections**.

### 🤖 Contextual AI Navigation
* **Intent Recognition:** An integrated chatbot that analyzes user queries to provide immediate support.
* **Smart Redirection:** Based on the conversation flow, the AI automatically triggers redirects to the **Booking Engine** (for personal therapy) or the **Corporate Portal** (for business inquiries), significantly reducing the user's "time-to-action."

---

## 🛠️ Technical Problem Solving



* **Vercel Cookie Persistence:** Solved the "Cookie not saving" issue on serverless functions by setting `app.set("trust proxy", 1)` and configuring JWT cookies with `SameSite: "None"` and `Secure: true`.
* **Async Email Dispatch:** Integrated professional HTML templates with `Nodemailer` to handle concurrent user notifications without blocking the main event loop.
* **Rate Limiting on Edge:** Implemented `express-rate-limit` with `trust proxy` enabled to accurately track user IPs across Vercel’s serverless infrastructure.
* **Google Calendar IST Fix:** Developed a custom helper to generate GCal links that force the `Asia/Kolkata` timezone, preventing 5.5-hour shifts caused by UTC conversion.

---

## 🏗️ Architecture & Data Modeling



* **Mongoose Referencing:** Utilizes `DocumentReferences` for relational integrity between `Appointments` and `Users`.
* **Lifecycle Hooks:** Backend triggers automated email controllers specifically during the `.save()` or `.findByIdAndUpdate()` lifecycle of an appointment.
* **Complex Aggregations:** Uses MongoDB pipelines to filter available therapist slots based on real-time booking status and user-specific timezone offsets.

---

## 🔐 Security & Optimization
* **JWT in HttpOnly Cookies:** Prevents XSS attacks by ensuring tokens are inaccessible via client-side JavaScript.
* **Helmet.js Integration:** Implements standard security headers (CSP, HSTS, etc.) to harden the Express server.
* **CORS Policy:** Strict whitelist-based CORS configuration to ensure only the MindSettler frontend can communicate with the API.

---

## ⚖️ License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📂 Project Structure
```text
mindsettler/
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