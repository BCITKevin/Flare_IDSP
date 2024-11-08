import { NextResponse } from 'next/server';
import getSignedURL, { getNewsFromDB } from './actions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function GET() {
  try {
    const news = await getNewsFromDB();
    
    if (news !== undefined) {
      const res = await fetch(news.url);
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SECRET_KEY}&cx=${process.env.GOOGLE_SEARCH_CX}&q=site:cbc.ca OR site:globalnews.ca BC Wildfire`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error('Failed to get news');
      }
      
      if (data.items.length !== 0) {
        await storeS3(data);
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();
  
  const messages = body.messages;
  const paragraphs = body.paragraphs;
  const images = body.images;

  const fullPrompt = [
    ...messages,
    {
      role: "user",
      content: `Here's the main content:\n\n${paragraphs}\n\n images: ${images} \n\n Please make the paragraphs and images into HTML by right order. Plus, please provide me the plain html without any context in it.`,
    },
  ]

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: fullPrompt,
  });

  const theResponse = completion.choices[0].message;
  
  console.log('output from openai: ', theResponse);

  return NextResponse.json({ output: theResponse }, { status: 200 });
}

async function storeS3(data: any) {

    const signedURLRequest = await getSignedURL(data);

    const { url } = signedURLRequest.success;

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const errorText = await res.text();
        console.error("S3 Upload Error:", errorText);
    }
}