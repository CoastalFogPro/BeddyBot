import { auth } from '@/auth';
import { db } from '@/db';
import { stories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await props.params;
        const { id } = params;

        const [story] = await db.select()
            .from(stories)
            .where(and(
                eq(stories.id, id),
                eq(stories.userId, session.user.id)
            ));

        if (!story) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json(story);
    } catch (error) {
        console.error("Error fetching story:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await props.params;
        const { id } = params;

        // Verify ownership and delete
        const deleted = await db.delete(stories)
            .where(and(
                eq(stories.id, id),
                eq(stories.userId, session.user.id)
            ))
            .returning();

        if (deleted.length === 0) {
            return NextResponse.json({ error: 'Story not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting story:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
