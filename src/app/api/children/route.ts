import { auth } from '@/auth';
import { db } from '@/db';
import { children } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userChildren = await db.select()
            .from(children)
            .where(eq(children.userId, session.user.id))
            .orderBy(desc(children.createdAt));

        return NextResponse.json(userChildren);
    } catch (error: any) {
        console.error('GET /api/children error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, age, gender } = body;

        if (!name || !age) {
            return NextResponse.json({ error: 'Name and Age are required' }, { status: 400 });
        }

        // Color logic
        let color = '#4D96FF'; // Default Blue
        if (gender === 'Girl') color = '#FF6B6B'; // Pink

        const [newChild] = await db.insert(children).values({
            userId: session.user.id,
            name,
            age,
            gender: gender || 'Boy',
            color
        }).returning();

        return NextResponse.json({ success: true, child: newChild });

    } catch (error: any) {
        console.error('POST /api/children error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
