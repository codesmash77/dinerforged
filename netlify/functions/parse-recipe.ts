import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { imageBase64, rawText } = JSON.parse(event.body || '{}');

    let messages: any[] = [
      {
        role: 'system',
        content: `You are a culinary vision OCR extractor. Parse the provided input into a valid, raw JSON object matching this TypeScript interface without markdown formatting:
{
  "title": string,
  "cuisine": string,
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "baseServings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "ingredients": [{ "id": string, "name": string, "amount": number, "unit": string, "category": string }],
  "instructions": string[]
}`,
      },
    ];

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'Scan this image of ingredients/recipe and extract a structured JSON recipe.' },
          { type: 'image_url', image_url: { url: imageBase64 } },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: `Parse this raw recipe text into JSON:\n${rawText}`,
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://dinerforged.netlify.app',
        'X-Title': 'Dinerforged Vision OCR',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages,
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    const cleanedJson = rawContent.replace(/```json|```/g, '').trim();
    const recipeObject = JSON.parse(cleanedJson);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe: recipeObject }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse recipe input' }),
    };
  }
};