import { NextResponse } from 'next/server';

export async function POST(request) {

    const { prompt } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    console.log(response)

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenAI API');
    }

    const data = await response.json();
    console.log("res data")
    console.log(data)
    return NextResponse.json(data);
}
