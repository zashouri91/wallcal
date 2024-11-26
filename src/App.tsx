import { useState, useCallback, useEffect } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { Calendar } from '@/components/Calendar/Calendar';
import { CalendarHeader } from '@/components/Calendar/CalendarHeader';
import { UpcomingEvents } from '@/components/Calendar/UpcomingEvents';
import { ThemeProvider } from '@/components/theme-provider';
import { fetchICalEvents } from '@/lib/calendar';
import { useToast } from '@/hooks/use-toast';

const initialCalendars = [
  {
    id: '1',
    name: 'Personal',
    color: '#3b82f6',
    enabled: true,
  },
  {
    id: '2',
    name: 'Work',
    color: '#10b981',
    enabled: true,
  },
  {
    id: '3',
    name: 'Family',
    color: '#f59e0b',
    enabled: true,
  },
];

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [calendars, setCalendars] = useState(initialCalendars);
  const [icalUrl, setIcalUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    location?: string;
    calendarId: string;
  }>>([]);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!icalUrl) return;
    
    try {
      const fetchedEvents = await fetchICalEvents(icalUrl);
      setEvents(fetchedEvents.map(event => ({
        ...event,
        calendarId: '1', // Using Personal calendar for now
      })));
      console.log('Calendar updated:', fetchedEvents.length, 'events');
      toast({
        title: 'Calendar Updated',
        description: `Successfully synced ${fetchedEvents.length} events`,
      });
    } catch (error) {
      console.error('Failed to update calendar:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync calendar events',
        variant: 'destructive',
      });
    }
  }, [icalUrl, toast]);

  useEffect(() => {
    if (!icalUrl) return;

    fetchEvents();
    const pollInterval = setInterval(fetchEvents, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [icalUrl, fetchEvents]);

  const handleDateChange = (direction: number) => {
    if (view === 'month') {
      setDate(direction > 0 ? addMonths(date, 1) : subMonths(date, 1));
    } else {
      setDate(direction > 0 ? addWeeks(date, 1) : subWeeks(date, 1));
    }
  };

  const handleViewChange = (newView: 'month' | 'week') => {
    setView(newView);
  };

  const handleTodayClick = () => {
    setDate(new Date());
  };

  const handleIcalConnect = useCallback(async (url: string) => {
    try {
      const events = await fetchICalEvents(url);
      setIcalUrl(url);
      
      toast({
        title: 'Calendar Connected',
        description: `Successfully imported ${events.length} events`,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to the iCal calendar',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const toggleCalendar = (calendarId: string) => {
    setCalendars(prevCalendars =>
      prevCalendars.map(cal =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      )
    );
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-white">
        <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-[2000px]">
          <div className="flex flex-col space-y-6">
            <div className="w-full">
              <CalendarHeader
                date={date}
                view={view}
                onViewChange={handleViewChange}
                onDateChange={handleDateChange}
                onTodayClick={handleTodayClick}
                onIcalConnect={handleIcalConnect}
                calendars={calendars}
                onToggleCalendar={toggleCalendar}
              />
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border shadow-sm w-full"
                calendars={calendars}
                view={view}
                events={events}
              />
            </div>

            <div className="w-full">
              <UpcomingEvents
                calendars={calendars}
                selectedDate={date}
                events={events}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}