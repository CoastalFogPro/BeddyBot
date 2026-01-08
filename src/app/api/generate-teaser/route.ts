
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/db';
import { guest_generations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { name, age, gender, theme } = await req.json();

        // 1. Rate Limiting (Guardrails)
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';

        // Simple IP sanitation (take first IP if multiple)
        const clientIp = ip.split(',')[0].trim();

        if (clientIp !== 'unknown' && clientIp !== '::1' && clientIp !== '127.0.0.1') {
            const guestRecord = await db.select().from(guest_generations).where(eq(guest_generations.ipAddress, clientIp)).limit(1);

            if (guestRecord.length > 0) {
                const record = guestRecord[0];
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

                // If generated more than 3 times in last 24 hours, block
                if (record.generationCount >= 2 && record.lastGeneratedAt > oneDayAgo) {
                    return NextResponse.json(
                        { error: "You've reached the free preview limit. Please sign up to create unlimited stories!" },
                        { status: 429 }
                    );
                }
            }
        }

        // 2. Generate Teaser Content (Text & Image in Parallel)
        const textPrompt = `
        Write the FIRST 150 words of a bedtime story for a ${age} year old ${gender} named ${name}.
        Theme: ${theme || 'Magical Adventure'}.
        
        Important Rules:
        1. Keep it engaging and magical.
        2. STOP SUDDENLY on a cliffhanger or exciting moment.
        3. Do NOT finish the story.
        4. Do NOT include a title.
        `;

        const imagePrompt = `A magical, child-friendly storybook illustration of ${theme || 'Magical Adventure'}. \n\nIMPORTANT SAFETY GUIDELINES:\n- The image MUST be cute, innocent, and bright.\n- NO scary elements, NO dark shadows, NO monsters, NO weapons, NO violence.\n- If the theme suggests something scary (like a dragon), depict it as a cute, round, friendly baby version.\n- Soft lighting, warm pastel or vibrant colors.\n- Suitable for a toddler's storybook.\n- No text in the image.`;

        const [textCompletion, imageCompletion] = await Promise.all([
            openai.chat.completions.create({
                messages: [{ role: "user", content: textPrompt }],
                model: "gpt-4o-mini", // Fast & Cheap for free tier
                max_tokens: 200,
            }),
            openai.images.generate({
                model: "dall-e-3",
                prompt: imagePrompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
            })
        ]);

        const storyText = textCompletion.choices[0].message.content || "";
        const imageUrl = imageCompletion.data?.[0]?.url || "";


        // 3. Update Rate Limit Usage
        // We'll upsert logic: try to update, if valid. Drizzle upsert is DB specific, let's just do explicit check/insert for safety across generic SQL
        if (clientIp !== 'unknown') {
            const guestRecord = await db.select().from(guest_generations).where(eq(guest_generations.ipAddress, clientIp)).limit(1);

            if (guestRecord.length > 0) {
                await db.update(guest_generations)
                    .set({
                        generationCount: guestRecord[0].generationCount + 1,
                        lastGeneratedAt: new Date()
                    })
                    .where(eq(guest_generations.ipAddress, clientIp));
            } else {
                await db.insert(guest_generations).values({
                    ipAddress: clientIp,
                    generationCount: 1,
                });
            }
        }

        return NextResponse.json({ text: storyText, imageUrl });

    } catch (error: unknown) {
        console.error("Teaser Gen Error:", error);
        return NextResponse.json({ error: "Failed to generate preview." }, { status: 500 });
    }
}
