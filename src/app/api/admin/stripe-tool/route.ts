
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Check Admin
        if (!session?.user?.id || (session.user as any).role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { customerId } = await req.json();

        if (!customerId) return NextResponse.json({ error: "Missing Customer ID" });

        console.log(`[Admin Tool] Canceling Active Subscriptions for ${customerId}...`);

        const customer = await stripe.customers.retrieve(customerId, {
            expand: ['subscriptions']
        });

        if (customer.deleted) return NextResponse.json({ error: "Customer is deleted" });

        // @ts-ignore
        const subs = customer.subscriptions?.data || [];
        let canceledCount = 0;

        for (const sub of subs) {
            if (sub.status === 'active' || sub.status === 'trialing') {
                await stripe.subscriptions.cancel(sub.id);
                canceledCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully canceled ${canceledCount} active subscription(s) for ${customerId}.`
        });

    } catch (error: any) {
        console.error("Admin Tool Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
