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

    // 2. Check Limits
    const currentUsage = dbUser?.monthlyStoryCount || 0;

    // 3. Define Limits
    const isPremium = dbUser?.subscriptionStatus === 'active';
    const isAdmin = dbUser?.role === 'admin';
    const limit = isAdmin ? 999999 : (isPremium ? 40 : 1);

    if (currentUsage >= limit) {
        return NextResponse.json({
            error: isPremium ? `Monthly limit reached (${limit} stories).` : 'Free limit reached. Upgrade to create more!',
            code: 'LIMIT_REACHED'
        }, { status: 403 });
    }
    // -----------------------------------------

    try {
        const { name, age, gender, theme, style } = await request.json();
        const ageNum = parseInt(age, 10);
        const fullInput = `${name} ${age} ${gender} ${theme} ${style}`;

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

        let systemPrompt = "You are a creative, highly imaginative children's author who writes unique, non-repetitive stories. \n\nIMPORTANT SAFETY PROTOCOL:\n- You are programmed to be a SAFE, GENTLE, and POSITIVE storyteller for children.\n- NEVER include content related to violence, death, scary monsters, weapons, fighting, ghosts, or nightmares.\n- Avoid any complex or mature themes like divorce, illness, or crime.\n- If a requested theme seems even slightly scary (e.g., 'spooky forest'), reinterpret it as 'magical and friendly' (e.g., 'enchanted twinkling forest').\n- The tone must ALWAYS be warm, reassuring, and happy.\n- Characters should solve problems through kindness, sharing, and cleverness, never through aggression.";
        let userPrompt = "";

        // STYLE DEFINITIONS
        const STYLES: Record<string, string> = {
            rhyme: `[MODE: RHYME & RATTLE]
Tone: High-energy, bouncy, and whimsical.
Writing Guide: Use Anapestic Tetrameter (the "Dr. Seuss" beat: da-da-DUM, da-da-DUM). Sentences must be lyrical and melodic.
Signature Move: Invent 1-2 "nonsense" nouns or verbs (e.g., "The Wizzle-Wazzle") that sound funny when read aloud.
Structure: AABB or ABAB rhyme schemes. Keep the vocabulary simple but the rhythm complex.`,

            funny: `[MODE: FUNNY & FLAT]
Tone: Deadpan, dry, and ironic (but child-appropriate).
Writing Guide: Use the "Less is More" philosophy. Narrate ridiculous events with total seriousness. Use short, punchy, declarative sentences.
Signature Move: Use visual gags in the text. The humor should come from the character’s "straight man" reaction to chaos.
Structure: Minimalist. Avoid "flowery" adjectives.`,

            snuggle: `[MODE: SNUGGLE & DREAM]
Tone: Gentle, sensory, and comforting.
Writing Guide: Use a slow, meditative pace. Focus on "low-arousal" descriptions: soft lighting, warm textures, and quiet sounds.
Signature Move: Use "hush words" (shimmer, glow, velvet, cozy, drift). Use repetition to create a hypnotic, sleepy effect.
Structure: Every story must conclude with the protagonist feeling safe, warm, and ready for sleep.`,

            interactive: `[MODE: TALK-TO-ME]
Tone: Interactive, urgent, and playful.
Writing Guide: Break the "Fourth Wall" immediately. Speak directly to the child as "You." The story should feel like a game or a secret conversation.
Signature Move: Include "Action Prompts" in brackets, like: [Now, shake the book to wake up the bear!] or [Shhh! Can you whisper 'Go away, Giant'?].
Structure: High energy, frequent use of exclamation points, and rhetorical questions.`,

            adventure: `[MODE: GRAND ADVENTURE]
Tone: Cinematic, brave, and slightly sophisticated.
Writing Guide: Use "Roald Dahl" style vocabulary—vivid, slightly "juicy" words (tremendous, marvelous, foul, spectacular). Focus on a clear hero's journey with a sense of wonder.
Signature Move: Use rich metaphors and descriptive "world-building" that makes the setting feel vast.
Structure: Traditional narrative arc: A clear problem, a brave choice, and a triumphant (often clever) resolution.`
        };

        // Age-specific logic with DNA injection
        if (ageNum < 3 && (!style || style === 'rhyme')) {
            // Default for babies is strictly Nursery Rhyme (unless they specifically picked another style, but usually Rhythm is best)
            // Actually, let's allow overrides even for babies if the parent explicitly clicked "Funny" or "Snuggle".
            // If NO style is passed, default to Rhyme/Nursery for Age < 3
            if (!style || style === 'rhyme') {
                systemPrompt += " Write a gentle, soothing nursery rhyme (8-12 lines). Output only the title and the content in JSON format.";
                userPrompt = `Write a unique bedtime rhyme for a ${age}-year-old ${gender} named ${name} about ${theme}. Focus on the feeling of ${randomQuality}. Make it sweet and simple.`;
            } else {
                // Fallback to style logic below
            }
        }

        // If we haven't set the prompt yet (either Age >= 3 OR Age < 3 passed a specific style)
        if (userPrompt === "") {
            const selectedStyleKey = style && STYLES[style] ? style : 'rhyme'; // Default to Rhyme/Seuss
            const selectedStylePrompt = STYLES[selectedStyleKey];

            systemPrompt += `\n\n${selectedStylePrompt}\n\nOutput only the title and the content in JSON format.`;

            // LENGTH & COMPLEXITY RULES (Strict Logic)
            let lengthInstruction = "Length: Approximately 400-500 words.";
            if (ageNum < 4) {
                lengthInstruction = "CRITICAL LENGTH RULE: Keep it VERY SHORT (Maximum 100-150 words). Simple sentences. Focus on sound and rhythm. Short attention span.";
            } else if (ageNum < 6) {
                lengthInstruction = "Length: Short and sweet (approx 200-300 words).";
            }

            userPrompt = `Write a unique bedtime story using the '[MODE: ${selectedStyleKey.toUpperCase()}]' defined in the system prompt.
             
             TARGET AUDIENCE: ${age}-year-old ${gender} named ${name}.
             THEME: ${theme}
             ${lengthInstruction}
             
             STORY DNA:
             - Plot Archetype: ${randomArchetype}
             - Key Lesson: ${randomQuality}
             - Character Name: ${name}
             
             Ensure the story perfectly matches the requested Tone, Writing Guide, and Signature Moves of the selected mode.`;
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

        // Increment Usage
        await db.update(users)
            .set({ monthlyStoryCount: currentUsage + 1 })
            .where(eq(users.id, session.user.id));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: 'Failed to generate story' },
            { status: 500 }
        );
    }
}
