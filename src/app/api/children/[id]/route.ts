
import { auth } from '@/auth';
import { db } from '@/db';
import { children, stories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 1. Verify child belongs to user
        const child = await db.select().from(children).where(
            and(
                eq(children.id, id),
                eq(children.userId, session.user.id)
            )
        ).limit(1);

        if (child.length === 0) {
            return NextResponse.json({ error: 'Child not found or unauthorized' }, { status: 404 });
        }

        // 2. Delete all stories associated with child
        await db.delete(stories).where(eq(stories.childId, id));

        // 3. Delete the child profile
        await db.delete(children).where(eq(children.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting child profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
