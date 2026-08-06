import { useState, useEffect } from 'react';
import './LockScreen.css';

export default function LockScreen({ onUnlock, correctPin = "7831" }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(false);
    }
  };

  const verifyPin = (currentPin) => {
    if (currentPin === correctPin) {
      // Small delay for smooth transition
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else {
      setError(true);
      // Shake animation effect duration is roughly 500ms
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 500);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="lock-screen">
      <div className="glass-panel">
        <div className="lock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="lock-title">Enter Passcode</h2>
        
        <div className={`pin-dots ${error ? 'shake-error' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              className={`dot ${pin.length > index ? 'filled' : ''} ${error ? 'error' : ''}`}
            />
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} className="key" onClick={() => handleKeyPress(num.toString())}>
              {num}
            </button>
          ))}
          <div className="key empty"></div>
          <button className="key" onClick={() => handleKeyPress('0')}>0</button>
          <button className="key delete-key" onClick={handleDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <line x1="18" y1="9" x2="12" y2="15"></line>
              <line x1="12" y1="9" x2="18" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
