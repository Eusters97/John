import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToWidget = () => {
  useEffect(() => {
    console.log('🟢 TawkToWidget component mounted');
    
    // Don't load if already loaded
    if (window.Tawk_API) {
      console.log('🟢 Tawk.to already loaded, skipping');
      return;
    }

    // Initialize Tawk.to
    const initTawkTo = () => {
      try {
        console.log('🟢 Initializing Tawk.to...');
        
        // Set up global variables
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        
        console.log('🟢 Global variables set');
        
        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://embed.tawk.to/68a9e1946e59d01925d302a6/1j3bpibvl';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');
        script.id = 'tawk-to-script-react';
        
        console.log('🟢 Script element created:', script.src);
        
        // Add event listeners
        script.onload = () => {
          console.log('✅ Tawk.to script loaded successfully via React!');
          console.log('✅ Tawk_API available:', typeof window.Tawk_API);
          
          // Set up event handlers
          if (window.Tawk_API) {
            window.Tawk_API.onLoad = function() {
              console.log('✅ Tawk.to widget fully loaded and ready!');
            };
            
            window.Tawk_API.onStatusChange = function(status: string) {
              console.log('🟢 Tawk.to status changed:', status);
            };
          }
        };
        
        script.onerror = (error) => {
          console.error('❌ Failed to load Tawk.to script:', error);
        };
        
        // Insert script
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
          console.log('🟢 Script inserted before first script');
        } else {
          document.head.appendChild(script);
          console.log('🟢 Script appended to head');
        }
        
      } catch (error) {
        console.error('❌ Error initializing Tawk.to:', error);
      }
    };

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(initTawkTo, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.log('🟢 TawkToWidget component unmounting');
      
      // Optional: Remove script on unmount (not recommended for chat widgets)
      // const script = document.getElementById('tawk-to-script-react');
      // if (script) {
      //   script.remove();
      // }
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default TawkToWidget;
