import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { prompt, context } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://dinerforged.netlify.app',
        'X-Title': 'Dinerforged Culinary OS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-versatile:free',
        messages: [
          {
            role: 'system',
            content: `You are Chef Dinerforged, an expert culinary scientist and AI companion. Provide clear, precise advice on culinary techniques, ingredient substitutions, wine pairings, and food science troubleshooting. Active Recipe Context: ${context || 'None'}. Keep answers helpful, concise, and structured.`,
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Chef is currently reviewing ingredients. Please try again in a moment!';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Serverless Execution Failed' }),
    };
  }
};