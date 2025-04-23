import { openai } from './config';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { product, audience, usp, tone } = req.body;

  if (!product || !audience || !usp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const prompt = `Create a compelling ad copy for the following:
Product/Service: ${product}
Target Audience: ${audience}
Unique Selling Points: ${usp}
Tone: ${tone || 'professional'}

Please provide:
1. A catchy headline (max 60 characters)
2. Ad body copy (max 90 words)
3. A strong call to action (max 30 characters)

Format the response as a JSON object with "headline", "body", and "cta" fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in creating high-converting ad copy. Your responses should be concise, compelling, and formatted as JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    
    if (!response.headline || !response.body || !response.cta) {
      throw new Error('Invalid response format from OpenAI');
    }

    return res.status(200).json({ 
      result: `Headline: ${response.headline}\n\nBody: ${response.body}\n\nCall to Action: ${response.cta}` 
    });
  } catch (error) {
    console.error('Error generating ad copy:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 