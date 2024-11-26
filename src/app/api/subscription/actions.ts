import { db } from "@/db";
import { subscription } from "@/db/schema/subscription";

export default async function storeSubscription(clientId: string, subscriptionData: any) {
    try {
        await db.insert(subscription).values({
            id: clientId,
            data: JSON.stringify(subscriptionData),
        })

        return { success: { data: subscriptionData }};
    } catch (error) {
        return { success: false };
    }
}