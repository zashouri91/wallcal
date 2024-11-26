import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isToday, isSameMonth, startOfMonth, startOfWeek, isSameDay } from 'date-fns';
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
}

interface Event {
  id: string;
  title: string;
  date: Date;
  calendar: string;
}

// Mock events data
const events: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(),
    calendar: 'Work'
  },
  {
    id: '2',
    title: 'Dentist',
    date: new Date(),
    calendar: 'Personal'
  },
  {
    id: '3',
    title: 'Birthday Party',
    date: addDays(new Date(), 2),
    calendar: 'Family'
  }
];

export function Calendar({
  mode,
  selected,
  onSelect,
  className,
  view,
  calendars
}: CalendarProps) {
  const enabledCalendars = calendars.filter(cal => cal.enabled).map(cal => cal.name);
  const filteredEvents = events.filter(event => enabledCalendars.includes(event.calendar));

  const currentDate = selected || new Date();
  
  const getDaysToDisplay = () => {
    if (view === 'month') {
      const firstDayOfMonth = startOfMonth(currentDate);
      const lastDayOfMonth = endOfMonth(currentDate);
      
      const startDate = startOfWeek(firstDayOfMonth);
      const endDate = endOfWeek(lastDayOfMonth);

      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const startDate = startOfWeek(currentDate);
      const endDate = endOfWeek(currentDate);

      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  const days = getDaysToDisplay();
  const weeks = Array.from(
    { length: Math.ceil(days.length / 7) },
    (_, i) => days.slice(i * 7, (i + 1) * 7)
  );

  return (
    <div className={cn("p-4", className)}>
      <div className="grid grid-cols-7 h-full auto-rows-fr gap-px bg-border rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="flex items-center justify-center bg-muted p-2 text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const dayEvents = filteredEvents.filter(event => 
              isSameDay(event.date, date)
            );

            const isSelected = selected && isSameDay(date, selected);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isPadding = view === 'month' && !isCurrentMonth;

            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelect?.(date)}
                className={cn(
                  "relative h-full w-full flex flex-col items-stretch p-1 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
                  isPadding && "bg-muted/50",
                  !isPadding && "bg-background",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isPadding && "text-muted-foreground",
                  isToday(date) && !isSelected && "border-2 border-primary",
                  view === 'week' && "min-h-[200px]"
                )}
              >
                <span className={cn(
                  "absolute top-1 right-1 text-sm",
                  isSelected && "text-primary-foreground"
                )}>
                  {format(date, "d")}
                </span>
                <div className="mt-6 space-y-1">
                  {dayEvents.map((event) => {
                    const calendar = calendars.find(cal => cal.name === event.calendar);
                    return (
                      <div
                        key={event.id}
                        className="text-xs truncate rounded px-1 py-0.5"
                        style={{ 
                          backgroundColor: calendar?.color,
                          color: 'white'
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}