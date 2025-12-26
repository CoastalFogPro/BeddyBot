
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    console.log("TTS Request received");
    try {
        const { text } = await req.json();

        if (!text) {
            console.error("TTS Error: No text provided");
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        console.log("Generating speech for text length:", text.length);

        // Truncate if too long
        const safeText = text.length > 4000 ? text.substring(0, 4000) + "..." : text;

        const mp3 = await openai.audio.speech.create({
            model: "tts-1", // Standard models are faster and less prone to timeouts
            voice: "nova",
            input: safeText,
        });

        console.log("OpenAI TTS finished, buffering...");

        const buffer = Buffer.from(await mp3.arrayBuffer());

        console.log("Audio ready, sending ", buffer.length, " bytes");

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('TTS Server Error:', error);
        return NextResponse.json({ error: error.message || 'Error generating speech' }, { status: 500 });
    }
}
