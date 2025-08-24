import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export const useTawkTo = () => {
  useEffect(() => {
    // Don't load if already loaded
    if (window.Tawk_API || document.getElementById("tawk-to-script")) {
      console.log("💬 Tawk.to already initialized");
      return;
    }

    console.log("💬 Initializing Tawk.to with direct script injection...");

    try {
      // Exactly as provided by user - no modifications
      var Tawk_API = Tawk_API || {},
        Tawk_LoadStart = new Date();
      window.Tawk_API = Tawk_API;
      window.Tawk_LoadStart = Tawk_LoadStart;

      (function () {
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];

        s1.async = true;
        s1.src = "https://embed.tawk.to/68a9e1946e59d01925d302a6/1j3bpibvl";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");
        s1.id = "tawk-to-script";

        s1.onload = function () {
          console.log("✅ Tawk.to loaded via hook!");

          // Force show widget after load
          setTimeout(() => {
            if (window.Tawk_API && window.Tawk_API.showWidget) {
              window.Tawk_API.showWidget();
              console.log("✅ Tawk.to widget forced to show");
            }
          }, 1000);
        };

        s1.onerror = function () {
          console.error("❌ Tawk.to failed to load via hook");
        };

        if (s0 && s0.parentNode) {
          s0.parentNode.insertBefore(s1, s0);
        } else {
          document.head.appendChild(s1);
        }

        console.log("💬 Tawk.to script injected successfully");
      })();
    } catch (error) {
      console.error("�� Error in Tawk.to hook:", error);
    }
  }, []);
};
