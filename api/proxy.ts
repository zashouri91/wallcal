import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      response.status(200).end();
      return;
    }

    const { url } = request.query;

    if (!url || typeof url !== 'string') {
      response.status(400).json({ error: 'URL parameter is required' });
      return;
    }

    // Convert webcal:// to https:// if necessary
    const httpsUrl = url.replace(/^webcal:\/\//i, 'https://');

    const calendarResponse = await fetch(httpsUrl);
    
    if (!calendarResponse.ok) {
      throw new Error(`Failed to fetch calendar: ${calendarResponse.statusText}`);
    }

    const calendarData = await calendarResponse.text();

    response.setHeader('Content-Type', 'text/calendar');
    response.status(200).send(calendarData);
  } catch (error) {
    console.error('Proxy error:', error);
    response.status(500).json({ 
      error: 'Failed to fetch calendar',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
