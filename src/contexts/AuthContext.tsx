import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "tenant" | "owner" | "agent" | "vendor" | "technician" | "admin" | null;

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city_id: string | null;
  is_verified: boolean;
}

interface WalletBalance {
  cashback: number;
  referral: number;
  ownerDiscount: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  wallet: WalletBalance;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  selectRole: (role: UserRole) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  updateWallet: (type: keyof WalletBalance, amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletBalance>({
    cashback: 0,
    referral: 0,
    ownerDiscount: 0,
  });

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data as Profile | null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Fetch user role
  const fetchRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching role:", error);
        return null;
      }
      return (data?.role as UserRole) || null;
    } catch (error) {
      console.error("Error fetching role:", error);
      return null;
    }
  };

  // Fetch wallet balance for tenant
  const fetchWallet = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("tenant_profiles")
        .select("wallet_balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (data?.wallet_balance) {
        setWallet({
          cashback: data.wallet_balance,
          referral: 0,
          ownerDiscount: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
    const userRole = await fetchRole(user.id);
    setRole(userRole);
    if (userRole === "tenant") {
      await fetchWallet(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer profile fetching with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            const userRole = await fetchRole(session.user.id);
            setRole(userRole);
            if (userRole === "tenant") {
              await fetchWallet(session.user.id);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setWallet({ cashback: 0, referral: 0, ownerDiscount: 0 });
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        const userRole = await fetchRole(session.user.id);
        setRole(userRole);
        if (userRole === "tenant") {
          await fetchWallet(session.user.id);
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setWallet({ cashback: 0, referral: 0, ownerDiscount: 0 });
  };

  const selectRole = async (selectedRole: UserRole) => {
    if (!user || !selectedRole) {
      return { error: new Error("No user or role provided") };
    }

    try {
      // Insert the role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role: selectedRole,
        });

      if (roleError) {
        console.error("Error inserting role:", roleError);
        return { error: roleError };
      }

      // Create role-specific profile
      let roleProfileError = null;

      switch (selectedRole) {
        case "tenant":
          const { error: tenantError } = await supabase
            .from("tenant_profiles")
            .insert({ user_id: user.id });
          roleProfileError = tenantError;
          break;
        case "owner":
          const { error: ownerError } = await supabase
            .from("owner_profiles")
            .insert({ user_id: user.id });
          roleProfileError = ownerError;
          break;
        case "agent":
          const { error: agentError } = await supabase
            .from("agent_profiles")
            .insert({ user_id: user.id });
          roleProfileError = agentError;
          break;
        case "vendor":
          const { error: vendorError } = await supabase
            .from("vendor_profiles")
            .insert({ user_id: user.id });
          roleProfileError = vendorError;
          break;
        case "technician":
          const { error: techError } = await supabase
            .from("technician_profiles")
            .insert({ user_id: user.id });
          roleProfileError = techError;
          break;
      }

      if (roleProfileError) {
        console.error("Error creating role profile:", roleProfileError);
        return { error: roleProfileError };
      }

      setRole(selectedRole);
      return { error: null };
    } catch (error) {
      console.error("Error selecting role:", error);
      return { error: error as Error };
    }
  };

  const updateWallet = (type: keyof WalletBalance, amount: number) => {
    setWallet((prev) => ({
      ...prev,
      [type]: prev[type] + amount,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        wallet,
        isLoading,
        isAuthenticated: !!user && !!role,
        signUp,
        signIn,
        signOut,
        selectRole,
        refreshProfile,
        updateWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
