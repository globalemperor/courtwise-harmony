
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarShown, setSidebarShown] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${sidebarShown ? 'ml-0' : 'ml-0'}`}>
      <Sidebar shown={sidebarShown} setShown={setSidebarShown} />
      <main className={`flex-1 transition-all duration-300 ${sidebarShown ? 'md:ml-72' : 'ml-0'} p-6 overflow-auto`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
