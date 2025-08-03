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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:gap-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Cookie className="h-5 w-5 md:h-6 md:w-6 text-forex-600 mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Cookie Notice</h4>
              <p className="text-xs md:text-sm text-gray-600">
                We use cookies to improve your experience and analyze site usage. By continuing to use our site, you consent to our{" "}
                <a href="#" className="text-forex-600 hover:underline">Cookie Policy</a>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 md:space-x-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectCookies}
              className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs md:text-sm min-h-[44px] md:min-h-auto px-4 md:px-3"
            >
              Deny
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-forex-600 hover:bg-forex-700 text-xs md:text-sm min-h-[44px] md:min-h-auto px-4 md:px-3"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              className="p-2 min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
