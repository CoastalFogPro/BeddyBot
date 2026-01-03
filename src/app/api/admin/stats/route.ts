import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, stories } from '@/db/schema';
import { auth } from '@/auth';
import { eq, count } from 'drizzle-orm';

export async function GET() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [userCount] = await db.select({ count: count() }).from(users);
        const [storyCount] = await db.select({ count: count() }).from(stories);
        const [activeSubs] = await db.select({ count: count() }).from(users).where(eq(users.subscriptionStatus, 'active'));
        const [premiumRevenue] = await db.select({ count: count() }).from(users).where(eq(users.planType, 'monthly')); // Approximation for demo

        return NextResponse.json({
            totalUsers: userCount.count,
            totalStories: storyCount.count,
            activeSubscriptions: activeSubs.count,
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
