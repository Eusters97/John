import { useEffect, useState } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToWidget = () => {
  const [attempts, setAttempts] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("💬 TawkToWidget: Initializing chat widget...");

    const initTawkTo = () => {
      try {
        // Remove any existing scripts first
        const existingScript = document.getElementById("tawk-script");
        if (existingScript) {
          existingScript.remove();
          console.log("💬 Removed existing Tawk.to script");
        }

        // Set up Tawk.to global variables
        if (!window.Tawk_API) {
          window.Tawk_API = {};
          window.Tawk_LoadStart = new Date();
          console.log("💬 Tawk.to global variables initialized");
        }

        // Create the script exactly as provided by Tawk.to
        const script = document.createElement("script");
        script.id = "tawk-script";
        script.async = true;
        script.src = "https://embed.tawk.to/68a9e1946e59d01925d302a6/1j3bpibvl";
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        // Success handler
        script.onload = () => {
          console.log("✅ Tawk.to script loaded successfully!");
          setLoaded(true);

          // Set up callbacks
          if (window.Tawk_API) {
            window.Tawk_API.onLoad = function () {
              console.log("✅ Tawk.to widget fully loaded and visible!");

              // Force widget to be visible
              if (window.Tawk_API.showWidget) {
                window.Tawk_API.showWidget();
              }

              // Add custom styling to ensure visibility
              setTimeout(() => {
                const tawkFrame = document.querySelector(
                  '#tawk-to-widget, [id^="tawk"], iframe[src*="tawk.to"]',
                );
                if (tawkFrame) {
                  console.log("✅ Tawk.to widget found in DOM!");
                } else {
                  console.warn("⚠️ Tawk.to widget not found in DOM");
                }
              }, 1000);
            };

            window.Tawk_API.onStatusChange = function (status: string) {
              console.log("💬 Tawk.to status:", status);
            };
          }
        };

        // Error handler
        script.onerror = (error) => {
          console.error("❌ Failed to load Tawk.to script:", error);
          setAttempts((prev) => prev + 1);
        };

        // Insert script into document
        document.head.appendChild(script);
        console.log("💬 Tawk.to script inserted into head");
      } catch (error) {
        console.error("❌ Error setting up Tawk.to:", error);
        setAttempts((prev) => prev + 1);
      }
    };

    // Initialize immediately
    initTawkTo();

    // Retry mechanism if failed
    const retryTimer = setTimeout(() => {
      if (!loaded && attempts < 3) {
        console.log(
          `💬 Retrying Tawk.to initialization (attempt ${attempts + 1})`,
        );
        initTawkTo();
      }
    }, 5000);

    return () => {
      clearTimeout(retryTimer);
    };
  }, [attempts, loaded]);

  // Visibility check
  useEffect(() => {
    if (loaded) {
      const checkVisibility = () => {
        const tawkElements = document.querySelectorAll(
          '[id*="tawk"], [class*="tawk"], iframe[src*="tawk.to"]',
        );
        console.log("💬 Tawk.to elements found:", tawkElements.length);

        if (tawkElements.length === 0) {
          console.warn(
            "⚠️ No Tawk.to elements found - widget may not be visible",
          );
        } else {
          console.log("✅ Tawk.to widget elements found - should be visible");
        }
      };

      // Check after various delays
      setTimeout(checkVisibility, 2000);
      setTimeout(checkVisibility, 5000);
      setTimeout(checkVisibility, 10000);
    }
  }, [loaded]);

  return null;
};

export default TawkToWidget;
