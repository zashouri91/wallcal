import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsMenu } from './SettingsMenu';
import { CalendarSelect } from './CalendarSelect';

interface CalendarHeaderProps {
  date: Date;
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
  onDateChange: (direction: number) => void;
  onTodayClick: () => void;
  onIcalConnect: (url: string) => void;
  calendars: Array<{ id: string; name: string; color: string; enabled: boolean; }>;
  onToggleCalendar: (id: string) => void;
}

export function CalendarHeader({
  date,
  view,
  onViewChange,
  onDateChange,
  onTodayClick,
  onIcalConnect,
  calendars,
  onToggleCalendar,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            {format(date, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d, yyyy")}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => onDateChange(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onTodayClick}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDateChange(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-lg">
            <Button
              variant={view === 'month' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('week')}
            >
              <List className="h-4 w-4 mr-1" />
              Week
            </Button>
          </div>
          <SettingsMenu onIcalConnect={onIcalConnect} />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <CalendarSelect calendars={calendars} onToggleCalendar={onToggleCalendar} />
      </div>
    </div>
  );
}