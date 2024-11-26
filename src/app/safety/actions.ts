import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function chatHandler(message: string) {
    try {
        
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: "system", content: 'Answer the questions about the BC wildfire and if the question is not about the BC wildfire, just return please try again message.' },
            { role: "user", content: message } 
        ],
      });

      const result = completion.choices[0].message;
      return result;
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
     return { error: 'Error fetching response from OpenAI' };
    }
}
