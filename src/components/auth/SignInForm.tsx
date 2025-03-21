
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Gavel, User, UserCog, Scale } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Role icon component
const RoleIcon = ({ role }: { role: UserRole }) => {
  switch (role) {
    case 'client':
      return <User className="h-10 w-10 text-blue-500" />;
    case 'lawyer':
      return <Scale className="h-10 w-10 text-green-500" />;
    case 'clerk':
      return <UserCog className="h-10 w-10 text-purple-500" />;
    case 'judge':
      return <Gavel className="h-10 w-10 text-red-500" />;
    default:
      return null;
  }
};

const getRoleTitle = (role: UserRole) => {
  switch (role) {
    case 'client': return "Client";
    case 'lawyer': return "Lawyer";
    case 'clerk': return "Clerk";
    case 'judge': return "Judge";
  }
};

interface SignInFormProps {
  role: UserRole;
}

export const SignInForm = ({ role }: SignInFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, role);
      navigate("/dashboard");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fadeIn">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-court-gray flex items-center justify-center">
            <RoleIcon role={role} />
          </div>
        </div>
        <CardTitle className="text-2xl">{getRoleTitle(role)} Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your {getRoleTitle(role).toLowerCase()} account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={`${role}@example.com`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    For demo: Use "{role}@example.com" with password "password"
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-court-blue hover:bg-court-blue-dark"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to={`/login/signup?role=${role}`} className="text-court-blue hover:underline font-medium">
                  Sign up as a {getRoleTitle(role)}
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
