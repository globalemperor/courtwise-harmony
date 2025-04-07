
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FlexibleCalendarProps {
  viewMode: "day" | "week" | "month" | "custom";
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  highlightedDates?: string[];
}

export const FlexibleCalendar: React.FC<FlexibleCalendarProps> = ({ 
  viewMode, 
  selectedDate,
  onDateSelect,
  highlightedDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    let days: Date[] = [];
    
    switch (viewMode) {
      case "day":
        days = [selectedDate];
        break;
      case "week":
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        break;
      case "month":
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        
        let day = startDate;
        while (day <= endDate) {
          days.push(day);
          day = addDays(day, 1);
        }
        break;
      case "custom":
        // For custom, we'll just show 30 days from current date
        days = Array.from({ length: 30 }, (_, i) => addDays(selectedDate, i));
        break;
    }
    
    setCalendarDays(days);
  }, [viewMode, selectedDate, currentMonth]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const isDateHighlighted = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return highlightedDates.includes(dateString);
  };

  return (
    <div className="border rounded-lg shadow-sm">
      {viewMode === "month" && (
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {viewMode === "month" && (
        <div className="grid grid-cols-7 gap-0 border-b">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
      )}
      
      <ScrollArea className={viewMode === "month" ? "" : "max-h-72"}>
        <div className={`
          grid 
          ${viewMode === "day" ? 'grid-cols-1' : ''} 
          ${viewMode === "week" ? 'grid-cols-7' : ''} 
          ${viewMode === "month" ? 'grid-cols-7' : ''}
          ${viewMode === "custom" ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : ''}
        `}>
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const hasHearings = isDateHighlighted(day);
            
            return (
              <div 
                key={index}
                className={`
                  p-2 border ${viewMode !== "month" || isCurrentMonth ? '' : 'bg-muted/20 text-muted-foreground'}
                  ${isToday ? 'bg-muted/30' : ''}
                  ${isSelected ? 'bg-primary/10 border-primary' : ''}
                  cursor-pointer hover:bg-muted/30 transition-colors relative
                `}
                onClick={() => onDateSelect(day)}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                    {format(day, viewMode === "day" ? 'EEEE, MMMM d' : 'd')}
                  </span>
                  {hasHearings && (
                    <span className="h-2 w-2 bg-primary rounded-full absolute top-1 right-1"></span>
                  )}
                </div>
                
                {viewMode === "day" && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    • Tap to view details
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
