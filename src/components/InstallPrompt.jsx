import { useState, useEffect } from 'react';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isIosPromptVisible, setIsIosPromptVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return; // App is already installed, do not show prompts
    }

    // Android / Chrome: Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
      setDeferredPrompt(e);
      // Wait a few seconds before showing the prompt so it's not too aggressive
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIos(true);
      // Show iOS prompt after a short delay
      setTimeout(() => setIsIosPromptVisible(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    setIsIosPromptVisible(false);
  };

  if (showPrompt && deferredPrompt) {
    return (
      <div className="install-prompt-overlay">
        <div className="install-prompt-card">
          <button className="close-btn" onClick={handleClose}>×</button>
          <img src="https://static.wixstatic.com/media/68b92a_d71e34133826499983234774dea1945b~mv2.png" alt="App Logo" className="app-logo" />
          <h3>Install RKD WebApps</h3>
          <p>Add this directory to your home screen for quick and easy access.</p>
          <button className="install-btn" onClick={handleInstallClick}>Install App</button>
        </div>
      </div>
    );
  }

  if (isIos && isIosPromptVisible) {
    return (
      <div className="install-prompt-overlay">
        <div className="install-prompt-card ios-prompt">
          <button className="close-btn" onClick={handleClose}>×</button>
          <h3>Add to Home Screen</h3>
          <p>Install this app on your iPhone: tap the <strong>Share</strong> icon at the bottom of Safari, then scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
          <div className="ios-share-icon">
             <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
             </svg>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
