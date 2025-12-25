import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { containsBlockedTerm } from '@/lib/safety/blocked_terms';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
    }

    try {
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

        const prompt = `A magical, child-friendly ${style} illustration of ${theme}. Soft lighting, warm colors, suitable for a bedtime story background. No text in the image.`;

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
