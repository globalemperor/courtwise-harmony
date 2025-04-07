
import { Hearing, Case } from "@/types";
import { toast } from "@/hooks/use-toast";

class NotificationService {
  private static instance: NotificationService;
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private notifiedHearings: Set<string> = new Set();

  private constructor() {
    // Private constructor to prevent multiple instances
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public setupHearingReminders(hearings: Hearing[], cases: Case[]): void {
    // Clear any existing timers
    this.clearAllTimers();
    
    const now = new Date();
    
    hearings.forEach(hearing => {
      // Skip past hearings
      const hearingDateTime = new Date(`${hearing.date}T${hearing.time}`);
      if (hearingDateTime <= now) return;
      
      // Find the related case
      const relatedCase = cases.find(c => c.id === hearing.caseId);
      const caseTitle = relatedCase?.title || `Case #${hearing.caseId}`;
      
      // Set up one day reminder
      const oneDayBefore = new Date(hearingDateTime);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);
      
      if (oneDayBefore > now) {
        const oneDayTimeoutMs = oneDayBefore.getTime() - now.getTime();
        const oneDayTimerId = setTimeout(() => {
          this.showHearingReminder(hearing, caseTitle, "tomorrow");
        }, oneDayTimeoutMs);
        
        this.timers.set(`${hearing.id}_day`, oneDayTimerId);
      }
      
      // Set up one hour reminder
      const oneHourBefore = new Date(hearingDateTime);
      oneHourBefore.setHours(oneHourBefore.getHours() - 1);
      
      if (oneHourBefore > now) {
        const oneHourTimeoutMs = oneHourBefore.getTime() - now.getTime();
        const oneHourTimerId = setTimeout(() => {
          this.showHearingReminder(hearing, caseTitle, "in 1 hour");
        }, oneHourTimeoutMs);
        
        this.timers.set(`${hearing.id}_hour`, oneHourTimerId);
      }
    });
  }
  
  private showHearingReminder(hearing: Hearing, caseTitle: string, timeFrame: string): void {
    const notificationId = `${hearing.id}_${timeFrame}`;
    
    // Prevent duplicate notifications
    if (this.notifiedHearings.has(notificationId)) return;
    this.notifiedHearings.add(notificationId);
    
    toast({
      title: `Upcoming Hearing ${timeFrame}`,
      description: `${caseTitle} at ${hearing.time} in ${hearing.location}`,
      duration: 10000, // Show for 10 seconds
    });
  }
  
  private clearAllTimers(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
  
  // Method to manually trigger a reminder for testing
  public testReminder(hearing: Hearing, caseTitle: string, timeFrame: string): void {
    this.showHearingReminder(hearing, caseTitle, timeFrame);
  }
}

export default NotificationService;
