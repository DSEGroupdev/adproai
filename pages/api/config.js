import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API response helper
export function sendResponse(res, statusCode, data) {
  res.status(statusCode).json(data);
}

// Error handler
export function handleError(res, error) {
  console.error('API Error:', error);
  return sendResponse(res, 500, {
    error: 'Error processing request',
    message: error.message
  });
} 