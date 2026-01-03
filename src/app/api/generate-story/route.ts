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

    // --- SUBSCRIPTION CHECK (PREVENT COST) ---
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // 1. Get User Status
    const [dbUser] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    // 2. Count Stories
    const userStrategies = await db.select({ id: stories.id }).from(stories).where(eq(stories.userId, session.user.id));
    const storyCount = userStrategies.length;

    // 3. Define Limits
    const isPremium = dbUser?.subscriptionStatus === 'active';
    const isAdmin = dbUser?.role === 'admin';
    const limit = isAdmin ? 999999 : (isPremium ? 30 : 1);

    if (storyCount >= limit) {
        return NextResponse.json({
            error: isPremium ? 'Story limit reached (30).' : 'Free limit reached. Upgrade to create more!',
            code: 'LIMIT_REACHED'
        }, { status: 403 });
    }
    // -----------------------------------------

    try {
        const { name, age, gender, theme } = await request.json();
        const ageNum = parseInt(age, 10);
        const fullInput = `${name} ${age} ${gender} ${theme}`;

        // 1. Safety Check: Hard Blocklist (Local)
        const blockCheck = containsBlockedTerm(fullInput);
        if (blockCheck.found) {
            console.warn(`Hard block triggered: ${blockCheck.term}`);
            return NextResponse.json(
                { error: 'Content violated safety policies', code: 'SAFETY_VIOLATION' },
                { status: 400 }
            );
        }

        // 2. Safety Check: Moderation API (Remote)
        const moderationInput = `${theme} ${name} ${gender}`;
        // ... (rest of moderation code)
        const moderation = await openai.moderations.create({ input: moderationInput });

        if (moderation.results[0].flagged) {
            console.warn('Safety violation detected:', moderation.results[0].categories);
            return NextResponse.json(
                { error: 'Content violated safety policies', code: 'SAFETY_VIOLATION' },
                { status: 400 }
            );
        }

        // 3. Dynamic Story DNA (To prevent repetitive templates)
        const archetypes = [
            "The Lost Treasure", "The Unexpected Friend", "The Big Race", "The Magical Mistake",
            "The Secret Door", "The Helping Hand", "The Brave Journey", "The Missing Color",
            "The Flying Invention", "The Moon Party"
        ];
        const qualities = [
            "Curiosity", "Kindness", "Bravery", "Creativity", "Patience", "Teamwork"
        ];

        const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];

        let systemPrompt = "You are a creative, highly imaginative children's author who writes unique, non-repetitive stories.";
        let userPrompt = "";

        // Age-specific logic with DNA injection
        if (ageNum < 3) {
            // Nursery Rhymes
            systemPrompt += " Write a gentle, soothing nursery rhyme (8-12 lines). Output only the title and the content in JSON format.";
            userPrompt = `Write a unique bedtime rhyme for a ${age}-year-old ${gender} named ${name} about ${theme}. Focus on the feeling of ${randomQuality}. Make it sweet and simple.`;
        } else {
            // All other ages now get the Rhyming Treatment per user request
            systemPrompt += " Write a whimsical, rhyming story in the style of Dr. Seuss or a nursery rhyme. Use AABB or ABCB rhyme schemes. Keep the rhythm bouncy and fun. Output only the title and the content in JSON format.";
            userPrompt = `Write a unique, rhyming bedtime story for a ${age}-year-old ${gender} named ${name} about ${theme}.
             
             STORY DNA:
             - Plot Archetype: ${randomArchetype}
             - Key Lesson: ${randomQuality}
             - Character Name: ${name}
             - Theme: ${theme}
             - Style: Playful, rhythmic, and rhyming like Dr. Seuss.
             
             Make the story feel fresh and specific to this plot archetype. Ensure the rhymes are clever and not forced.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `${userPrompt} \n\nOutput format JSON: { "title": "The Title", "content": "The story text... (Use \\n\\n to separate paragraphs)" }`
                },
            ],
            model: "gpt-4o",
            temperature: 0.9, // Higher creativity
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: 'Failed to generate story' },
            { status: 500 }
        );
    }
}
