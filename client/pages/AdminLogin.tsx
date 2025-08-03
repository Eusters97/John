import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  TrendingUp,
  Settings,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const { adminSignIn, resetPassword, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin-panel");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotMode) {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setForgotMode(false);
          setEmail("");
          toast({
            title: "Reset email sent",
            description: "Check your email for password reset instructions.",
          });
        }
      } else {
        const { error } = await adminSignIn(email, password, rememberMe);
        if (error) {
          toast({
            title: "Access denied",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate("/admin-panel");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-forex-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-4xl relative z-10 shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {forgotMode ? "Reset Password" : "Admin Access"}
            </CardTitle>
            <div className="flex items-center justify-center space-x-2 text-forex-100">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">FREE FOREX SIGNALS</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {forgotMode ? (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="h-12 w-12 text-forex-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Forgot your password?
                </h3>
                <p className="text-gray-300 text-sm">
                  Enter your admin email address and we'll send you a reset
                  link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-gray-200">
                    Admin Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="admin@forexsignals.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => setForgotMode(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            </div>
          ) : (
            <>
              {/* Demo Credentials Info */}
              <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-4">
                <div className="text-center mb-3">
                  <h3 className="text-blue-300 font-semibold text-sm">
                    Demo Admin Credentials
                  </h3>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Email:</span>
                    <code className="text-blue-300">
                      admin@forextraderssignals.com
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Password:</span>
                    <code className="text-blue-300">Demo@2024!</code>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setEmail("admin@forextraderssignals.com");
                    setPassword("Demo@2024!");
                  }}
                  className="w-full mt-3 bg-blue-600/50 hover:bg-blue-600/70 text-white text-xs"
                  type="button"
                >
                  Use Demo Credentials
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@forexsignals.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm text-gray-300"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-forex-400 text-sm hover:text-forex-300"
                    onClick={() => setForgotMode(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>
                      {loading ? "Verifying..." : "Access Admin Panel"}
                    </span>
                  </div>
                </Button>
              </form>
            </>
          )}

          <div className="text-center">
            <Button
              variant="link"
              className="text-gray-400 hover:text-gray-300 text-sm"
              onClick={() => navigate("/")}
            >
              ← Back to Main Site
            </Button>
          </div>

          <div className="border-t border-white/20 pt-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Secure Admin Access</span>
              </div>
              <div className="text-yellow-300/80 text-xs mt-1">
                This area is restricted to authorized administrators only.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
