import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { containsBlockedTerm } from '@/lib/safety/blocked_terms';
import { auth } from '@/auth';
import { db } from '@/db';
import { stories, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
    }

    try {
        // --- 1. AUTH & LIMIT CHECK ---
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [dbUser] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
        const userStrategies = await db.select({ id: stories.id }).from(stories).where(eq(stories.userId, session.user.id));
        const storyCount = userStrategies.length;

        const isPremium = dbUser?.subscriptionStatus === 'active';
        const isAdmin = dbUser?.role === 'admin';
        const limit = isAdmin ? 999999 : (isPremium ? 40 : 1);

        if (storyCount >= limit) {
            console.warn(`User ${session.user.id} reached limit but tried to generate image.`);
            // We return a specific code so the UI can handle it comfortably (e.g. show placeholder)
            return NextResponse.json({
                error: 'Limit reached',
                code: 'LIMIT_REACHED',
                imageUrl: null // clear indicator
            }, { status: 403 });
        }
        // -----------------------------

        const { theme, style = "storybook" } = await request.json();

        // 1. Safety Check: Hard Blocklist (Local)
        const blockCheck = containsBlockedTerm(theme);
        if (blockCheck.found) {
            console.warn(`Hard block triggered: ${blockCheck.term}`);
            return NextResponse.json(
                { error: 'Content violated safety policies', code: 'SAFETY_VIOLATION' },
                { status: 400 }
            );
        }

        // 2. Safety Check: Moderation API (Remote)
        const moderation = await openai.moderations.create({ input: theme });

        if (moderation.results[0].flagged) {
            console.warn('Safety violation detected:', moderation.results[0].categories);
            return NextResponse.json(
                { error: 'Content violated safety policies', code: 'SAFETY_VIOLATION' },
                { status: 400 }
            );
        }

        const prompt = `A magical, child-friendly ${style} illustration of ${theme}. \n\nIMPORTANT SAFETY GUIDELINES:\n- The image MUST be cute, innocent, and bright.\n- NO scary elements, NO dark shadows, NO monsters, NO weapons, NO violence.\n- If the theme suggests something scary (like a dragon), depict it as a cute, round, friendly baby version.\n- Soft lighting, warm pastel or vibrant colors.\n- Suitable for a toddler's storybook.\n- No text in the image.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) throw new Error("No image generated");

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
