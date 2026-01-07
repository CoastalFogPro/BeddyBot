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

        // FALLBACK: If no ID, search Stripe by email (Self-Healing)
        if (!stripeCustomerId && session.user.email) {
            console.log(`Sync: No ID found. Searching Stripe for ${session.user.email}...`);
            const customers = await stripe.customers.list({
                email: session.user.email,
                limit: 1
            });

            if (customers.data.length > 0) {
                stripeCustomerId = customers.data[0].id;
                console.log(`Sync: Found customer ${stripeCustomerId}. Updating DB...`);
                await db.update(users)
                    .set({ stripeCustomerId: stripeCustomerId })
                    .where(eq(users.id, session.user.id));
            } else {
                return NextResponse.json({ message: "No active subscription found (User not in Stripe)" });
            }
        }

        if (!stripeCustomerId) {
            return NextResponse.json({ message: "No Customer ID found" });
        }

        // Fetch subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: 'all',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ message: "No active subscription found in Stripe" });
        }

        const sub = subscriptions.data[0];

        // Determine Plan Type logic (simplified)
        // You might want to map price IDs to plan names if strict
        const isYearly = sub.items.data.some(item => item.price.recurring?.interval === 'year');
        const planType = isYearly ? 'yearly' : 'monthly';

        // Update DB
        await db.update(users).set({
            subscriptionStatus: sub.status, // active, past_due, canceled, etc.
            planType: planType,
            stripeSubscriptionId: sub.id,
            subscriptionEndDate: new Date((sub as any).current_period_end * 1000),
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
