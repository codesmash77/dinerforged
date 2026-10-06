import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('[AI Chef] OPENROUTER_API_KEY environment variable is not defined.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OPENROUTER_API_KEY is missing on Netlify.' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://dinerforged.netlify.app',
        'X-Title': 'Dinerforged PWA',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [
          {
            role: 'system',
            content: 'You are Chef Dinerforged, an expert culinary assistant. Provide clear, structured, and helpful answers for culinary questions, ingredient substitutions, and troubleshooting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[AI Chef OpenRouter Error]', JSON.stringify(data));
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data?.error?.message || 'OpenRouter API Error' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || 'Chef has no response right now.',
      }),
    };
  } catch (error: any) {
    console.error('[AI Chef Exception]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};