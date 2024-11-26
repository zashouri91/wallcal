import { addDays, format, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
  calendarId: string;
}

interface UpcomingEventsProps {
  calendars: Array<{
    id: string;
    name: string;
    color: string;
    enabled: boolean;
  }>;
  selectedDate: Date;
  events: Array<{
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    location?: string;
    calendarId: string;
  }>;
}

export function UpcomingEvents({ calendars, selectedDate, events }: UpcomingEventsProps) {
  const upcomingEvents = events
    .filter(event => {
      const calendar = calendars.find(cal => cal.id === event.calendarId);
      if (!calendar?.enabled) return false;

      // Show events that:
      // 1. Start after the selected date
      // 2. End after the selected date but started before it
      return (
        isAfter(new Date(event.startDate), selectedDate) ||
        (isBefore(new Date(event.startDate), selectedDate) && isAfter(new Date(event.endDate), selectedDate))
      );
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5); // Show only next 5 events

  if (upcomingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No upcoming events</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map(event => {
            const calendar = calendars.find(cal => cal.id === event.calendarId);
            return (
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
                        <span>{format(new Date(event.startDate), 'MMM d, h:mm a')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(event.endDate), 'h:mm a')}</span>
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
                    style={{ backgroundColor: calendar?.color }}
                    className="text-white"
                  >
                    {calendar?.name}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}