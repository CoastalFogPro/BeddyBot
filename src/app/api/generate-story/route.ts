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

        let systemPrompt = "You are a creative bedtime story generator for children.";
        let userPrompt = "";

        // Age-specific logic
        if (ageNum < 3) {
            systemPrompt += " Write a gentle, soothing nursery rhyme (8-12 lines). output only the title and the content in JSON format.";
            userPrompt = `Write a bedtime rhyme for a ${age}-year-old ${gender} named ${name} about ${theme}. Make it sweet and simple.`;
        } else if (ageNum <= 7) {
            systemPrompt += " Write a whimsical, fun short story (approx 150 words). output only the title and the content in JSON format.";
            userPrompt = `Write a magical bedtime story for a ${age}-year-old ${gender} named ${name} about ${theme}. Include a friendly magical creature.`;
        } else {
            systemPrompt += " Write an engaging adventure story (approx 350-400 words). output only the title and the content in JSON format.";
            userPrompt = `Write an exciting adventure story for a ${age}-year-old ${gender} named ${name} about ${theme}. The character should solve a problem using kindness or courage.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `${userPrompt} \n\nOutput format JSON: { "title": "The Title", "content": "The story text..." }`
                },
            ],
            model: "gpt-4o",
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
