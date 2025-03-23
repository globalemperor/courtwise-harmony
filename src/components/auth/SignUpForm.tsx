
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Gavel, User, UserCog, Scale, PenLine } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const lawyerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  barId: z.string().min(3, "Bar ID is required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  specialization: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const clerkSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  courtId: z.string().min(3, "Court ID is required"),
  department: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const judgeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  chamberNumber: z.string().min(1, "Chamber number is required"),
  courtDistrict: z.string().min(2, "Court district is required"),
  yearsOnBench: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const getSchemaForRole = (role: UserRole) => {
  switch (role) {
    case 'client': return clientSchema;
    case 'lawyer': return lawyerSchema;
    case 'clerk': return clerkSchema;
    case 'judge': return judgeSchema;
    default: return clientSchema;
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

interface SignUpFormProps {
  defaultRole?: UserRole;
}

export const SignUpForm = ({ defaultRole = "client" }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(getSchemaForRole(role)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      barId: "",
      yearsOfExperience: "",
      specialization: "",
      courtId: "",
      department: "",
      chamberNumber: "",
      courtDistrict: "",
      yearsOnBench: "",
    }
  });

  const onRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    form.reset(form.getValues());
    form.clearErrors();
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { name, email, password } = data;
      const userData = {
        name,
        role,
        // Add other profile fields based on role
        ...(role === 'lawyer' && { 
          barId: data.barId,
          yearsOfExperience: data.yearsOfExperience,
          specialization: data.specialization 
        }),
        ...(role === 'clerk' && { 
          courtId: data.courtId,
          department: data.department 
        }),
        ...(role === 'judge' && { 
          chamberNumber: data.chamberNumber,
          courtDistrict: data.courtDistrict,
          yearsOnBench: data.yearsOnBench 
        })
      };
      
      const { error } = await signup(email, password, userData);
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        navigate("/dashboard");
        toast({
          title: "Account created",
          description: "Welcome to CourtWise!",
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: (error as Error).message || "Please try again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create a new {getRoleTitle(role)} account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>I am a</Label>
              <Select
                value={role}
                onValueChange={(value) => onRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {role === 'lawyer' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="barId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bar ID</FormLabel>
                        <FormControl>
                          <Input placeholder="BAR12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Corporate Law" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {role === 'clerk' && (
              <>
                <FormField
                  control={form.control}
                  name="courtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court ID</FormLabel>
                      <FormControl>
                        <Input placeholder="COURT12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Civil Division" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {role === 'judge' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="chamberNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chamber Number</FormLabel>
                        <FormControl>
                          <Input placeholder="A-123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsOnBench"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years on Bench</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="courtDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court District</FormLabel>
                      <FormControl>
                        <Input placeholder="Southern District" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-court-blue hover:bg-court-blue-dark"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to={`/login/${role}`} className="text-court-blue hover:underline font-medium">
                  Sign in as a {getRoleTitle(role)}
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
