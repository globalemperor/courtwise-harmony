
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

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
    <div className="court-layout">
      <Sidebar shown={sidebarShown} setShown={setSidebarShown} />
      <main className={`court-main ${!sidebarShown ? 'expanded' : ''}`}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
