import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{ error: any }>;
  signup: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  canCommunicateWith: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAllUsers = () => {
  try {
    const clerks = JSON.parse(
      localStorage.getItem("courtwise_users_clerks") || "[]"
    );
    const clients = JSON.parse(
      localStorage.getItem("courtwise_users_clients") || "[]"
    );
    const lawyers = JSON.parse(
      localStorage.getItem("courtwise_users_lawyers") || "[]"
    );
    const judges = JSON.parse(
      localStorage.getItem("courtwise_users_judges") || "[]"
    );

    return [
      ...clerks.map((clerk: any) => ({ ...clerk, role: "clerk" as UserRole })),
      ...clients.map((client: any) => ({
        ...client,
        role: "client" as UserRole,
      })),
      ...lawyers.map((lawyer: any) => ({
        ...lawyer,
        role: "lawyer" as UserRole,
      })),
      ...judges.map((judge: any) => ({ ...judge, role: "judge" as UserRole })),
    ];
  } catch (error) {
    console.error("Error parsing user data:", error);
    return [];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedSession = localStorage.getItem("courtwise_session");

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const storedUserData = localStorage.getItem("courtwise_user");

          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } else {
            const allUsers = getAllUsers();
            const userFromJson = allUsers.find((u) => u.id === session.user.id);

            if (userFromJson) {
              setUser(userFromJson);
              localStorage.setItem(
                "courtwise_user",
                JSON.stringify(userFromJson)
              );
            }
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("courtwise_session");
          localStorage.removeItem("courtwise_user");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const allUsers = getAllUsers();
      const user = allUsers.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (!user) {
        return {
          error: { message: "Invalid email, password, or role" },
        };
      }

      const session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        access_token: `mock_token_${Date.now()}`,
      };

      localStorage.setItem("courtwise_session", JSON.stringify(session));
      localStorage.setItem("courtwise_user", JSON.stringify(user));

      setUser(user);
      return { error: null, data: session };
    } catch (error) {
      console.error("Login error:", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        ...userData,
      };

      const usersKey = `courtwise_users_${userData.role}s`;
      const users = JSON.parse(localStorage.getItem(usersKey) || "[]");
      users.push(newUser);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return { error: null };
    } catch (error) {
      console.error("Signup error:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("courtwise_session");
      localStorage.removeItem("courtwise_user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("courtwise_user", JSON.stringify(userData));

    const usersKey = `courtwise_users_${userData.role}s`;
    try {
      const users = JSON.parse(localStorage.getItem(usersKey) || "[]");
      const updatedUsers = users.map((u: User) =>
        u.id === userData.id ? userData : u
      );
      localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
    } catch (error) {
      console.error(`Error updating user in ${usersKey}:`, error);
    }
  };

  // Function to determine if the current user can communicate with a given role
  const canCommunicateWith = (role: UserRole): boolean => {
    if (!user) return false;

    // Define communication rules
    switch (user.role) {
      case "client":
        // Clients can only communicate with lawyers
        return role === "lawyer";
      case "lawyer":
        // Lawyers can communicate with clients and clerks, but not judges directly
        return role === "client" || role === "clerk";
      case "clerk":
        // Clerks can communicate with lawyers and judges
        return role === "lawyer" || role === "judge";
      case "judge":
        // Judges can only communicate with clerks
        return role === "clerk";
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        canCommunicateWith,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
