
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Users, 
  UserCheck, 
  Gavel,
  Briefcase,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  shown: boolean;
  setShown: (shown: boolean) => void;
}

const Sidebar = ({ shown, setShown }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShown(!shown);
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center space-x-3 p-3 rounded-md transition-colors
      ${isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-accent"}
      ${!shown && !isMobile ? "justify-center px-2" : ""}`;
  };

  const renderLinkText = (text: string) => {
    return shown || isMobile ? <span>{text}</span> : null;
  };

  return (
    <aside className={`
      court-sidebar bg-background h-screen flex flex-col border-r 
      transition-all duration-300 overflow-hidden
      ${shown ? 'w-64' : 'w-16'}
      ${isMobile ? 'fixed z-50 shadow-lg' : 'relative'}
      ${isMobile && !shown ? '-translate-x-full' : 'translate-x-0'}
    `}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {(shown || isMobile) && <span className="font-bold text-lg">CourtWise</span>}
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-accent"
        >
          {shown ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`
              flex items-center space-x-3 cursor-pointer
              ${!shown && !isMobile ? "justify-center" : ""}
            `}>
              <Avatar>
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {(shown || isMobile) && (
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <NavLink to="/dashboard" className={getNavLinkClass}>
          <LayoutDashboard size={20} />
          {renderLinkText("Dashboard")}
        </NavLink>

        {user?.role === 'client' && (
          <>
            <NavLink to="/cases" className={getNavLinkClass}>
              <FileText size={20} />
              {renderLinkText("My Cases")}
            </NavLink>
            <NavLink to="/find-lawyer" className={getNavLinkClass}>
              <Briefcase size={20} />
              {renderLinkText("Find Lawyer")}
            </NavLink>
          </>
        )}

        {user?.role === 'lawyer' && (
          <>
            <NavLink to="/cases" className={getNavLinkClass}>
              <FileText size={20} />
              {renderLinkText("Cases")}
            </NavLink>
            <NavLink to="/file-case" className={getNavLinkClass}>
              <FileText size={20} />
              {renderLinkText("File a Case")}
            </NavLink>
            <NavLink to="/case-requests" className={getNavLinkClass}>
              <UserCheck size={20} />
              {renderLinkText("Case Requests")}
            </NavLink>
            <NavLink to="/clients" className={getNavLinkClass}>
              <Users size={20} />
              {renderLinkText("Clients")}
            </NavLink>
          </>
        )}

        {user?.role === 'clerk' && (
          <>
            <NavLink to="/new-cases" className={getNavLinkClass}>
              <FileText size={20} />
              {renderLinkText("New Cases")}
            </NavLink>
            <NavLink to="/hearings" className={getNavLinkClass}>
              <Calendar size={20} />
              {renderLinkText("Hearings")}
            </NavLink>
          </>
        )}

        {user?.role === 'judge' && (
          <>
            <NavLink to="/docket" className={getNavLinkClass}>
              <FileText size={20} />
              {renderLinkText("My Docket")}
            </NavLink>
            <NavLink to="/case-summary" className={getNavLinkClass}>
              <Gavel size={20} />
              {renderLinkText("Case Summary")}
            </NavLink>
          </>
        )}

        <NavLink to="/messages" className={getNavLinkClass}>
          <MessageSquare size={20} />
          {renderLinkText("Messages")}
        </NavLink>

        <NavLink to="/schedule" className={getNavLinkClass}>
          <Calendar size={20} />
          {renderLinkText("Schedule")}
        </NavLink>
      </nav>

      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className={`w-full ${!shown && !isMobile ? "px-2" : ""}`}
        >
          <LogOut size={20} />
          {(shown || isMobile) && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
