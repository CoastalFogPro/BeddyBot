
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/auth';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    console.log("TTS Request received");

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { text, narrator } = await req.json();

        if (!text) {
            console.error("TTS Error: No text provided");
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        console.log("Generating speech for text length:", text.length);
        const safeText = text.length > 4000 ? text.substring(0, 4000) + "..." : text;

        // ---------------------------------------------------------
        // STRATEGY: Try Google Cloud TTS (Neural2) First
        // ---------------------------------------------------------
        try {
            // Lazy load Google Cloud to avoid startup errors if package missing
            const textToSpeech = require('@google-cloud/text-to-speech');
            const path = require('path');
            const fs = require('fs');

            // Check for credentials in Env Var (JSON string) OR file path
            // If neither exists, this might throw or fail, catching us into the fallback

            const options: any = {};
            if (process.env.GOOGLE_CREDENTIALS_JSON) {
                options.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
            } else {
                // FALLBACK: Local file check for specific beddybot project
                // This allows localhost to work without restarting global shell
                const localKeyPath = path.resolve(process.cwd(), 'google-credentials.json');
                if (fs.existsSync(localKeyPath)) {
                    options.keyFilename = localKeyPath;
                }
            }

            const client = new textToSpeech.TextToSpeechClient(options);

            // Set Voice Params based on User Choice
            // Female -> en-US-Neural2-F | Male -> en-US-Neural2-D
            const voiceName = (narrator === 'male') ? 'en-US-Neural2-D' : 'en-US-Neural2-F';
            const ssmlGender = (narrator === 'male') ? 'MALE' : 'FEMALE';

            // Pitch/Speed Tuning for "Story Mode" (Optimized for Natural/Warm tone)
            // Female: Slight pitch bump, 0.85 speed (very relaxed)
            // Male: Pitch drop, 0.85 speed
            const pitch = (narrator === 'male') ? -1.0 : 1.0;
            const speakingRate = 0.85; // Much slower for bedtime reading

            const request = {
                input: {
                    ssml: `
                        <speak>
                            <prosody rate="90%">
                                ${safeText
                            .replace(/\./g, '.<break time="600ms"/>') // Longer breaks for sentences
                            .replace(/,/g, ',<break time="300ms"/>') // Breath pause for commas
                            .replace(/!/g, '!<break time="800ms"/>') // Dramatic pause for excitement
                        }
                            </prosody>
                        </speak>
                    `
                },
                voice: { languageCode: 'en-US', name: voiceName, ssmlGender: ssmlGender },
                audioConfig: {
                    audioEncoding: 'MP3',
                    pitch: pitch,
                    speakingRate: speakingRate,
                    effectsProfileId: ['headphone-class-device'] // Optimizes for higher fidelity/bass
                },
            };

            console.log(`Attempting Google TTS: ${voiceName}`);
            const [response] = await client.synthesizeSpeech(request);
            const buffer = response.audioContent;

            if (buffer) {
                console.log("Google TTS Success!");
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'audio/mpeg',
                        'Content-Length': buffer.length.toString(),
                    },
                });
            }
        } catch (googleError: any) {
            console.warn("Google TTS Failed (Falling back to OpenAI):", googleError.message);
            // Proceed to OpenAI Fallback below...
        }

        // ---------------------------------------------------------
        // FALLBACK: OpenAI TTS
        // ---------------------------------------------------------
        console.log("Using OpenAI Fallback...");
        const openaiVoice = (narrator === 'male') ? 'onyx' : 'shimmer';

        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: openaiVoice,
            speed: 0.9,
            input: safeText,
        });

        console.log("OpenAI TTS finished, buffering...");
        const buffer = Buffer.from(await mp3.arrayBuffer());

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
