import React, { useEffect } from 'react';

interface TawkToProps {
  propertyId?: string;
  widgetId?: string;
  enabled?: boolean;
}

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkTo: React.FC<TawkToProps> = ({
  propertyId = import.meta.env.VITE_TAWK_TO_PROPERTY_ID || "68a9e1946e59d01925d302a6",
  widgetId = import.meta.env.VITE_TAWK_TO_WIDGET_ID || "1j3bpibvl",
  enabled = import.meta.env.VITE_TAWK_TO_ENABLED !== 'false'
}) => {
  useEffect(() => {
    console.log('TawkTo component initializing...');
    console.log('Environment check:', {
      VITE_TAWK_TO_ENABLED: import.meta.env.VITE_TAWK_TO_ENABLED,
      VITE_TAWK_TO_PROPERTY_ID: import.meta.env.VITE_TAWK_TO_PROPERTY_ID,
      VITE_TAWK_TO_WIDGET_ID: import.meta.env.VITE_TAWK_TO_WIDGET_ID,
      enabled,
      propertyId,
      widgetId
    });

    if (!enabled) {
      console.warn('TawkTo widget is disabled');
      return;
    }

    // Initialize Tawk_API if not already present
    if (!window.Tawk_API) {
      window.Tawk_API = {};
    }

    window.Tawk_LoadStart = new Date();
    console.log('TawkTo: Starting to load widget...');

    // Check if script is already loaded
    const existingScript = document.getElementById('tawk-to-script');
    if (existingScript) {
      console.log('TawkTo: Script already exists, skipping');
      return;
    }

    // Create and inject Tawk.to script
    const script = document.createElement('script');
    script.id = 'tawk-to-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    console.log(`TawkTo: Creating script with URL: ${script.src}`);

    // Insert script into document head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
      console.log('TawkTo: Script inserted before first script');
    } else {
      document.head.appendChild(script);
      console.log('TawkTo: Script appended to head');
    }

    // Optional: Add error handling
    script.onerror = () => {
      console.warn('Failed to load Tawk.to chat widget');
    };

    script.onload = () => {
      console.log('Tawk.to chat widget loaded successfully');
      
      // Optional: Configure Tawk.to after load
      if (window.Tawk_API) {
        // Set custom attributes if needed
        window.Tawk_API.onLoad = function() {
          // Custom configuration can go here
          console.log('Tawk.to widget is ready');
        };

        // Hide widget initially if needed (optional)
        // window.Tawk_API.hideWidget();
        
        // Set visitor attributes (optional)
        window.Tawk_API.setAttributes = function() {
          window.Tawk_API.setAttributes({
            'name': 'Forex Trader',
            'email': 'visitor@forexsignals.com'
          }, function(error: any) {
            if (error) {
              console.log('Error setting Tawk.to attributes:', error);
            }
          });
        };
      }
    };

    // Cleanup function
    return () => {
      // Remove script if component unmounts
      const scriptElement = document.getElementById('tawk-to-script');
      if (scriptElement) {
        scriptElement.remove();
      }
      
      // Clean up global variables
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };
  }, [propertyId, widgetId, enabled]);

  // This component doesn't render anything visible
  return null;
};

export default TawkTo;

// Export utility functions for controlling the widget
export const TawkToAPI = {
  // Show the widget
  showWidget: () => {
    if (window.Tawk_API && window.Tawk_API.showWidget) {
      window.Tawk_API.showWidget();
    }
  },
  
  // Hide the widget
  hideWidget: () => {
    if (window.Tawk_API && window.Tawk_API.hideWidget) {
      window.Tawk_API.hideWidget();
    }
  },
  
  // Maximize the widget (open chat)
  maximize: () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  },
  
  // Minimize the widget
  minimize: () => {
    if (window.Tawk_API && window.Tawk_API.minimize) {
      window.Tawk_API.minimize();
    }
  },
  
  // Set visitor attributes
  setAttributes: (attributes: Record<string, string>, callback?: (error: any) => void) => {
    if (window.Tawk_API && window.Tawk_API.setAttributes) {
      window.Tawk_API.setAttributes(attributes, callback);
    }
  },
  
  // Add event listeners
  onLoad: (callback: () => void) => {
    if (window.Tawk_API) {
      window.Tawk_API.onLoad = callback;
    }
  },
  
  onStatusChange: (callback: (status: string) => void) => {
    if (window.Tawk_API) {
      window.Tawk_API.onStatusChange = callback;
    }
  },
  
  onChatMaximized: (callback: () => void) => {
    if (window.Tawk_API) {
      window.Tawk_API.onChatMaximized = callback;
    }
  },
  
  onChatMinimized: (callback: () => void) => {
    if (window.Tawk_API) {
      window.Tawk_API.onChatMinimized = callback;
    }
  }
};
