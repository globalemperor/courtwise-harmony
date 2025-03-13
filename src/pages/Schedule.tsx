
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Schedule = () => {
  const { hearings, cases } = useData();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Get the start and end of the current week
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter hearings for the current week
  const weekHearings = hearings.filter(hearing => {
    const hearingDate = new Date(hearing.date);
    return hearingDate >= weekStart && hearingDate <= weekEnd;
  });

  // Group hearings by date
  const hearingsByDate = weekDays.map(day => {
    const dayHearings = weekHearings.filter(hearing => {
      return isSameDay(new Date(hearing.date), day);
    });
    
    return {
      date: day,
      hearings: dayHearings.sort((a, b) => a.time.localeCompare(b.time))
    };
  });

  // Navigate to previous/next week
  const prevWeek = () => setDate(addDays(weekStart, -7));
  const nextWeek = () => setDate(addDays(weekStart, 7));
  const today = () => setDate(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Court Schedule</h1>
        <p className="text-muted-foreground">Manage and view court calendar</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "MMMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate || new Date());
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {hearingsByDate.map(({ date, hearings }) => (
          <Card key={date.toISOString()} className="min-h-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-center">
                {format(date, "EEE")}
              </CardTitle>
              <p className="text-sm text-center font-medium">
                {format(date, "d")}
              </p>
            </CardHeader>
            <CardContent className="p-2">
              {hearings.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-xs text-muted-foreground">
                  No hearings
                </div>
              ) : (
                <div className="space-y-2">
                  {hearings.map(hearing => {
                    const relatedCase = cases.find(c => c.id === hearing.caseId);
                    
                    return (
                      <div 
                        key={hearing.id} 
                        className="p-2 text-xs rounded-md bg-muted/60 border border-border"
                      >
                        <div className="font-medium truncate">
                          {relatedCase?.title || `Case #${hearing.caseId}`}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{hearing.time}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{hearing.location}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="mt-1 w-full justify-center"
                        >
                          {hearing.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
