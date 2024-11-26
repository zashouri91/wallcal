import ICAL from 'ical.js';
import { parseISO, isValid } from 'date-fns';

export interface ICalEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}

export async function fetchICalEvents(url: string): Promise<ICalEvent[]> {
  try {
    // Convert webcal:// to https:// and handle CORS
    const httpsUrl = url.replace(/^webcal:\/\//i, 'https://');
    console.log('Fetching calendar from:', httpsUrl);
    
    // Use Vercel serverless function as proxy
    const proxyUrl = import.meta.env.PROD 
      ? 'https://wallcal.vercel.app/api/proxy'  // Replace with your actual Vercel URL
      : 'http://localhost:3000/api/proxy';
      
    const fetchUrl = `${proxyUrl}?url=${encodeURIComponent(httpsUrl)}`;

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const icalData = await response.text();
    console.log('Received iCal data, parsing...');

    // Parse the iCal data using ical.js
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    console.log(`Found ${vevents.length} events`);

    const events: ICalEvent[] = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      
      // Parse dates safely
      const startDate = event.startDate ? event.startDate.toJSDate() : null;
      const endDate = event.endDate ? event.endDate.toJSDate() : null;
      
      // Fallback to string parsing if ical.js date parsing fails
      const fallbackStartDate = parseISO(event.startDate?.toString() || '');
      const fallbackEndDate = parseISO(event.endDate?.toString() || '');

      return {
        id: event.uid || crypto.randomUUID(),
        title: event.summary || 'Untitled Event',
        description: event.description || undefined,
        startDate: isValid(startDate) ? startDate : fallbackStartDate,
        endDate: isValid(endDate) ? endDate : fallbackEndDate,
        location: event.location || undefined,
        url: event.url || undefined
      };
    }).filter(event => 
      // Filter out invalid events
      event.title && 
      isValid(event.startDate) && 
      isValid(event.endDate)
    );

    console.log(`Successfully parsed ${events.length} valid events`);
    return events;
  } catch (error) {
    console.error('Failed to fetch or parse iCal events:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch calendar events');
  }
}