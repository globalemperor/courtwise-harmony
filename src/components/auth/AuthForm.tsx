
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel, User, UserCog, Scale, Loader2 } from "lucide-react";

// Role icon mapping component
const RoleIcon = ({ role }: { role: UserRole }) => {
  switch (role) {
    case 'client':
      return <User className="h-5 w-5 mr-2 text-blue-500" />;
    case 'lawyer':
      return <Scale className="h-5 w-5 mr-2 text-green-500" />;
    case 'clerk':
      return <UserCog className="h-5 w-5 mr-2 text-purple-500" />;
    case 'judge':
      return <Gavel className="h-5 w-5 mr-2 text-red-500" />;
    default:
      return null;
  }
};

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<UserRole>("client");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("client");

  // Form errors
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    // Basic validation
    if (!loginEmail.trim()) {
      setLoginError("Email is required");
      return;
    }
    
    if (!loginPassword) {
      setLoginError("Password is required");
      return;
    }
    
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword, loginRole);
      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error in form handler:", error);
      // The error toast is already shown in the login function
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    
    // Basic form validation
    if (!signupName.trim()) {
      setSignupError("Name is required");
      return;
    }

    if (!signupEmail.trim()) {
      setSignupError("Email is required");
      return;
    }

    if (!signupEmail.includes('@')) {
      setSignupError("Please enter a valid email address");
      return;
    }

    if (!signupPassword) {
      setSignupError("Password is required");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting signup with:", signupName, signupEmail, signupRole);
      await signup(signupName, signupEmail, signupPassword, signupRole);
      console.log("Signup successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error in form handler:", error);
      // The error toast is already shown in the signup function
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {loginError && (
                <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-role">User Type</Label>
                <Select
                  value={loginRole}
                  onValueChange={(value) => setLoginRole(value as UserRole)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="login-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        Client
                      </div>
                    </SelectItem>
                    <SelectItem value="lawyer">
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-2 text-green-500" />
                        Lawyer
                      </div>
                    </SelectItem>
                    <SelectItem value="clerk">
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-2 text-purple-500" />
                        Clerk
                      </div>
                    </SelectItem>
                    <SelectItem value="judge">
                      <div className="flex items-center">
                        <Gavel className="h-4 w-4 mr-2 text-red-500" />
                        Judge
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {signupError && (
                <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm">
                  {signupError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-role">User Type</Label>
                <Select
                  value={signupRole}
                  onValueChange={(value) => setSignupRole(value as UserRole)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="signup-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        Client
                      </div>
                    </SelectItem>
                    <SelectItem value="lawyer">
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-2 text-green-500" />
                        Lawyer
                      </div>
                    </SelectItem>
                    <SelectItem value="clerk">
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-2 text-purple-500" />
                        Clerk
                      </div>
                    </SelectItem>
                    <SelectItem value="judge">
                      <div className="flex items-center">
                        <Gavel className="h-4 w-4 mr-2 text-red-500" />
                        Judge
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
