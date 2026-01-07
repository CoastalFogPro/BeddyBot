
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "../src/lib/stripe";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

async function debugUser() {
    const email = "cris@crismitchellphotography.com";
    console.log(`🔍 Debugging user: ${email}`);

    // 1. Check Local DB
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
        console.error("❌ User not found in local DB!");
        return;
    }

    console.log("\n--- Local DB User Record ---");
    console.log(`ID: ${user.id}`);
    console.log(`Stripe Customer ID: ${user.stripeCustomerId || 'NULL'}`);
    console.log(`Subscription Status: ${user.subscriptionStatus}`);
    console.log(`Plan Type: ${user.planType}`);
    console.log(`Monthly Story Count: ${user.monthlyStoryCount}`);
    console.log(`Role: ${user.role}`);

    // 2. Check Stripe for this Email
    console.log("\n--- Searching Stripe by Email ---");
    try {
        const customers = await stripe.customers.list({
            email: email,
            limit: 5, // Check for duplicates
            expand: ['data.subscriptions']
        });

        if (customers.data.length === 0) {
            console.log("❌ No customer found in Stripe with this email.");
        } else {
            console.log(`✅ Found ${customers.data.length} customer(s) in Stripe.`);

            for (const customer of customers.data) {
                console.log(`\nCustomer ID: ${customer.id}`);
                console.log(`Email: ${customer.email}`);
                // @ts-ignore
                const subs = customer.subscriptions?.data || [];
                console.log(`Active Subscriptions: ${subs.length}`);

                subs.forEach((sub: any) => {
                    console.log(`  - Sub ID: ${sub.id}`);
                    console.log(`  - Status: ${sub.status}`);
                    console.log(`  - Current Period End: ${new Date(sub.current_period_end * 1000).toISOString()}`);
                    console.log(`  - Price ID: ${sub.items.data[0].price.id}`);
                });
            }
        }

    } catch (e) {
        console.error("Stripe Error:", e);
    }

    process.exit();
}

debugUser();
