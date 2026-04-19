# Altru 🏌️‍♂️❤️

**Improve Your Game. Change a Life.**

Altru is a modern golf performance platform where every score you enter contributes to a cause you care about. By tracking your latest 5 Stableford scores, you earn automatic entries into monthly prize draws while supporting global charities.

---

## 🚀 Technical Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Authentication:** Supabase Auth (SSR Pattern)
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Payments:** Stripe (Simulation/Redirect Ready)

## ✨ Core Features

- **Charity Explorer:** Select from a curated list of non-profits to receive 10% of your platform subscription.
- **Performance Tracker:** Log your latest 5 Stableford scores via a clean, mobile-first interface.
- **Prize Draws:** View upcoming jackpots and historical winning numbers.
- **Admin Dashboard:** Simulate prize draws based on real user performance data and publish official results.
- **Automated Impact:** Track your lifetime charitable contribution directly from your personal dashboard.

---

## 🔑 Test Credentials

For evaluation purposes, you can use the following accounts to access the platform:

### Standard User
- **Email:** `paul@test.com`
- **Password:** `paul123`

### Administrator
- **Email:** `admin@test.com`
- **Password:** `admin123`
- *Note: Admin accounts have access to the `/admin` dashboard for draw simulations.*

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v20+)
- A Supabase Project

### 2. Environment Setup
Create a `.env.local` file in the `/web` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Installation & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🗄️ Database Seeding

To populate the database with charities and historical draw data, run the scripts provided in the **`SEEDING.md`** file (located in the project root) within the Supabase SQL Editor.

### Admin Access
To access the `/admin` dashboard:
1. Sign up as a regular user.
2. Manually set your `role` to `'admin'` in the `profiles` table via the Supabase SQL Editor.

---

## 🏛️ Project Architecture

- **`/src/app/charities`**: Server-side rendered directory of partner charities.
- **`/src/app/dashboard`**: Protected user area for score logging and impact tracking.
- **`/src/app/admin`**: Privileged control center for draw simulations.
- **`/src/app/actions`**: Next.js Server Actions for secure database mutations.
- **`/src/lib/supabase`**: Shared Supabase client configuration for Server, Client, and Middleware contexts.

---

## 📝 Note on Stripe Webhooks
For this assessment, subscription status is handled via the "Success Redirect" pattern. In a production environment, Stripe Webhooks (`invoice.paid`, `customer.subscription.deleted`) would be implemented to handle asynchronous events such as renewals, card failures, and cancellations.
