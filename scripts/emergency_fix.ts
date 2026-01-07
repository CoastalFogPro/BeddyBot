
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

async function manualFix() {
    const email = "cris@crismitchellphotography.com";
    console.log(`🔧 Manually fixing subscription for: ${email}`);

    // 1. Get User
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
        console.error("❌ User not found!");
        return;
    }

    console.log(`Current Status: ${user.subscriptionStatus}`);

    // 2. Force Update
    await db.update(users).set({
        subscriptionStatus: 'active',
        planType: 'monthly',
        stripeCustomerId: 'cus_MANUAL_OVERRIDE_LIVE', // Placeholder to prevent sync overwrite issues for now
        stripeSubscriptionId: 'sub_MANUAL_OVERRIDE',
        subscriptionEndDate: new Date('2026-02-07'), // 1 month from now
        monthlyStoryCount: 0
    }).where(eq(users.id, user.id));

    console.log("✅ SUCCESS: User forced to Premium via Manual Overseer Override.");
    process.exit();
}

manualFix();
