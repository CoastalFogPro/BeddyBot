'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function handleSignup(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) return { error: 'All fields are required.' };

    try {
        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return { error: 'User already exists.' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        return { success: true };
    } catch (error) {
        console.error('Signup error:', error);
        return { error: 'Failed to create account.' };
    }
}

export async function handleLogin(formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
