import { parseISO } from 'date-fns';

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
    const response = await fetch(url);
    const icalData = await response.text();
    
    // Basic iCal parsing (in a real app, use a proper iCal parser library)
    const events = icalData
      .split('BEGIN:VEVENT')
      .slice(1)
      .map(eventStr => {
        const event: Partial<ICalEvent> = {
          id: extractValue(eventStr, 'UID:'),
          title: extractValue(eventStr, 'SUMMARY:'),
          description: extractValue(eventStr, 'DESCRIPTION:'),
          location: extractValue(eventStr, 'LOCATION:'),
          url: extractValue(eventStr, 'URL:'),
        };

        const dtStart = extractValue(eventStr, 'DTSTART:');
        const dtEnd = extractValue(eventStr, 'DTEND:');

        if (dtStart) event.startDate = parseISO(dtStart);
        if (dtEnd) event.endDate = parseISO(dtEnd);

        return event as ICalEvent;
      });

    return events;
  } catch (error) {
    console.error('Failed to fetch iCal events:', error);
    throw new Error('Failed to fetch calendar events');
  }
}

function extractValue(eventStr: string, key: string): string {
  const match = eventStr.match(new RegExp(`${key}([^\r\n]+)`));
  return match ? match[1].trim() : '';
}