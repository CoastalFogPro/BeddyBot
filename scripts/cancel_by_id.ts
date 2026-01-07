
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any,
});

const CUSTOMER_ID = 'cus_TkZJX6sWtU5tIM';

async function cancelByCustomerId() {
    console.log(`🔍 Checking Customer ID: ${CUSTOMER_ID}...`);

    try {
        const customer = await stripe.customers.retrieve(CUSTOMER_ID, {
            expand: ['subscriptions']
        });

        if (customer.deleted) {
            console.log("❌ Customer is deleted.");
            return;
        }

        // @ts-ignore
        const subs = customer.subscriptions?.data || [];

        if (subs.length === 0) {
            console.log("ℹ️ No subscriptions found for this customer.");
        }

        for (const sub of subs) {
            console.log(`⚠️ Found Subscription ${sub.id} (${sub.status}). Canceling...`);
            await stripe.subscriptions.cancel(sub.id);
            console.log(`✅ Subscription ${sub.id} canceled.`);
        }

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

cancelByCustomerId();
