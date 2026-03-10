import React, { useEffect, useRef, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const GoogleButton = () => {
  const buttonRef = useRef(null);
  const { darkMode } = useTasks();
  const { login } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google script loaded');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google script');
      };
      document.body.appendChild(script);
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id || !buttonRef.current || !clientId) {
      return;
    }

    console.log('Initializing Google Sign-In with client ID:', clientId);

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: login,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: darkMode ? 'filled_black' : 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 250
      }
    );

    
    window.google.accounts.id.prompt();
  }, [scriptLoaded, darkMode, login, clientId]);

  if (!clientId) {
    return (
      <div style={{ color: 'red', padding: '10px' }}>
        Error: Google Client ID not found. Check .env file.
      </div>
    );
  }

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <div ref={buttonRef}></div>
      {!scriptLoaded && (
        <p style={{ color: '#666' }}>Loading Google Sign-In...</p>
      )}
    </div>
  );
};

export default GoogleButton;