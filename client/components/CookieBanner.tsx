import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3 flex-1">
          <Cookie className="h-6 w-6 text-forex-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Cookie Notice</h4>
            <p className="text-sm text-gray-600">
              We use cookies to improve your experience and analyze site usage. By continuing to use our site, you consent to our{" "}
              <a href="#" className="text-forex-600 hover:underline">Cookie Policy</a>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={rejectCookies}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-forex-600 hover:bg-forex-700"
          >
            Accept All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={rejectCookies}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
