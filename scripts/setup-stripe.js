const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing from .env.local");
    console.error("Please add your Stripe Secret Key to .env.local and try again.");
    process.exit(1);
}

async function setupStripe() {
    try {
        console.log("Creating Monthly Product...");
        const monthlyProduct = await stripe.products.create({
            name: 'BeddyBot Monthly Membership',
            description: 'Unlock 30 stories per month',
        });

        const monthlyPrice = await stripe.prices.create({
            unit_amount: 999, // $9.99
            currency: 'usd',
            recurring: { interval: 'month' },
            product: monthlyProduct.id,
        });

        console.log("Monthly Product ID:", monthlyProduct.id);
        console.log("Monthly Price ID:", monthlyPrice.id);

        console.log("Creating Yearly Product...");
        const yearlyProduct = await stripe.products.create({
            name: 'BeddyBot Yearly Membership',
            description: 'Unlock 30 stories per month (billed yearly)',
        });

        const yearlyPrice = await stripe.prices.create({
            unit_amount: 4999, // $49.99
            currency: 'usd',
            recurring: { interval: 'year' },
            product: yearlyProduct.id,
        });

        console.log("Yearly Product ID:", yearlyProduct.id);
        console.log("Yearly Price ID:", yearlyPrice.id);

    } catch (e) {
        console.error("Error setting up Stripe:", e);
    }
}

setupStripe();
