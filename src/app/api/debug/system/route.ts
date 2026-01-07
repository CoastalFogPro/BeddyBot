
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" });

    // Fetch full user record
    const [dbUser] = await db.select().from(users).where(eq(users.id, session.user.id));

    return NextResponse.json({
        environment: {
            app_url: process.env.NEXT_PUBLIC_APP_URL,
            stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) + '...',
            webhook_secret_set: !!process.env.STRIPE_WEBHOOK_SECRET,
        },
        user_record: {
            id: dbUser.id,
            email: dbUser.email,
            stripeCustomerId: dbUser.stripeCustomerId,
            subscriptionStatus: dbUser.subscriptionStatus,
            planType: dbUser.planType,
            stripeSubscriptionId: dbUser.stripeSubscriptionId,
            subscriptionEndDate: dbUser.subscriptionEndDate,
        }
    });
}
