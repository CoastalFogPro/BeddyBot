import { auth } from '@/auth';
import { db } from '@/db';
import { stories, children } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const childId = searchParams.get('childId');

        let query = db.select({
            id: stories.id,
            title: stories.title,
            imageUrl: stories.imageUrl,
            childId: stories.childId,
            childName: children.name,
            createdAt: stories.createdAt
        })
            .from(stories)
            .leftJoin(children, eq(stories.childId, children.id))
            .where(eq(stories.userId, session.user.id)) // Always enforce user ownership
            .orderBy(desc(stories.createdAt));

        if (childId) {
            // If childId is provided, filter further (must still belong to user implicitly via where clause above)
            // But strict WHERE clause needs to combine conditions
            query = db.select({
                id: stories.id,
                title: stories.title,
                imageUrl: stories.imageUrl,
                childId: stories.childId,
                childName: children.name,
                createdAt: stories.createdAt
            })
                .from(stories)
                .leftJoin(children, eq(stories.childId, children.id))
                .where(and(
                    eq(stories.userId, session.user.id),
                    eq(stories.childId, childId)
                ))
                .orderBy(desc(stories.createdAt));
        }

        const userStories = await query;
        return NextResponse.json(userStories);

    } catch (error: any) {
        console.error('GET /api/stories error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
