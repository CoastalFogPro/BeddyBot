
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
        console.log("Using API Key:", process.env.OPENAI_API_KEY ? "Present" : "Missing");

        const mp3 = await openai.audio.speech.create({
            model: "tts-1", // Switch to standard for speed testing
            voice: "shimmer",
            input: text,
        });

        console.log("OpenAI TTS response received");

        const buffer = Buffer.from(await mp3.arrayBuffer());
        console.log("Audio buffer created, size:", buffer.length);

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
