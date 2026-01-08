import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Mail, Lock, User, ArrowRight, Eye, EyeOff, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const TEST_ACCOUNTS: { role: AppRole; label: string; icon: string }[] = [
  { role: "tenant", label: "Tenant", icon: "🏠" },
  { role: "owner", label: "Owner", icon: "🔑" },
  { role: "agent", label: "Agent", icon: "👔" },
  { role: "vendor", label: "Vendor", icon: "🛠️" },
  { role: "technician", label: "Technician", icon: "🔧" },
  { role: "admin", label: "Admin", icon: "👑" },
];

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creatingTestAccount, setCreatingTestAccount] = useState<AppRole | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const { signIn, signUp, user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      if (role) {
        navigateToDashboard(role);
      } else {
        navigate("/select-role");
      }
    }
  }, [user, role, isLoading, navigate]);

  const navigateToDashboard = (userRole: string) => {
    switch (userRole) {
      case "tenant":
        navigate("/tenant/dashboard");
        break;
      case "owner":
        navigate("/owner/dashboard");
        break;
      case "agent":
        navigate("/agent/dashboard");
        break;
      case "vendor":
        navigate("/vendor/dashboard");
        break;
      case "technician":
        navigate("/technician/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (mode === "signup") {
      try {
        nameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0].message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("Please verify your email before logging in.");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Welcome back!");
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists. Please login instead.");
            setMode("login");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Account created! Please select your role.");
        navigate("/select-role");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const createTestAccount = async (roleType: AppRole) => {
    setCreatingTestAccount(roleType);
    const timestamp = Date.now();
    const testEmail = `test.${roleType}.${timestamp}@rentpe.test`;
    const testPassword = "Test@123456";
    const testName = `Test ${roleType.charAt(0).toUpperCase() + roleType.slice(1)}`;

    try {
      // Sign up the test user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: testName }
        }
      });

      if (signUpError) {
        toast.error(`Failed to create test account: ${signUpError.message}`);
        return;
      }

      if (!signUpData.user) {
        toast.error("Failed to create test account");
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: signUpData.user.id,
          email: testEmail,
          full_name: testName,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      // Assign role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: signUpData.user.id,
          role: roleType,
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
      }

      // Create role-specific profile
      const profileTable = `${roleType}_profiles` as const;
      if (roleType !== "admin") {
        const { error: roleProfileError } = await supabase
          .from(profileTable as any)
          .insert({ user_id: signUpData.user.id });

        if (roleProfileError) {
          console.error("Role profile creation error:", roleProfileError);
        }
      }

      toast.success(
        <div className="space-y-1">
          <p className="font-medium">Test {roleType} account created!</p>
          <p className="text-sm text-muted-foreground">Email: {testEmail}</p>
          <p className="text-sm text-muted-foreground">Password: {testPassword}</p>
        </div>,
        { duration: 10000 }
      );

      // Auto-fill the login form
      setEmail(testEmail);
      setPassword(testPassword);
      setMode("login");
    } catch (error) {
      console.error("Test account creation error:", error);
      toast.error("Failed to create test account");
    } finally {
      setCreatingTestAccount(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-foreground">
              Rent<span className="text-accent">Pe</span>
            </span>
          </div>
          <p className="text-muted-foreground">India's Smart Living Operating System</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to access your dashboard"
                : "Join RentPe to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "login" && (
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:underline block"
              >
                Forgot your password?
              </Link>
            )}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Quick Test Accounts Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Quick Test Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TEST_ACCOUNTS.map(({ role: roleType, label, icon }) => (
                <Button
                  key={roleType}
                  variant="outline"
                  size="sm"
                  onClick={() => createTestAccount(roleType)}
                  disabled={creatingTestAccount !== null}
                  className="text-xs flex flex-col items-center gap-1 h-auto py-2"
                >
                  {creatingTestAccount === roleType ? (
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-lg">{icon}</span>
                  )}
                  <span>{label}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click to create a test account with pre-assigned role
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to RentPe's{" "}
            <a href="/terms" className="text-accent hover:underline">Terms</a> and{" "}
            <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
