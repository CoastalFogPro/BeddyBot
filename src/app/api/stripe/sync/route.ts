import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [dbUser] = await db.select().from(users).where(eq(users.id, session.user.id));

        let stripeCustomerId = dbUser?.stripeCustomerId;
        let subscriptionFound: any = null;

        // 1. If we have an ID, check it first
        if (stripeCustomerId) {
            const subscriptions = await stripe.subscriptions.list({
                customer: stripeCustomerId,
                status: 'all',
                limit: 1,
            });
            if (subscriptions.data.length > 0) {
                subscriptionFound = subscriptions.data[0];
            }
        }

        // 2. Deep Search: If no ID or No Subs on current ID, search by email
        if (!subscriptionFound && session.user.email) {
            console.log(`Sync: No active sub on current ID (${stripeCustomerId}). Deep searching email ${session.user.email}...`);

            const customers = await stripe.customers.list({
                email: session.user.email,
                limit: 5, // Check multiple duplicates
                expand: ['data.subscriptions']
            });

            // Find the first customer with an active/trialing subscription
            const payingCustomer = customers.data.find(c =>
                // @ts-ignore
                c.subscriptions && c.subscriptions.data.length > 0
            );

            if (payingCustomer) {
                console.log(`Sync: Found UNLINKED paying customer ${payingCustomer.id}. Migrating DB...`);
                // @ts-ignore
                subscriptionFound = payingCustomer.subscriptions.data[0];
                stripeCustomerId = payingCustomer.id;

                // Update DB with the correct paying ID
                await db.update(users)
                    .set({ stripeCustomerId: stripeCustomerId })
                    .where(eq(users.id, session.user.id));
            }
        }

        if (!subscriptionFound) {
            // Confirm they are truly free
            await db.update(users).set({
                subscriptionStatus: 'free',
                planType: null,
                stripeSubscriptionId: null,
                subscriptionEndDate: null,
            }).where(eq(users.id, session.user.id));

            return NextResponse.json({ message: "No active subscription found (Verified)" });
        }

        const sub = subscriptionFound;

        // Determine Plan Type logic (simplified)
        // You might want to map price IDs to plan names if strict
        const isYearly = sub.items.data.some((item: any) => item.price.recurring?.interval === 'year');
        const planType = isYearly ? 'yearly' : 'monthly';

        // Update DB
        await db.update(users).set({
            subscriptionStatus: sub.status, // active, past_due, canceled, etc.
            planType: planType,
            stripeSubscriptionId: sub.id,
            subscriptionEndDate: sub.current_period_end ? new Date(sub.current_period_end * 1000) : new Date(),
        }).where(eq(users.id, session.user.id));

        return NextResponse.json({
            success: true,
            status: sub.status,
            plan: planType
        });

    } catch (error: any) {
        console.error("Sync Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
