
import { Hearing, User } from "@/types";
import { toast } from "sonner";

export class HearingNotificationService {
  private static instance: HearingNotificationService;
  private notifiedHearings: Set<string> = new Set();
  private checkInterval: number = 60 * 1000; // Check every minute
  private intervalId: number | null = null;

  private constructor() {
    // Private constructor to prevent direct construction calls
  }

  public static getInstance(): HearingNotificationService {
    if (!HearingNotificationService.instance) {
      HearingNotificationService.instance = new HearingNotificationService();
    }
    return HearingNotificationService.instance;
  }

  public startNotificationService(hearings: Hearing[], currentUser: User | null) {
    if (this.intervalId) {
      this.stopNotificationService();
    }

    this.intervalId = window.setInterval(() => {
      this.checkUpcomingHearings(hearings, currentUser);
    }, this.checkInterval);

    // Do an initial check immediately
    this.checkUpcomingHearings(hearings, currentUser);
  }

  public stopNotificationService() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkUpcomingHearings(hearings: Hearing[], currentUser: User | null) {
    if (!currentUser) return;

    const now = new Date();
    const userHearings = hearings.filter(hearing => {
      // Filter to hearings that involve the current user
      // This is a simplified check - in a real app you'd check if the user is a participant
      return hearing.participants?.includes(currentUser.id) || true;
    });

    userHearings.forEach(hearing => {
      const hearingDate = new Date(`${hearing.date}T${hearing.time}`);
      const timeDiff = hearingDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Notification 1 day before
      if (
        hoursDiff <= 24 && 
        hoursDiff > 23 && 
        !this.notifiedHearings.has(`${hearing.id}_day`)
      ) {
        this.notifyUser(hearing, "day");
        this.notifiedHearings.add(`${hearing.id}_day`);
      }

      // Notification 1 hour before
      if (
        hoursDiff <= 1 && 
        hoursDiff > 0 && 
        !this.notifiedHearings.has(`${hearing.id}_hour`)
      ) {
        this.notifyUser(hearing, "hour");
        this.notifiedHearings.add(`${hearing.id}_hour`);
      }
    });
  }

  private notifyUser(hearing: Hearing, type: "day" | "hour") {
    const timeString = type === "day" ? "tomorrow" : "in 1 hour";
    
    toast.warning(`Upcoming Hearing ${timeString}`, {
      description: `${hearing.description} at ${hearing.location} - ${hearing.date} ${hearing.time}`,
      duration: 10000,
      action: {
        label: "View Details",
        onClick: () => {
          // Navigate to hearing details - in a real app, we'd use a router
          window.location.href = `/hearings/${hearing.id}`;
        },
      },
    });

    // Send browser notification if permissions are granted
    if (Notification.permission === "granted") {
      new Notification(`Upcoming Hearing ${timeString}`, {
        body: `${hearing.description} at ${hearing.location} - ${hearing.date} ${hearing.time}`,
        icon: "/favicon.ico"
      });
    }
  }

  // Request notification permissions
  public static requestNotificationPermission() {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }
}

// Utility function to easily access the service
export const useHearingNotifications = () => {
  return HearingNotificationService.getInstance();
};
