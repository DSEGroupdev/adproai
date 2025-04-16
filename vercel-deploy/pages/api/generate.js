export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Input validation
    const { productName, audience, usps, tone = 'Persuasive' } = req.body;

    if (!productName?.trim() || !audience?.trim() || !usps?.trim()) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          productName: !productName?.trim() ? 'Product name is required' : null,
          audience: !audience?.trim() ? 'Target audience is required' : null,
          usps: !usps?.trim() ? 'Unique selling points are required' : null
        }
      });
    }

    // Input sanitization
    const sanitizedInputs = {
      productName: productName.trim(),
      audience: audience.trim(),
      usps: usps.trim(),
      tone: tone.trim()
    };

    const prompt = `You are an elite performance marketer and ad copywriter.
Your goal is to write a high-converting ad for:

Product/Service: ${sanitizedInputs.productName}
Target Audience: ${sanitizedInputs.audience}
Unique Selling Points: ${sanitizedInputs.usps}
Tone: ${sanitizedInputs.tone}

Structure the response like this:

Headline:
[Write a powerful 1-line headline that grabs attention]

Ad Copy:
[Write 2-3 persuasive sentences that highlight benefits]

Call to Action:
[Write a strong, motivating CTA encouraging them to take action]`;

    // API call with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!completion.ok) {
      const errorData = await completion.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await completion.json();
    
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse the structured response
    const responseText = result.choices[0].message.content;
    const sections = responseText.split('\n\n');
    
    const structuredResponse = {
      headline: sections.find(s => s.startsWith('Headline:'))?.replace('Headline:', '').trim() || '',
      adCopy: sections.find(s => s.startsWith('Ad Copy:'))?.replace('Ad Copy:', '').trim() || '',
      callToAction: sections.find(s => s.startsWith('Call to Action:'))?.replace('Call to Action:', '').trim() || '',
      raw: responseText
    };

    // Rate limiting - 5 requests per minute
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', '4');
    res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + 60);

    return res.status(200).json({
      success: true,
      data: structuredResponse,
      metadata: {
        model: 'gpt-4',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Request timeout',
        message: 'The request took too long to complete'
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
} 