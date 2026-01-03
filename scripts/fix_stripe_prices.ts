import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

async function fixPrices() {
    console.log("Creating Test Products & Prices...");

    try {
        // 1. Create Monthly Product
        const monthlyProd = await stripe.products.create({
            name: 'BeddyBot Monthly Membership (Test)',
        });
        console.log(`CREATED_MONTHLY_PRODUCT_ID=${monthlyProd.id}`);

        // 2. Create Monthly Price
        const monthlyPrice = await stripe.prices.create({
            product: monthlyProd.id,
            unit_amount: 999,
            currency: 'usd',
            recurring: { interval: 'month' },
        });
        console.log(`NEW_MONTHLY_PRICE_ID=${monthlyPrice.id}`);

        // 3. Create Yearly Product
        const yearlyProd = await stripe.products.create({
            name: 'BeddyBot Yearly Membership (Test)',
        });
        console.log(`CREATED_YEARLY_PRODUCT_ID=${yearlyProd.id}`);

        // 4. Create Yearly Price
        const yearlyPrice = await stripe.prices.create({
            product: yearlyProd.id,
            unit_amount: 4999,
            currency: 'usd',
            recurring: { interval: 'year' },
        });
        console.log(`NEW_YEARLY_PRICE_ID=${yearlyPrice.id}`);

    } catch (error) {
        console.error("Error creating prices:", error);
    }
}

fixPrices();
