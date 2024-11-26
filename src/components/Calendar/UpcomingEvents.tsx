import { format, isToday, isTomorrow } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  calendar: string;
  calendarColor: string;
}

interface UpcomingEventsProps {
  calendars: Array<{
    id: string;
    name: string;
    color: string;
    enabled: boolean;
  }>;
  selectedDate: Date;
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Weekly Sync',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Conference Room A',
    calendar: 'Work',
    calendarColor: '#10b981',
  },
  {
    id: '2',
    title: 'Dentist Appointment',
    date: new Date(),
    startTime: '14:30',
    endTime: '15:30',
    location: 'Dental Clinic',
    calendar: 'Personal',
    calendarColor: '#3b82f6',
  },
  {
    id: '3',
    title: "Sarah's Birthday Party",
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: '18:00',
    endTime: '21:00',
    location: 'Central Park',
    calendar: 'Family',
    calendarColor: '#f59e0b',
  },
];

export function UpcomingEvents({ calendars, selectedDate }: UpcomingEventsProps) {
  const enabledCalendars = calendars.filter(cal => cal.enabled).map(cal => cal.name);
  const filteredEvents = mockEvents.filter(event => enabledCalendars.includes(event.calendar));

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getDateLabel(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <Badge
                  style={{ backgroundColor: event.calendarColor }}
                  className="text-white"
                >
                  {event.calendar}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}