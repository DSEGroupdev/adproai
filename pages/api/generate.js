import { openai, sendResponse, handleError } from './config';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate request method
  if (req.method !== 'POST') {
    return sendResponse(res, 405, { error: 'Method not allowed' });
  }

  try {
    const { product, audience, usp, tone } = req.body;

    // Validate required fields
    if (!product?.trim() || !audience?.trim() || !usp?.trim()) {
      return sendResponse(res, 400, {
        error: 'Missing required fields',
        details: {
          product: !product?.trim() ? 'Product is required' : null,
          audience: !audience?.trim() ? 'Target audience is required' : null,
          usp: !usp?.trim() ? 'Unique selling points are required' : null
        }
      });
    }

    // Prepare sanitized inputs
    const sanitizedInputs = {
      product: product.trim(),
      audience: audience.trim(),
      usp: usp.trim(),
      tone: tone?.trim() || 'professional'
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
          content: "You are an expert copywriter specializing in creating high-converting ad copy. Your responses should be concise, compelling, and formatted as JSON with exactly these fields: headline, body, and cta."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    let response;
    try {
      response = JSON.parse(completion.choices[0].message.content);
      
      if (!response.headline || !response.body || !response.cta) {
        throw new Error('Invalid response format from OpenAI - missing required fields');
      }
    } catch (error) {
      return sendResponse(res, 500, {
        error: 'Error processing AI response',
        details: error.message
      });
    }

    // Set rate limiting headers
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', '4');
    res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + 60);

    return sendResponse(res, 200, response);
  } catch (error) {
    return handleError(res, error);
  }
} 