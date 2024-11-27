'use server';

import { db, eq } from "@/db";
import { subscription } from "@/db/schema/subscription";

export default async function getAllSubscription() {
    const data = await db
        .select()
        .from(subscription)

    if (data) {
        const formatData = data.map((d) => {
            return {
                ...d,
                data: d.data.replace(/^"|"$/g, ""),
            }
        })
        console.log(formatData);
        return formatData;
    }
}