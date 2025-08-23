// Tawk.to Widget Utility Functions
// These functions allow you to control the Tawk.to widget programmatically

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

export class TawkToController {
  // Check if Tawk.to is loaded and ready
  static isLoaded(): boolean {
    return typeof window !== 'undefined' && window.Tawk_API !== undefined;
  }

  // Wait for Tawk.to to load
  static waitForLoad(timeout = 10000): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isLoaded()) {
        resolve(true);
        return;
      }

      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.isLoaded()) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  }

  // Show the widget
  static showWidget(): void {
    if (this.isLoaded() && window.Tawk_API.showWidget) {
      window.Tawk_API.showWidget();
      console.log('Tawk.to widget shown');
    } else {
      console.warn('Tawk.to not loaded or showWidget method not available');
    }
  }

  // Hide the widget
  static hideWidget(): void {
    if (this.isLoaded() && window.Tawk_API.hideWidget) {
      window.Tawk_API.hideWidget();
      console.log('Tawk.to widget hidden');
    } else {
      console.warn('Tawk.to not loaded or hideWidget method not available');
    }
  }

  // Maximize the widget (open chat)
  static maximize(): void {
    if (this.isLoaded() && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
      console.log('Tawk.to widget maximized');
    } else {
      console.warn('Tawk.to not loaded or maximize method not available');
    }
  }

  // Minimize the widget
  static minimize(): void {
    if (this.isLoaded() && window.Tawk_API.minimize) {
      window.Tawk_API.minimize();
      console.log('Tawk.to widget minimized');
    } else {
      console.warn('Tawk.to not loaded or minimize method not available');
    }
  }

  // Set visitor attributes
  static setAttributes(attributes: Record<string, string>): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isLoaded() && window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes(attributes, (error: any) => {
          if (error) {
            console.error('Error setting Tawk.to attributes:', error);
            resolve(false);
          } else {
            console.log('Tawk.to attributes set successfully:', attributes);
            resolve(true);
          }
        });
      } else {
        console.warn('Tawk.to not loaded or setAttributes method not available');
        resolve(false);
      }
    });
  }

  // Add a tag to the visitor
  static addTag(tag: string): void {
    if (this.isLoaded() && window.Tawk_API.addTag) {
      window.Tawk_API.addTag(tag);
      console.log(`Tawk.to tag added: ${tag}`);
    } else {
      console.warn('Tawk.to not loaded or addTag method not available');
    }
  }

  // Remove a tag from the visitor
  static removeTag(tag: string): void {
    if (this.isLoaded() && window.Tawk_API.removeTag) {
      window.Tawk_API.removeTag(tag);
      console.log(`Tawk.to tag removed: ${tag}`);
    } else {
      console.warn('Tawk.to not loaded or removeTag method not available');
    }
  }

  // Set up event listeners
  static onLoad(callback: () => void): void {
    if (typeof window !== 'undefined') {
      if (this.isLoaded()) {
        window.Tawk_API.onLoad = callback;
      } else {
        // Wait for Tawk.to to load then set the callback
        this.waitForLoad().then((loaded) => {
          if (loaded) {
            window.Tawk_API.onLoad = callback;
          }
        });
      }
    }
  }

  static onStatusChange(callback: (status: string) => void): void {
    if (typeof window !== 'undefined') {
      if (this.isLoaded()) {
        window.Tawk_API.onStatusChange = callback;
      } else {
        this.waitForLoad().then((loaded) => {
          if (loaded) {
            window.Tawk_API.onStatusChange = callback;
          }
        });
      }
    }
  }

  static onChatMaximized(callback: () => void): void {
    if (typeof window !== 'undefined') {
      if (this.isLoaded()) {
        window.Tawk_API.onChatMaximized = callback;
      } else {
        this.waitForLoad().then((loaded) => {
          if (loaded) {
            window.Tawk_API.onChatMaximized = callback;
          }
        });
      }
    }
  }

  static onChatMinimized(callback: () => void): void {
    if (typeof window !== 'undefined') {
      if (this.isLoaded()) {
        window.Tawk_API.onChatMinimized = callback;
      } else {
        this.waitForLoad().then((loaded) => {
          if (loaded) {
            window.Tawk_API.onChatMinimized = callback;
          }
        });
      }
    }
  }

  // Get widget status
  static getStatus(): string | null {
    if (this.isLoaded() && window.Tawk_API.getStatus) {
      return window.Tawk_API.getStatus();
    }
    return null;
  }

  // Test function to verify the widget is working
  static test(): void {
    console.log('=== Tawk.to Widget Test ===');
    console.log('Is loaded:', this.isLoaded());
    
    if (this.isLoaded()) {
      console.log('Status:', this.getStatus());
      console.log('Available methods:', Object.keys(window.Tawk_API || {}));
      
      // Test basic functionality
      setTimeout(() => {
        console.log('Testing show/hide...');
        this.hideWidget();
        setTimeout(() => this.showWidget(), 2000);
      }, 1000);
    } else {
      console.log('Waiting for Tawk.to to load...');
      this.waitForLoad().then((loaded) => {
        console.log('Load result:', loaded);
        if (loaded) {
          this.test(); // Run test again
        }
      });
    }
  }
}

// Export default instance for convenience
export default TawkToController;

// Convenience functions
export const {
  isLoaded,
  waitForLoad,
  showWidget,
  hideWidget,
  maximize,
  minimize,
  setAttributes,
  addTag,
  removeTag,
  onLoad,
  onStatusChange,
  onChatMaximized,
  onChatMinimized,
  getStatus,
  test
} = TawkToController;
