import { OpenAI } from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request, res: NextResponse) {
    try {
        const body = await req.json();
        const message = body.message;
    
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: 'You are an expert on BC wildfires. Respond as if you have access to real-time information about the BC wildfire situation. If a user asks questions related to wildfire conditions, provide practical advice and recommendations based on the current status.' },
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

