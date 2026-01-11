import { db } from '@/db';
import { users } from '@/db/schema';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // ---------------------------------------------------------
    // EVENT PROCESSING
    // ---------------------------------------------------------
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session.subscription) {
                console.warn(`Webhook: Checkout session ${session.id} has no subscription. Ignoring.`);
                return new NextResponse('Ignored: No subscription', { status: 200 });
            }

            const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;
            if (!session?.metadata?.userId) {
                console.error("Webhook Error: User ID is missing in metadata");
                return new NextResponse('User ID is missing in metadata', { status: 400 });
            }

            await db.update(users)
                .set({
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    planType: session.metadata.planType as 'monthly' | 'yearly',
                    subscriptionStatus: 'active',
                    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                })
                .where(eq(users.id, session.metadata.userId));
        }

        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object as any;
            const subscriptionId = typeof invoice.subscription === 'string'
                ? invoice.subscription
                : (invoice.subscription as Stripe.Subscription)?.id;

            if (!subscriptionId) {
                console.warn(`Webhook: Invoice ${invoice.id} has no subscription ID. Ignoring.`);
                // Return 200 to acknowledge but ignore
                return new NextResponse('Ignored: No subscription ID', { status: 200 });
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

            const user = await db.select().from(users).where(eq(users.stripeCustomerId, subscription.customer as string)).limit(1);

            if (user.length > 0) {
                await db.update(users)
                    .set({
                        subscriptionStatus: 'active',
                        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                        monthlyStoryCount: 0, // Reset usage on successful payment (renewal or new)
                        lastStoryReset: new Date(),
                    })
                    .where(eq(users.id, user[0].id));
            }
        }

        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as any;

            // Check for manual override
            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, subscription.customer as string)).limit(1);
            if (existingUser && existingUser.stripeSubscriptionId === 'manual') {
                return new NextResponse('Ignored: User is strictly manual premium', { status: 200 });
            }

            await db.update(users)
                .set({
                    subscriptionStatus: subscription.status,
                    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                })
                .where(eq(users.stripeCustomerId, subscription.customer as string));
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as any;

            // Check for manual override
            const [existingUser] = await db.select().from(users).where(eq(users.stripeCustomerId, subscription.customer as string)).limit(1);
            if (existingUser && existingUser.stripeSubscriptionId === 'manual') {
                return new NextResponse('Ignored: User is strictly manual premium', { status: 200 });
            }

            await db.update(users)
                .set({
                    subscriptionStatus: 'canceled',
                    planType: null,
                })
                .where(eq(users.stripeCustomerId, subscription.customer as string));
        }

        if (event.type === 'charge.refunded') {
            const charge = event.data.object as any;
            // If this charge is linked to an invoice (subscription), handle the cancellation
            if (charge.invoice) {
                const invoiceId = typeof charge.invoice === 'string' ? charge.invoice : charge.invoice.id;
                const invoice = await stripe.invoices.retrieve(invoiceId) as any;

                if (invoice.subscription) {
                    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;

                    console.log(`Webhook: Charge refunded (${charge.id}). Canceling subscription ${subscriptionId}...`);

                    // 1. Cancel the subscription in Stripe immediately
                    try {
                        await stripe.subscriptions.cancel(subscriptionId);
                    } catch (err) {
                        console.warn("Could not cancel subscription (maybe already canceled):", err);
                    }

                    // 2. Update DB to revoke access
                    await db.update(users)
                        .set({
                            subscriptionStatus: 'canceled',
                            planType: null,
                            subscriptionEndDate: null, // Revoke immediately
                        })
                        .where(eq(users.stripeCustomerId, invoice.customer as string));
                }
            }
        }
    } catch (error: any) {
        console.error(`Webhook handler failed for event ${event.type}:`, error);
        // Return 500 to let Stripe retry, but at least we logged it
        return new NextResponse(`Webhook Handler Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse('Webhook Received', { status: 200 });
}
