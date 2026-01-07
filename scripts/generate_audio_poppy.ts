import { db } from '@/db';
import { children, stories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generatePoppyAudio() {
    console.log("Generating Demo Audio for Landing Page...");

    // Hardcoded demo text so we don't rely on local DB state
    const title = "Poppy and the Rocket Ship";
    const content = "Once upon a time, there was a brave girl named Poppy who loved the stars. One night, a friendly robot named BeddyBot landed in her backyard. 'Beep boop,' said the robot. 'Do you want to fly to the moon?' Poppy's eyes lit up with joy. She climbed aboard the shiny silver rocket, and together they zoomed past twinkling constellations and sleeping clouds. It was the most magical adventure ever.";

    const textToRead = `${title}. ${content}`;

    console.log("Generating Audio via OpenAI...");

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: textToRead,
        });

        console.log("Audio generated. Saving to public folder...");
        const buffer = Buffer.from(await mp3.arrayBuffer());

        const outputPath = path.join(process.cwd(), 'public', 'demo-story.mp3');
        fs.writeFileSync(outputPath, buffer);

        console.log(`✅ Success! Audio saved to: ${outputPath}`);
        console.log(`Audio Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

    } catch (err) {
        console.error("Failed to generate/save audio:", err);
    }
}

generatePoppyAudio();
