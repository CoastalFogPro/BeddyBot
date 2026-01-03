import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, children, stories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// GET: List all users (Admin only)
export async function GET() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
        // Remove passwords from response
        const safeUsers = allUsers.map(({ password, ...rest }) => rest);
        return NextResponse.json(safeUsers, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST: Create a new user (Admin only)
export async function POST(request: Request) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await request.json();

        // Check if email exists
        const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existing.length > 0) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Failed to create user:", error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
