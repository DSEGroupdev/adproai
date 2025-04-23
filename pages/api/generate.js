import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
          content: "You are an expert copywriter. Generate ad copy and format the response as a JSON object with the following structure: { 'headline': 'your headline here', 'body': 'your body copy here', 'cta': 'your call to action here' }"
        },
        {
          role: "user",
          content: `Create ad copy for ${product}, targeting ${audience} with a ${tone} tone. USP: ${usp}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const adCopy = JSON.parse(completion.choices[0].message.content);
    
    if (!adCopy.headline || !adCopy.body || !adCopy.cta) {
      throw new Error('Invalid response format from OpenAI');
    }

    const result = `Headline: ${adCopy.headline}\n\nBody: ${adCopy.body}\n\nCall to Action: ${adCopy.cta}`;
    return res.status(200).json({ result });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 