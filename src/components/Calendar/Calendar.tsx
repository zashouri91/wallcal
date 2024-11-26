import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isToday, isSameMonth, startOfMonth, startOfWeek, isSameDay, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarProps {
  mode: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  view: 'month' | 'week';
  calendars: Array<{
    id: string;
    name: string;
    color: string;
    enabled: boolean;
  }>;
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

export function Calendar({
  mode,
  selected,
  onSelect,
  className,
  view,
  calendars,
  events,
}: CalendarProps) {
  const today = new Date();

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const calendar = calendars.find(cal => cal.id === event.calendarId);
      if (!calendar?.enabled) return false;
      
      return isWithinInterval(date, {
        start: new Date(event.startDate),
        end: new Date(event.endDate)
      });
    });
  };

  const days = view === 'month'
    ? eachDayOfInterval({
        start: startOfWeek(startOfMonth(selected || today)),
        end: endOfWeek(endOfMonth(selected || today))
      })
    : eachDayOfInterval({
        start: startOfWeek(selected || today),
        end: endOfWeek(selected || today)
      });

  return (
    <div className={cn("p-3", className)}>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, dayIdx) => {
          const dayEvents = getEventsForDate(day);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[100px] p-2 relative border border-gray-200",
                isToday(day) && "bg-blue-50",
                !isSameMonth(day, selected || today) && view === 'month' && "text-gray-400 bg-gray-50",
                "hover:bg-gray-100 cursor-pointer"
              )}
              onClick={() => onSelect?.(day)}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={cn(
                  "ml-auto font-semibold",
                  selected && isSameDay(day, selected) && "text-blue-600"
                )}
              >
                {format(day, 'd')}
              </time>
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {dayEvents.map(event => {
                  const calendar = calendars.find(cal => cal.id === event.calendarId);
                  return (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: calendar?.color + '20', color: calendar?.color }}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}