import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Calendar {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

interface CalendarSelectProps {
  calendars: Calendar[];
  onToggleCalendar: (id: string) => void;
}

export function CalendarSelect({ calendars, onToggleCalendar }: CalendarSelectProps) {
  const enabledCount = calendars.filter(cal => cal.enabled).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <div className="flex -space-x-1">
            {calendars
              .filter(cal => cal.enabled)
              .slice(0, 3)
              .map(cal => (
                <div
                  key={cal.id}
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: cal.color }}
                />
              ))}
          </div>
          {enabledCount > 3 && <span className="text-sm">+{enabledCount - 3}</span>}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {calendars.map((calendar) => (
          <DropdownMenuCheckboxItem
            key={calendar.id}
            checked={calendar.enabled}
            onCheckedChange={() => onToggleCalendar(calendar.id)}
            className="gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: calendar.color }}
            />
            {calendar.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}