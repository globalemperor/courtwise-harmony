
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, FileText, MessagesSquare, Calendar, Users, 
  GanttChartSquare, ScaleIcon, PenSquare, LogOut, UserCog,
  Menu, X, Syringe,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";

const Sidebar = ({ shown, setShown }: { shown: boolean, setShown: (shown: boolean) => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  const [open, setOpen] = useState(true);
  
  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      roles: ["client", "lawyer", "clerk", "judge"],
    },
    {
      title: "Cases",
      icon: <FileText className="h-5 w-5" />,
      href: "/cases",
      roles: ["client", "lawyer", "clerk", "judge"],
    },
    {
      title: "Messages",
      icon: <MessagesSquare className="h-5 w-5" />,
      href: "/messages",
      roles: ["client", "lawyer", "clerk", "judge"],
    },
    {
      title: "Hearings",
      icon: <Calendar className="h-5 w-5" />,
      href: "/hearings",
      roles: ["client", "lawyer", "clerk", "judge"],
    },
    {
      title: "Clients",
      icon: <Users className="h-5 w-5" />,
      href: "/clients",
      roles: ["lawyer"],
    },
    {
      title: "Find Lawyer",
      icon: <Syringe className="h-5 w-5" />,
      href: "/find-lawyer",
      roles: ["client"],
    },
    {
      title: "Case Requests",
      icon: <PenSquare className="h-5 w-5" />,
      href: "/case-requests",
      roles: ["lawyer"],
    },
    {
      title: "File Case",
      icon: <PenSquare className="h-5 w-5" />,
      href: "/file-case",
      roles: ["lawyer"],
    },
    {
      title: "Docket",
      icon: <GanttChartSquare className="h-5 w-5" />,
      href: "/docket",
      roles: ["judge"],
    },
    {
      title: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      href: "/schedule",
      roles: ["clerk", "judge"],
    },
    {
      title: "Case Summary",
      icon: <ScaleIcon className="h-5 w-5" />,
      href: "/case-summary",
      roles: ["judge"],
    },
    {
      title: "New Cases",
      icon: <FileText className="h-5 w-5" />,
      href: "/new-cases",
      roles: ["clerk"],
    },
  ];
  
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  
  return (
    <Collapsible
      open={shown}
      onOpenChange={setShown}
      className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r bg-background"
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <ScaleIcon className="mr-2 h-6 w-6" />
          <span className="text-lg font-semibold">CourtWise</span>
        </Link>
        {isMobile && (
          <CollapsibleTrigger asChild className="ml-auto">
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {filteredMenuItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className="justify-start"
              asChild
              onClick={() => isMobile && setShown(false)}
            >
              <Link to={item.href}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={() => {
              navigate("/profile/edit");
              if (isMobile) setShown(false);
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
            onClick={() => {
              logout();
              if (isMobile) setShown(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </Collapsible>
  );
};

export default Sidebar;
