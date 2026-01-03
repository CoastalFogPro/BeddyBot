import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixUser() {
    const email = 'cris@coastalfogpro.com';
    console.log(`Fixing user: ${email}`);

    try {
        await db.update(users)
            .set({
                subscriptionStatus: 'active',
                planType: 'monthly',
                stripeSubscriptionId: 'sub_1SlN9gI5ORkHWR7p20Tu4B8A'
            })
            .where(eq(users.email, email));
        console.log("SUCCESS: Manually updated user to active/monthly.");
    } catch (e: any) {
        console.error("FAILED:", e);
    }
}

fixUser();
