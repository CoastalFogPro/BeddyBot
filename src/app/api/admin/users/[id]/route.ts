import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, children, stories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// GET: Fetch user details, children, and stories
export async function GET(
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

        // Fetch User
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Fetch Children
        const userChildren = await db.select().from(children).where(eq(children.userId, id));

        // Fetch Stories
        const userStories = await db.select().from(stories).where(eq(stories.userId, id)).limit(50); // Limit to 50 for now

        const { password, ...safeUser } = user;

        return NextResponse.json({
            user: safeUser,
            children: userChildren,
            stories: userStories
        });

    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

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
        const { role, password, name, email, subscriptionStatus } = await request.json();

        const updates: any = {};
        if (role) updates.role = role;
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        if (subscriptionStatus) {
            updates.subscriptionStatus = subscriptionStatus;

            // If reverting to free, clear other data
            if (subscriptionStatus === 'free' || subscriptionStatus === 'canceled') {
                updates.planType = null;
                updates.subscriptionEndDate = null;
                // We keep stripeCustomerId so they can re-subscribe easily later
            }
        }

        await db.update(users).set(updates).where(eq(users.id, id));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
