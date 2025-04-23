import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    console.error(`Method ${req.method} Not Allowed`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { product, audience, usp, tone } = req.body;

    if (!product || !audience || !usp || !tone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter. Generate JSON formatted ad copy. Include a compelling headline, persuasive body text, and a strong call to action. Return ONLY valid JSON with these exact fields: 'headline', 'body', and 'cta'."
        },
        {
          role: "user",
          content: `Create ad copy for ${product}, targeting ${audience} with a ${tone} tone. USP: ${usp}. Remember to return only valid JSON with headline, body, and cta fields.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const adCopy = JSON.parse(completion.choices[0].message.content);
    
    if (!adCopy.headline || !adCopy.body || !adCopy.cta) {
      throw new Error('Invalid response format from OpenAI');
    }

    return res.status(200).json(adCopy);
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out' });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    return res.status(error.status || 500).json({ 
      error: 'Failed to generate ad copy',
      details: error.message
    });
  }
} 