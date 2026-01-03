import { db } from '@/db';
import { users } from '@/db/schema';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugUser() {
    console.log("--- DEBUG USER SUBSCRIPTION ---");

    // fetch the most recent user
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users.`);

    if (allUsers.length === 0) return;

    // Assuming you are logged in as the first/main user, or we check all
    for (const u of allUsers) {
        console.log(`\nUser: ${u.email} (ID: ${u.id})`);
        console.log(`DB Status: ${u.subscriptionStatus}`);
        console.log(`DB Plan: ${u.planType}`);
        console.log(`Stripe Customer ID: ${u.stripeCustomerId}`);

        if (u.stripeCustomerId) {
            try {
                const subs = await stripe.subscriptions.list({
                    customer: u.stripeCustomerId,
                    status: 'all',
                });
                console.log(`Stripe Subscriptions Found: ${subs.data.length}`);
                subs.data.forEach(s => {
                    console.log(` - ID: ${s.id}`);
                    console.log(` - Status: ${s.status}`);
                    console.log(` - Price: ${s.items.data[0].price.id}`);
                });
            } catch (e: any) {
                console.log(`Stripe Error: ${e.message}`);
            }
        } else {
            console.log("No Stripe Customer ID on User.");
        }
    }
}

debugUser();
