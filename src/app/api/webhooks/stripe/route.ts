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

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;
        if (!session?.metadata?.userId) {
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

        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

        const user = await db.select().from(users).where(eq(users.stripeCustomerId, subscription.customer as string)).limit(1);

        if (user.length > 0) {
            await db.update(users)
                .set({
                    subscriptionStatus: 'active',
                    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                })
                .where(eq(users.id, user[0].id));
        }
    }

    if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as any;
        await db.update(users)
            .set({
                subscriptionStatus: subscription.status,
                subscriptionEndDate: new Date(subscription.current_period_end * 1000),
            })
            .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as any;
        await db.update(users)
            .set({
                subscriptionStatus: 'canceled',
                planType: null,
            })
            .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    return new NextResponse('Webhook Received', { status: 200 });
}
