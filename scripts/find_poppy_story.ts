import { db } from '@/db';
import { children, stories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function findPoppyStory() {
    console.log("Searching for Poppy's stories...");

    const childList = await db.select().from(children).where(eq(children.name, 'Poppy'));

    if (childList.length === 0) {
        console.log("No child found named Poppy.");
        return;
    }

    for (const child of childList) {
        console.log(`Found Poppy (ID: ${child.id})`);
        const storyList = await db.select().from(stories).where(eq(stories.childId, child.id));

        if (storyList.length === 0) {
            console.log(" - No stories found for this Poppy.");
        } else {
            console.log(` - Found ${storyList.length} stories.`);
            storyList.forEach(s => {
                console.log(`   > Title: "${s.title}"`);
                console.log(`     ID: ${s.id}`);
                console.log(`     Image: ${s.imageUrl}`);
                console.log(`     Audio: ${s.audioUrl}`);
                console.log(`     Content (first 100 chars): ${s.content.substring(0, 100)}...`);
                console.log("---------------------------------------------------");
            });
        }
    }
}

findPoppyStory();
