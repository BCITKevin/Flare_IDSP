import { db } from "@/db";
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
        await db.insert(subscription).values({
            id: clientId,
            data: JSON.stringify(subscriptionData),
        })

        return { success: { data: subscriptionData }};
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}