
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, UserCog, Briefcase, ScaleIcon,
  UserRound, ClipboardCheck
} from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEdit = () => {
  const { user } = useAuth();
  const { users, refetch } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user, form]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      // Here we would typically use an API call to update the user profile.
      // For now, we'll update the local storage to simulate profile changes
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || user.avatarUrl,
      };
      
      // Update in localStorage
      localStorage.setItem('courtwise_user', JSON.stringify(updatedUser));
      
      // Refresh data context to update UI
      refetch();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate a professional avatar based on user role
  const generateProfessionalAvatar = () => {
    let avatarUrl = "";
    
    // Set avatars based on role
    switch(user.role) {
      case "lawyer":
        avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=lawyer&backgroundColor=b6e3f4&accessories=prescription01&clothingGraphic=skull&top=shortWaved&hairColor=black";
        break;
      case "judge":
        avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=judge&accessories=prescription02&clothingGraphic=diamond&top=shortCurly&hairColor=auburn&facialHairType=beardMedium";
        break;
      case "clerk":
        avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=clerk&accessories=round&clothingGraphic=bear&top=bob&hairColor=brown";
        break;
      case "client":
      default:
        avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=client&top=longHair&accessoriesChance=50";
        break;
    }
    
    form.setValue('avatarUrl', avatarUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Your profile picture is visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch('avatarUrl')} />
              <AvatarFallback>
                {user.role === "lawyer" && <Briefcase className="h-8 w-8 text-primary" />}
                {user.role === "judge" && <ScaleIcon className="h-8 w-8 text-primary" />}
                {user.role === "clerk" && <ClipboardCheck className="h-8 w-8 text-primary" />}
                {user.role === "client" && <UserRound className="h-8 w-8 text-primary" />}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              onClick={generateProfessionalAvatar}
              type="button"
              className="w-full"
            >
              Generate Professional Avatar
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEdit;
