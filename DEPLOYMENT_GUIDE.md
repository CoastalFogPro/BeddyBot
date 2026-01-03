# 🚀 BeddyBot Deployment Guide (Netlify & Stripe Live)

This guide will walk you through deploying your application to Netlify and configuring Stripe for **Live Payments**.

---

## 1. Prerequisites
- A [Netlify Account](https://www.netlify.com/)
- A [Stripe Account](https://stripe.com/) (Activated for Live payments)
- Your project pushed to a Git repository (GitHub, GitLab, etc.)

---

## 2. Netlify Environment Variables
When you set up your project in Netlify, you must add the following **Environment Variables** in the "Site Configuration" > "Environment variables" section.

| Variable Name | Value Description | Example Value |
|--------------|-------------------|---------------|
| `NEXT_PUBLIC_APP_URL` | Your actual Netlify domain (no trailing slash) | `https://beddybot.netlify.app` |
| `NEXTAUTH_URL` | Same as above | `https://beddybot.netlify.app` |
| `NEXTAUTH_SECRET` | A long random string (you can generate a new one) | `your_secure_random_string` |
| `AUTH_SECRET` | Same as `NEXTAUTH_SECRET` | `your_secure_random_string` |
| `DATABASE_URL` | Your Production NeonDB Connection String | `postgresql://...` |
| `OPENAI_API_KEY` | Your OpenAI API Key | `sk-...` |

---

## 3. Switching Stripe to "Live Mode"
Your current local setup uses **Test Mode** keys (`sk_test_...`). For production, you need **Live Mode** keys.

### A. Get Live Keys
1.  Go to your [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Toggle the "Test Mode" switch to **OFF** (Live Mode).
3.  Go to **Developers > API Keys**.
4.  Copy your **Publishable Key** (`pk_live_...`) and **Secret Key** (`sk_live_...`).

**Add these to Netlify Environment Variables:**
-   `STRIPE_SECRET_KEY` = `sk_live_...`
-   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`

### B. Create Live Products
Stripe Products/Prices **do not** transfer automatically from Test to Live. You must recreate them.

1.  In Stripe (Live Mode), go to **Product Catalog**.
2.  Create **"Monthly Membership"**:
    *   Price: **$9.99**
    *   Recurring: **Monthly**
    *   **IMPORTANT**: Copy the **Price API ID** (starts with `price_...`).
3.  Create **"Yearly Membership"**:
    *   Price: **$49.99**
    *   Recurring: **Yearly**
    *   **IMPORTANT**: Copy the **Price API ID** (starts with `price_...`).

**Add these to Netlify Environment Variables:**
-   `STRIPE_MONTHLY_PRICE_ID` = `price_...` (The new live ID for Monthly)
-   `STRIPE_YEARLY_PRICE_ID` = `price_...` (The new live ID for Yearly)

---

## 4. Configure Production Webhook
To ensure user accounts update automatically after payment, you must configure a live webhook.

1.  In Stripe (Live Mode), go to **Developers > Webhooks**.
2.  Click **"Add Endpoint"**.
3.  **Endpoint URL**: `https://your-site-name.netlify.app/api/webhooks/stripe`
    *   *Replace `your-site-name` with your actual Netlify domain.*
4.  **Events to Listen For**:
    *   `checkout.session.completed`
    *   `invoice.payment_succeeded`
    *   `customer.subscription.updated`
    *   `customer.subscription.deleted`
5.  Click **"Add Endpoint"**.
6.  Reveal the **Signing Secret** (`whsec_...`) for this new endpoint.

**Add this to Netlify Environment Variables:**
-   `STRIPE_WEBHOOK_SECRET` = `whsec_...` (The live webhook secret)

---

## 5. Final Checklist
Before you tell users you are live, verify:
- [ ] `NEXT_PUBLIC_APP_URL` matches your domain.
- [ ] `STRIPE_SECRET_KEY` starts with `sk_live_`.
- [ ] `STRIPE_MONTHLY_PRICE_ID` matches the ID in your Live Product Catalog.
- [ ] You have configured the Live Webhook URL.

🎉 **You are ready to launch!**
