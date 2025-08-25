import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  ArrowLeft,
  TrendingUp,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        if (error.message?.includes("not available") || error.message?.includes("not configured")) {
          toast({
            title: "Password Reset Unavailable",
            description: "For password reset assistance, please contact our support team at support@forexsignals.com",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Reset Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setSuccess(true);
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            {success ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <Lock className="h-8 w-8 text-white" />
            )}
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {success ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <div className="flex items-center justify-center space-x-2 text-forex-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">FREE FOREX SIGNALS</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Email Sent Successfully!</p>
                <p className="text-green-700 text-sm mt-1">
                  We've sent password reset instructions to {email}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>• Check your email inbox and spam folder</p>
                <p>• Click the reset link in the email</p>
                <p>• Follow the instructions to set a new password</p>
              </div>

              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                Send Another Email
              </Button>
            </div>
          ) : (
            <>
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
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-forex-600 hover:bg-forex-700" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              {/* Alternative support message */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium mb-1">Need Help?</p>
                    <p className="text-blue-700">
                      If you're having trouble resetting your password, contact our support team at{" "}
                      <a 
                        href="mailto:support@forexsignals.com" 
                        className="underline font-medium"
                      >
                        support@forexsignals.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>

            <div className="text-center">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Homepage
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
