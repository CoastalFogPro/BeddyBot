
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
        const { text, narrator, style } = await req.json();

        if (!text) {
            console.error("TTS Error: No text provided");
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        console.log(`Generating speech via Google TTS. Length: ${text.length}, Voice: ${narrator}, Style: ${style}`);
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
            const options: any = {};
            if (process.env.GOOGLE_CREDENTIALS_JSON) {
                options.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
            } else {
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

            // --- STYLE TUNING ---
            // "much slower" -> 0.75
            let speakingRate = 0.75;
            let pitch = (narrator === 'male') ? -2.0 : 0.0; // Deepen male voice slightly
            let volumeGainDb = 0.0;

            // Adjust based on style
            const styleLower = (style || '').toLowerCase();
            if (styleLower.includes('snuggle') || styleLower.includes('bedtime') || styleLower.includes('dream')) {
                // Soft / Whispery
                pitch -= 1.0; // Lower pitch is more soothing
                speakingRate = 0.70; // Even slower
                volumeGainDb = -2.0; // Softer
            } else if (styleLower.includes('adventure') || styleLower.includes('action') || styleLower.includes('funny')) {
                // Louder / Energetic
                speakingRate = 0.80; // Slightly faster (but still slow)
                volumeGainDb = 2.0; // Louder
                pitch += 1.0; // Higher energy
            }

            const request = {
                input: {
                    ssml: `
                        <speak>
                            <prosody rate="default"> 
                                ${safeText
                            .replace(/\./g, '.<break time="1000ms"/>') // Long finish pause
                            .replace(/,/g, ',<break time="400ms"/>')   // Breath pause
                            .replace(/!/g, '!<break time="800ms"/>')   // Excitement pause
                            .replace(/\?/g, '?<break time="800ms"/>')   // Question pause
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
                    volumeGainDb: volumeGainDb,
                    effectsProfileId: ['headphone-class-device']
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
