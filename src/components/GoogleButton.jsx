import React, { useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';

const GoogleButton = () => {
  const buttonRef = useRef(null);
  const { darkMode } = useTasks();

  useEffect(() => {
    if (!window.google || !window.google.accounts || !buttonRef.current) {
      return;
    }

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
  }, [darkMode]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div ref={buttonRef}></div>
    </div>
  );
};

export default GoogleButton;