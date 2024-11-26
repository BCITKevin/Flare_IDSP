'use server';

import { db, eq } from "@/db";
import { subscription } from "@/db/schema/subscription";

export default async function getAllSubscription(clientId: string) {
    const data = await db
        .select()
        .from(subscription)
        .where(eq(subscription.id, clientId))

    if (data) {
        return data;
    }
}