import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';
import { db } from "@/app/db";
import { media } from "@/app/db/schema/news";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
})

const generateFileName = (bytes = 30) => crypto.randomBytes(bytes).toString("hex");

export default async function getSignedURL(data: any) {
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: generateFileName(),
        ContentType: 'application/json',
    })

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60,
    })

    await db.insert(media).values({
        url: signedUrl.split("?")[0],
        type: "wildfire",
    })

    return { success: { url: signedUrl } };
}

export async function getNewsFromDB() {
    const news = await db
    .select()
    .from(media)
    .then((res) => res[0]);

    return news;
}