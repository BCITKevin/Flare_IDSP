import { OpenAI } from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = body.message;
    
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: `You are an expert on BC wildfires. Respond as if you have access to real-time information about the BC wildfire situation.
                    Always format your response as valid HTML. Use <h4> for headers, and <ul> with <li> for bullet points, if needed. Add list-disc to the class of all <ul> tags. Wrap important keywords or key phrases in <strong> tags for emphasis.`
                },
                { role: "user", content: message }
            ],
        });
    
        const result = completion.choices[0].message;
        return NextResponse.json({ chat: result }, { status: 200 });
    }
    catch(error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

