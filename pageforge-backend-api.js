// PageForge Backend API - server.js
// Deploy this on Vercel, Railway, or any Node.js hosting

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes per IP
  message: 'Too many requests, please try again later.'
});

app.use('/api/generate', limiter);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, formData } = req.body;

    if (!prompt || !formData) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and formData' 
      });
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.8, // Higher temperature for more creative variations
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract the text content from Claude's response
    const responseText = message.content[0].text;
    
    // Try to parse as JSON
    let parsedContent;
    try {
      // Remove any markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawResponse: responseText
      });
    }

    // Return the parsed content
    res.json({
      success: true,
      content: parsedContent,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Payment webhook endpoint (for Stripe integration)
app.post('/api/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  // Stripe webhook handler - implement based on your payment provider
  // This would handle subscription payments, usage tracking, etc.
  res.json({ received: true });
});

// User usage tracking endpoint
app.post('/api/usage', async (req, res) => {
  // Track user generations for billing/limits
  // Store in your database (MongoDB, PostgreSQL, etc.)
  const { userId, pageGenerated } = req.body;
  
  // TODO: Implement database storage
  // await db.users.updateOne({ id: userId }, { $inc: { generationsUsed: 1 } });
  
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PageForge API running on port ${PORT}`);
  console.log(`📝 API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});

export default app;
