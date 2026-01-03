import Stripe from 'stripe';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function setupProduction() {
    console.log("\n🚀 BEDDYBOT STRIPE PRODUCTION SETUP 🚀");
    console.log("---------------------------------------");
    console.log("I cannot access your Stripe Dashboard directly.");
    console.log("But if you provide your LIVE Secret Key, I can automatically create the products and give you the IDs you need for Netlify.\n");

    const secretKey = await question("👉 Paste your Stripe LIVE Secret Key (begins with sk_live_...): ");

    if (!secretKey.startsWith('sk_live_')) {
        console.error("\n❌ Error: That doesn't look like a Live key. It should start with 'sk_live_'.");
        console.log("Please go to Stripe Dashboard > Developers > API Keys and get the correct key.");
        rl.close();
        return;
    }

    const stripe = new Stripe(secretKey.trim(), { typescript: true });

    try {
        console.log("\n⏳ Connecting to Stripe (Live Mode)...");

        // 1. Create Monthly Product
        console.log("   Creating 'BeddyBot Monthly Membership'...");
        const monthlyProd = await stripe.products.create({ name: 'BeddyBot Monthly Membership' });
        const monthlyPrice = await stripe.prices.create({
            product: monthlyProd.id,
            unit_amount: 999, // $9.99
            currency: 'usd',
            recurring: { interval: 'month' },
        });

        // 2. Create Yearly Product
        console.log("   Creating 'BeddyBot Yearly Membership'...");
        const yearlyProd = await stripe.products.create({ name: 'BeddyBot Yearly Membership' });
        const yearlyPrice = await stripe.prices.create({
            product: yearlyProd.id,
            unit_amount: 4999, // $49.99
            currency: 'usd',
            recurring: { interval: 'year' },
        });

        // 3. Create Webhook (Optional, but helpful)
        console.log("   Attempting to create a Webhook Endpoint...");
        const netlifyUrl = await question("👉 What is your Netlify App URL (e.g., https://beddybot.netlify.app)? ");
        let webhookSecret = "ERROR_CREATING_WEBHOOK";

        try {
            const webhook = await stripe.webhookEndpoints.create({
                url: `${netlifyUrl.replace(/\/$/, '')}/api/webhooks/stripe`,
                enabled_events: [
                    'checkout.session.completed',
                    'invoice.payment_succeeded',
                    'customer.subscription.updated',
                    'customer.subscription.deleted'
                ],
            });
            webhookSecret = webhook.secret!;
        } catch (e: any) {
            console.warn("   ⚠️  Could not auto-create webhook (url might require https). You may need to do this manually.");
        }


        console.log("\n✅ SUCCESS! Here are the values for your Netlify Environment Variables:\n");
        console.log("---------------------------------------------------------------");
        console.log(`STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
        console.log(`STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);
        if (webhookSecret !== "ERROR_CREATING_WEBHOOK") {
            console.log(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
        } else {
            console.log("# You must create the Webhook manually in Stripe Dashboard and get the secret.");
        }
        console.log("---------------------------------------------------------------\n");
        console.log("👉 Copy and paste these lines into your Netlify Site Settings > Environment Variables.\n");

    } catch (error: any) {
        console.error("\n❌ Error setting up Stripe:", error.message);
    } finally {
        rl.close();
    }
}

setupProduction();
