
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel, User, UserCog, Scale } from "lucide-react";

// Deprecated: This component is no longer used. 
// AuthForm functionality has been split into SignInForm and SignUpForm components.
// This file remains for reference but should be removed in future refactoring.

export const AuthForm = () => {
  const { toast } = useToast();
  toast({
    title: "Component deprecated",
    description: "This component is no longer in use. Please use SignInForm or SignUpForm instead.",
    variant: "destructive"
  });
  
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Redirecting...</CardTitle>
          <CardDescription>
            This component has been deprecated. You will be redirected to the new login page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/login" className="text-blue-500 hover:underline">
            Go to Login Page
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
