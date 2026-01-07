
import Stripe from 'stripe';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any, // Bypass strict version check if types are outdated
});

const TARGET_EMAIL = 'cris@crismitchellphotography.com';

async function forceCancelUser() {
    console.log(`🔍 Searching for active subscriptions for: ${TARGET_EMAIL}`);

    try {
        // 1. Find Customer(s)
        const customers = await stripe.customers.list({
            email: TARGET_EMAIL,
            expand: ['data.subscriptions']
        });

        if (customers.data.length === 0) {
            console.log("❌ No customer found.");
            return;
        }

        let cancelCount = 0;

        // 2. Iterate and Cancel Subscriptions
        for (const customer of customers.data) {
            console.log(`Checking Customer ${customer.id}...`);
            // @ts-ignore
            const subs = customer.subscriptions?.data || [];

            for (const sub of subs) {
                if (sub.status === 'active' || sub.status === 'trialing') {
                    console.log(`⚠️ Found ACTIVE subscription ${sub.id}. Canceling...`);
                    await stripe.subscriptions.cancel(sub.id);
                    console.log(`✅ Subscription ${sub.id} canceled.`);
                    cancelCount++;
                }
            }
        }

        if (cancelCount === 0) {
            console.log("ℹ️ No active subscriptions found in Stripe to cancel.");
        }

        // 3. Update Database
        console.log("🔄 Updating local database to 'free'...");
        // Find user by email first to get ID, or just update by email if schema allows (usually ID is safer)
        const userList = await db.select().from(users).where(eq(users.email, TARGET_EMAIL));

        if (userList.length > 0) {
            await db.update(users)
                .set({
                    subscriptionStatus: 'free',
                    planType: null,
                    stripeSubscriptionId: null,
                    subscriptionEndDate: null,
                    stripeCustomerId: userList[0].stripeCustomerId // Keep ID, just remove sub
                })
                .where(eq(users.email, TARGET_EMAIL)); // Using email for safety in script
            console.log("✅ Database updated.");
        } else {
            console.log("❌ User not found in DB.");
        }

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

// Run (needs DB connection, might be tricky in pure script without Next.js context, but let's try standard node run)
// Actually we need to be careful about DB connection in script.
// The previous scripts worked because we used tsx or similar.
forceCancelUser();
