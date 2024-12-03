import { db, eq } from "@/db";
import { subscription } from "@/db/schema/subscription";

export default async function deleteToken(clientId: string, token: string ) {
    try {
        await db.delete(subscription).where(eq(subscription.id, clientId));
        return { success: true };
    } catch (error) {
        console.error("Error saving subscription:", error);
        return { success: false };
    }
}