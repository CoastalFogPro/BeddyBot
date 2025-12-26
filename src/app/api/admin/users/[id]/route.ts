import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, children, stories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// DELETE: Delete a user and all their data (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // 1. Delete all stories owned by user
        await db.delete(stories).where(eq(stories.userId, id));

        // 2. Delete all children profiles owned by user
        await db.delete(children).where(eq(children.userId, id));

        // 3. Delete the user
        await db.delete(users).where(eq(users.id, id));

        return NextResponse.json({ success: true, message: "User deleted" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

// PATCH: Edit a user's role or password (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { role, password, name, email } = await request.json();

        const updates: any = {};
        if (role) updates.role = role;
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        await db.update(users).set(updates).where(eq(users.id, id));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
