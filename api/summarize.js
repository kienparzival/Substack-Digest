import OpenAI from 'openai';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Validate request body
    if (!req.body) {
      console.error('No request body received');
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { url } = req.body;
    
    if (!url) {
      console.error('URL not provided in request body');
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      console.error('Invalid URL format:', url);
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log('Fetching content from:', url);
    
    // Fetch the webpage content
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch URL:', response.status, response.statusText);
      return res.status(400).json({ error: `Failed to fetch URL: ${response.status}` });
    }
    
    const html = await response.text();
    
    // Parse HTML and extract text content
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style').remove();
    
    // Extract text from article content
    let content = '';
    
    // Try to find article content in common Substack selectors
    const articleSelectors = [
      '.post-content',
      '.entry-content',
      '.post-body',
      'article',
      '.content',
      '.post',
      '[data-testid="post-content"]'
    ];
    
    for (const selector of articleSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        break;
      }
    }
    
    // If no specific article content found, get body text
    if (!content) {
      content = $('body').text().trim();
    }
    
    // Clean up the content
    content = content.replace(/\s+/g, ' ').substring(0, 4000);
    
    if (!content) {
      console.error('No content extracted from URL');
      return res.status(400).json({ error: 'Could not extract content from the URL' });
    }

    console.log('Content extracted, length:', content.length);
    
    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise, engaging summaries of Substack articles. Focus on the main points, key insights, and actionable takeaways. Keep the summary clear and well-structured."
        },
        {
          role: "user",
          content: `Please summarize this Substack article in a clear, engaging way:\n\n${content}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;
    
    console.log('Summary generated successfully');
    res.status(200).json({ summary });
    
  } catch (error) {
    console.error('Error in API function:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
} 