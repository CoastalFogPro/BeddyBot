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
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const dbUser = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
        if (!dbUser.length || !dbUser[0].stripeCustomerId) {
            return new NextResponse("No customer record found", { status: 404 });
        }

        let customerId = dbUser[0].stripeCustomerId;

        // EMERGENCY FIX: If using a Manual ID, search for the real active one 
        if (customerId && customerId.includes('MANUAL')) {
            const customers = await stripe.customers.list({ email: dbUser[0].email, limit: 1 });
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
            } else {
                return new NextResponse("Cannot create portal: No valid Stripe Customer found.", { status: 404 });
            }
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error) {
        console.error("Stripe Portal Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
