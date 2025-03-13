
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Calendar, FileText, Home, Inbox, LayoutDashboard, 
  LogOut, Menu, Users, Gavel, Briefcase, Search, 
  UserPlus, ClipboardList
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center py-3 px-4 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors',
        isActive && 'bg-sidebar-accent font-medium'
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  let menuItems = [];

  // Common items for all roles
  const commonItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Inbox, label: 'Messages', href: '/messages' },
  ];

  // Role-specific items
  switch (user.role) {
    case 'client':
      menuItems = [
        ...commonItems,
        { icon: FileText, label: 'My Cases', href: '/cases' },
        { icon: Search, label: 'Find Lawyer', href: '/find-lawyer' },
        { icon: Calendar, label: 'Hearings', href: '/hearings' },
      ];
      break;
    case 'lawyer':
      menuItems = [
        ...commonItems,
        { icon: Briefcase, label: 'Cases', href: '/cases' },
        { icon: Calendar, label: 'Hearings', href: '/hearings' },
        { icon: ClipboardList, label: 'Case Requests', href: '/case-requests' },
        { icon: Users, label: 'Clients', href: '/clients' },
      ];
      break;
    case 'clerk':
      menuItems = [
        ...commonItems,
        { icon: FileText, label: 'All Cases', href: '/cases' },
        { icon: Calendar, label: 'Schedule', href: '/schedule' },
        { icon: UserPlus, label: 'New Cases', href: '/new-cases' },
      ];
      break;
    case 'judge':
      menuItems = [
        ...commonItems,
        { icon: Gavel, label: 'My Docket', href: '/docket' },
        { icon: Calendar, label: 'Hearings', href: '/hearings' },
        { icon: FileText, label: 'Case Summary', href: '/case-summary' },
      ];
      break;
    default:
      menuItems = commonItems;
  }

  return (
    <div
      className={cn(
        'h-screen bg-sidebar transition-all duration-300 border-r border-sidebar-border flex flex-col',
        isCollapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className="flex justify-between items-center h-16 px-4 border-b border-sidebar-border">
        {!isCollapsed && <h1 className="text-xl font-semibold text-sidebar-foreground">CourtWise</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        </button>
      </div>

      <div className="flex flex-col flex-grow p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <img
            src={user.avatarUrl || 'https://ui-avatars.com/api/?name=User'}
            alt={user.name}
            className="h-8 w-8 rounded-full mr-3"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate capitalize">
                {user.role}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={cn(
            'mt-4 flex items-center py-2 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
};
