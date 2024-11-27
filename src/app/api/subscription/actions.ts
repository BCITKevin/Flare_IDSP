import { db, eq } from "@/db";
import { subscription } from "@/db/schema/subscription";

interface PushSubscription {
    endpoint: string;
    expirationTime: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export default async function storeSubscription(clientId: string, subscriptionData: PushSubscription) {
    try {
        const existingSubscription = await db
            .select()
            .from(subscription)
            .where(eq(subscription.id, clientId))

        if (existingSubscription.length >= 1) {
            return {
                success: false, message: "Subscription already exists.",
            }
        }

        await db.insert(subscription).values({
            id: clientId,
            data: JSON.stringify(subscriptionData),
        });

        return { success: true };
    } catch (error) {
        console.error("Error saving subscription:", error);
        return { success: false };
    }
}