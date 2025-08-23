import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TawkToController from "@/lib/tawk-to-utils";
import {
  MessageCircle,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  TestTube,
} from "lucide-react";

export default function TawkToTest() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Check if Tawk.to is loaded
    const checkLoaded = () => {
      const loaded = TawkToController.isLoaded();
      setIsLoaded(loaded);

      if (loaded) {
        const currentStatus = TawkToController.getStatus();
        setStatus(currentStatus);
      }
    };

    checkLoaded();

    // Check every second for the first 10 seconds
    const interval = setInterval(checkLoaded, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  const addTestResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const runFullTest = async () => {
    addTestResult("Starting full test...");

    if (!isLoaded) {
      addTestResult("❌ Tawk.to is not loaded");
      return;
    }

    addTestResult("✅ Tawk.to is loaded");
    addTestResult(`Status: ${status || "Unknown"}`);

    // Test hide/show
    TawkToController.hideWidget();
    addTestResult("🙈 Widget hidden");

    setTimeout(() => {
      TawkToController.showWidget();
      addTestResult("👁️ Widget shown");
    }, 2000);

    // Test attributes
    const setResult = await TawkToController.setAttributes({
      name: "Test User",
      email: "test@forex.com",
      accountType: "Demo Tester",
    });

    addTestResult(
      setResult
        ? "✅ Attributes set successfully"
        : "❌ Failed to set attributes",
    );

    // Test tags
    TawkToController.addTag("test-user");
    addTestResult("🏷️ Test tag added");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tawk.to Widget Test Page
          </h1>
          <p className="text-gray-600">
            Test and control your Tawk.to chat widget functionality
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Widget Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <Badge variant={isLoaded ? "default" : "destructive"}>
                  {isLoaded ? "✅ Loaded" : "❌ Not Loaded"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Widget Status</div>
                <Badge variant="outline">{status || "Unknown"}</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">API Available</div>
                <Badge
                  variant={
                    typeof window !== "undefined" && window.Tawk_API
                      ? "default"
                      : "destructive"
                  }
                >
                  {typeof window !== "undefined" && window.Tawk_API
                    ? "✅ Yes"
                    : "❌ No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => {
                  TawkToController.showWidget();
                  addTestResult("👁️ Show widget called");
                }}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Show</span>
              </Button>

              <Button
                onClick={() => {
                  TawkToController.hideWidget();
                  addTestResult("🙈 Hide widget called");
                }}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide</span>
              </Button>

              <Button
                onClick={() => {
                  TawkToController.maximize();
                  addTestResult("📈 Maximize called");
                }}
                className="flex items-center space-x-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Open Chat</span>
              </Button>

              <Button
                onClick={() => {
                  TawkToController.minimize();
                  addTestResult("📉 Minimize called");
                }}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Close Chat</span>
              </Button>
            </div>

            <div className="mt-4">
              <Button
                onClick={runFullTest}
                className="w-full flex items-center justify-center space-x-2"
                size="lg"
              >
                <TestTube className="w-5 h-5" />
                <span>Run Full Test</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No test results yet. Click "Run Full Test" or use the control
                  buttons.
                </p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {testResults.length > 0 && (
              <Button
                onClick={() => setTestResults([])}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Clear Results
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>✅ Expected Behavior:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Chat bubble should be visible in bottom-right corner</li>
                <li>Status should show "Loaded" if widget is working</li>
                <li>Control buttons should show/hide the widget</li>
                <li>Open Chat should open the chat window</li>
                <li>Widget should persist when navigating to other pages</li>
              </ul>

              <p className="mt-4">
                <strong>🔍 If Not Working:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check browser console for errors</li>
                <li>Disable ad blockers</li>
                <li>Try refreshing the page</li>
                <li>Test in incognito/private mode</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
