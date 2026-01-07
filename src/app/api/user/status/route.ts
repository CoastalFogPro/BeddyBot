import { auth } from '@/auth';
import { db } from '@/db';
import { users, stories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User Subscription Status
        const [user] = await db.select({
            subscriptionStatus: users.subscriptionStatus,
            monthlyStoryCount: users.monthlyStoryCount,
            role: users.role,
            subscriptionEndDate: users.subscriptionEndDate // Fetch renewal date
        }).from(users).where(eq(users.id, session.user.id));

        // Count Stories
        const userStories = await db.select({ id: stories.id }).from(stories).where(eq(stories.userId, session.user.id));
        const savedCount = userStories.length;

        // Determine Limit
        const isPremium = user?.subscriptionStatus === 'active';
        const isAdmin = user?.role === 'admin';

        const savedLimit = isPremium ? 30 : 1;
        const monthlyLimit = isAdmin ? 9999 : (isPremium ? 40 : 1);

        return NextResponse.json({
            isPremium,
            savedCount,
            savedLimit,
            monthlyUsage: user?.monthlyStoryCount || 0,
            monthlyLimit,
            subscriptionStatus: user?.subscriptionStatus || 'free',
            subscriptionEndDate: user?.subscriptionEndDate // Send to frontend
        });

    } catch (error) {
        console.error('API User Status Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
