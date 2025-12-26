import { auth } from '@/auth';
import { db } from '@/db';
import { stories } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { childId, title, content, imageUrl, theme } = body;

        if (!title || !content || !childId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let finalImageUrl = imageUrl;

        // If imageUrl is a remote URL (OpenAI), fetch and convert to Base64
        if (imageUrl && imageUrl.startsWith('http')) {
            try {
                console.log("Downloading image for persistence...");
                const imageRes = await fetch(imageUrl);
                if (imageRes.ok) {
                    const arrayBuffer = await imageRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const base64 = buffer.toString('base64');
                    // Identify mime type (default to png for DALL-E)
                    const contentType = imageRes.headers.get('content-type') || 'image/png';
                    finalImageUrl = `data:${contentType};base64,${base64}`;
                    console.log("Image converted to Base64 successfully.");
                } else {
                    console.warn("Failed to download image, saving original URL.");
                }
            } catch (err) {
                console.error("Error converting image to Base64:", err);
                // Fallback to original URL so at least it works temporarily
            }
        }

        // Insert into DB
        const [newStory] = await db.insert(stories).values({
            userId: session.user.id,
            childId,
            title,
            content,
            imageUrl: finalImageUrl,
            theme
        }).returning();

        return NextResponse.json({ success: true, storyId: newStory.id });

    } catch (error: any) {
        console.error('POST /api/stories/save error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
