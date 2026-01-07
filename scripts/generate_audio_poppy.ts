import { db } from '@/db';
import { children, stories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generatePoppyAudio() {
    console.log("Searching for Poppy's latest story to add audio...");

    // 1. Find the Child
    const [poppy] = await db.select().from(children).where(eq(children.name, 'Poppy')).limit(1);
    if (!poppy) {
        console.error("No child named Poppy found.");
        process.exit(1);
    }

    // 2. Find the Story
    const [story] = await db.select()
        .from(stories)
        .where(eq(stories.childId, poppy.id))
        .orderBy(desc(stories.createdAt))
        .limit(1);

    if (!story) {
        console.error("No story found for Poppy.");
        process.exit(1);
    }

    console.log(`Found story: "${story.title}"`);

    if (story.audioUrl && story.audioUrl.length > 100) {
        console.log("Audio URL already exists. Overwriting/Regenerating...");
    }

    // 3. Generate Audio
    console.log("Generating Audio via OpenAI (Title)...");

    // We'll read the Title + First 800 chars of content to keep it snappy for the demo
    const textToRead = `${story.title}. ${story.content.substring(0, 1000)}`;

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: textToRead,
        });

        console.log("Audio generated. converting to Base64...");
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const base64Audio = `data:audio/mpeg;base64,${buffer.toString('base64')}`;

        console.log(`Audio Size: ${(base64Audio.length / 1024 / 1024).toFixed(2)} MB`);

        // 4. Save to DB
        console.log("Saving to database...");
        await db.update(stories)
            .set({ audioUrl: base64Audio })
            .where(eq(stories.id, story.id));

        console.log("✅ Success! Audio has been attached to the story.");

    } catch (err) {
        console.error("Failed to generate/save audio:", err);
    }
}

generatePoppyAudio();
