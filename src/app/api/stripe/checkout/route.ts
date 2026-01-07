import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;
const YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID;

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { plan } = await req.json(); // 'monthly' or 'yearly'

        const dbUser = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
        if (!dbUser.length) {
            return new NextResponse("User not found", { status: 404 });
        }
        const user = dbUser[0];

        let priceId = MONTHLY_PRICE_ID;
        if (plan === 'yearly') {
            priceId = YEARLY_PRICE_ID;
        }

        if (!priceId) {
            return NextResponse.json({ error: "Price IDs not configured" }, { status: 500 });
        }

        // Check if user already has a stripe customer ID
        let customerId = user.stripeCustomerId;

        if (!customerId) {
            const customerData: any = {
                email: user.email,
                metadata: { userId: user.id }
            };
            if (user.name) customerData.name = user.name;

            const customer = await stripe.customers.create(customerData);
            customerId = customer.id;

            await db.update(users)
                .set({ stripeCustomerId: customerId })
                .where(eq(users.id, user.id));
        } else {
            // Ensure Stripe has the latest email for receipts
            await stripe.customers.update(customerId, { email: user.email });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
            metadata: {
                userId: user.id,
                planType: plan,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
