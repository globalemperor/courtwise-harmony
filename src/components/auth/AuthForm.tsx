import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gavel, User, UserCog, Scale } from "lucide-react";
import axios from "axios";

// Deprecated: This component is no longer used.
// AuthForm functionality has been split into SignInForm and SignUpForm components.
// This file remains for reference but should be removed in future refactoring.

export const AuthForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [role, setRole] = useState<UserRole>("Client" as UserRole); // Explicitly cast "Client" to UserRole

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: UserRole) => {
    setRole(value);
  };

  const handleRegister = async () => {
    try {
      const url = `http://localhost:5432/api/auth/register/${role.toLowerCase()}/`;
      const response = await axios.post(url, formData);
      toast({ description: response.data.message, variant: "default" });
      localStorage.setItem("courtwise_session", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error) {
      toast({
        description:
          "Registration Failed: " +
          (error.response?.data?.message || error.message), // Improved error message
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    try {
      const url = `http://localhost:5432/api/auth/login/${role.toLowerCase()}/`;
      console.log("url", url, JSON.stringify(formData));
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast({ description: response.data.message, variant: "default" });
      localStorage.setItem("courtwise_session", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        description:
          "Login Failed: " +
          (error.response?.data?.message || error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Auth Form</CardTitle>
          <CardDescription>
            Register or Login based on your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Lawyer">Lawyer</SelectItem>
              <SelectItem value="Clerk">Clerk</SelectItem>
              <SelectItem value="Judge">Judge</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          {/* Add additional fields dynamically based on role */}
          <Button onClick={handleRegister}>Register</Button>
          <Button onClick={handleLogin}>Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const handleLogin = async (
  email: string,
  password: string,
  role: UserRole
) => {
  try {
    const url = `http://localhost:5432/api/auth/login/${role.toLowerCase()}`;
    const response = await axios.post(
      url,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { error: null, data: response.data };
  } catch (error: any) {
    return {
      error: {
        message:
          error.response?.data?.message || error.message || "Unknown error",
      },
    };
  }
};
