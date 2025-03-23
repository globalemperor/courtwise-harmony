
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, FileText, MessagesSquare, Calendar, Users, 
  GanttChartSquare, ScaleIcon, PenSquare, LogOut, UserCog,
  Menu, ChevronLeft, Briefcase, Gavel, UserRound, ClipboardCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = ({ shown, setShown }: { shown: boolean, setShown: (shown: boolean) => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
      icon: <Briefcase className="h-5 w-5" />,
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
      icon: <UserRound className="h-5 w-5" />,
      href: "/find-lawyer",
      roles: ["client"],
    },
    {
      title: "Case Requests",
      icon: <ClipboardCheck className="h-5 w-5" />,
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
      icon: <FileText className="h-5 w-5" />,
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
    <>
      {/* Mobile menu toggle button - visible only on mobile */}
      {!shown && isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShown(true)}
          className="fixed z-50 left-4 top-4 md:hidden bg-white shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar backdrop - only on mobile */}
      {shown && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShown(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`${
          shown ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative z-50 h-full w-72 border-r bg-white shadow-sm transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center">
            <ScaleIcon className="mr-2 h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">CourtWise</span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShown(false)}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShown(!shown)}
            className="hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-3.5rem-5rem)]">
          <nav className="grid gap-1 px-2 py-4">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={`justify-start ${!shown && !isMobile ? 'w-10 px-2 mx-auto' : 'w-full'}`}
                asChild
                onClick={() => isMobile && setShown(false)}
              >
                <Link to={item.href} className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {(shown || isMobile) && <span className="ml-2">{item.title}</span>}
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
            {(shown || isMobile) && (
              <div className="grid gap-0.5 text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            )}
          </div>
          <div className={`grid ${(shown || isMobile) ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
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
              {(shown || isMobile) && "Edit Profile"}
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
              {(shown || isMobile) && "Logout"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
