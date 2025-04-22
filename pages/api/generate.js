import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Input validation
    const { product, audience, usp, tone } = req.body;

    if (!product?.trim() || !audience?.trim() || !usp?.trim()) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          product: !product?.trim() ? 'Product is required' : null,
          audience: !audience?.trim() ? 'Target audience is required' : null,
          usp: !usp?.trim() ? 'Unique selling points are required' : null
        }
      });
    }

    // Input sanitization
    const sanitizedInputs = {
      product: product.trim(),
      audience: audience.trim(),
      usp: usp.trim(),
      tone: tone.trim()
    };

    const prompt = `Create a compelling ad copy for the following:
Product/Service: ${sanitizedInputs.product}
Target Audience: ${sanitizedInputs.audience}
Unique Selling Points: ${sanitizedInputs.usp}
Tone: ${sanitizedInputs.tone}

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

    // Rate limiting - 5 requests per minute
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', '4');
    res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + 60);

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating ad copy:', error);
    res.status(500).json({ error: 'Error generating ad copy' });
  }
} 