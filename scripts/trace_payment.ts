
import { stripe } from "../src/lib/stripe";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

async function tracePayment() {
    const email = "cris@crismitchellphotography.com";
    console.log(`🕵️‍♀️ Tracing payments for: ${email}`);

    try {
        // 1. Find Charges
        const charges = await stripe.charges.list({
            limit: 5,
            // Stripe API for listing charges by email is not direct in some versions, 
            // but we can iterate recent charges or search customers first.
            // Actually, querying charges by customer is better.
        });

        // Search customers first
        const customers = await stripe.customers.list({ email: email, limit: 5 });

        if (customers.data.length === 0) {
            console.log("❌ No customers found with this email.");
            return;
        }

        for (const customer of customers.data) {
            console.log(`\n--------------------------------------------------`);
            console.log(`Customer: ${customer.id} (${customer.email})`);

            // 2. Get Charges for this Customer
            const customerCharges = await stripe.charges.list({
                customer: customer.id,
                limit: 3
            });

            if (customerCharges.data.length === 0) {
                console.log("  No charges found.");
            } else {
                for (const charge of customerCharges.data) {
                    console.log(`  💲 Charge ${charge.id}: ${charge.amount} ${charge.currency} | Status: ${charge.status} | Paid: ${charge.paid}`);
                    console.log(`     Created: ${new Date(charge.created * 1000).toLocaleString()}`);

                    if (charge.invoice) {
                        const invoiceId = typeof charge.invoice === 'string' ? charge.invoice : charge.invoice.id;
                        const invoice = await stripe.invoices.retrieve(invoiceId);
                        console.log(`     📄 Invoice: ${invoice.id} | Status: ${invoice.status}`);

                        if (invoice.subscription) {
                            const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
                            const sub = await stripe.subscriptions.retrieve(subId);
                            console.log(`     🔄 Subscription: ${sub.id}`);
                            console.log(`        Status: ${sub.status}`); // active, trialing, incomplete...
                            console.log(`        Plan: ${sub.items.data[0].price.nickname || sub.items.data[0].price.id}`);
                        } else {
                            console.log("     ⚠️ No subscription attached to invoice.");
                        }
                    } else {
                        console.log("     ⚠️ Charge is not linked to an invoice (One-time payment?)");
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

tracePayment();
