import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  LogIn,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  ArrowLeft,
  TrendingUp,
  MessageCircle,
} from "lucide-react";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const { signIn, signInWithGoogle, signInWithTelegram, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotMode) {
        const { error } = await resetPassword(identifier);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setForgotMode(false);
          setIdentifier("");
          toast({
            title: "Reset email sent",
            description: "Check your email for password reset instructions.",
          });
        }
      } else {
        // Determine if identifier is email or username
        const isEmail = identifier.includes("@");
        const credentials = isEmail 
          ? { email: identifier, password }
          : { email: identifier, password }; // For now, treat as email. We'll enhance this later.

        const { error } = await signIn(identifier, password, rememberMe);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate("/dashboard");
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



  const handleTelegramSignIn = async () => {
    await signInWithTelegram();
    toast({
      title: "Telegram Login",
      description: "Complete the process in the Telegram bot that just opened.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-forex-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {forgotMode ? "Reset Password" : "Welcome Back"}
            </CardTitle>
            <div className="flex items-center justify-center space-x-2 text-forex-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">FREE FOREX SIGNALS</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {forgotMode ? (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="h-12 w-12 text-forex-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Forgot your password?
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setForgotMode(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </form>
            </div>
          ) : (
            <>
              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full flex items-center space-x-3 py-6"
                  disabled={loading}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>

                <Button
                  onClick={handleTelegramSignIn}
                  variant="outline"
                  className="w-full flex items-center space-x-3 py-6 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Continue with Telegram</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Email/Username Login */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="your@email.com or username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-forex-600 text-sm"
                    onClick={() => setForgotMode(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-forex-600 hover:bg-forex-700"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>{loading ? "Signing in..." : "Sign In"}</span>
                  </div>
                </Button>
              </form>
            </>
          )}

          <div className="text-center text-sm">
            <span className="text-gray-600">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="text-forex-600 hover:text-forex-700 font-medium"
            >
              Create account
            </Link>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
