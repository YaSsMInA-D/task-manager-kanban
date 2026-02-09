import React, { useEffect, useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { useAuth } from './context/AuthContext';
import Column from './components/Column';
import TaskForm from './components/TaskForm';
import Profile from './components/Profile';
import GoogleButton from './components/GoogleButton';

const YOUR_CLIENT_ID = 'SOMETHING';

const MainApp = () => {
  const { tasks, searchTerm, setSearchTerm, darkMode, toggleDarkMode } = useTasks();
  const { user, login, loading } = useAuth();
  const [googleLoaded, setGoogleLoaded] = useState(false);

  
  useEffect(() => {
    if (document.getElementById('google-one-tap-script')) {
      setGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-one-tap-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google One Tap script loaded');
      setGoogleLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Google One Tap script');
    };

    document.head.appendChild(script);
  }, []);

  
  useEffect(() => {
    if (!googleLoaded || !window.google || !window.google.accounts || user) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: YOUR_CLIENT_ID,
      callback: login,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'use'
    });

    window.google.accounts.id.prompt((notification) => {
      console.log('One Tap notification:', notification);
    });
  }, [googleLoaded, user, login]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Done', status: 'Done' },
  ];

  if (loading) {
    return (
      <div style={darkMode ? styles.appDark : styles.app}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ color: darkMode ? 'white' : '#333' }}>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={darkMode ? styles.appDark : styles.app}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={darkMode ? styles.titleDark : styles.title}>Task Manager Kanban</h1>
          {user && <Profile />}
        </div>
        
        <div style={styles.controls}>
          {user ? (
            <>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={darkMode ? styles.searchInputDark : styles.searchInput}
              />
              
              <button
                onClick={toggleDarkMode}
                style={darkMode ? styles.darkModeButtonDark : styles.darkModeButton}
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </>
          ) : (
            <div style={styles.authMessage}>
              <p style={{ color: darkMode ? 'white' : '#333' }}>
                Please sign in to use the Kanban board
              </p>
            </div>
          )}
        </div>
      </div>
      
      {user ? (
        <>
          <TaskForm darkMode={darkMode} />
          
          <div style={styles.columns}>
            {columns.map(column => (
              <Column
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={filteredTasks}
                darkMode={darkMode}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={styles.authContainer}>
          <div style={{
            ...styles.authBox,
            backgroundColor: darkMode ? '#2d3748' : 'white',
            border: darkMode ? '1px solid #4a5568' : '1px solid #ddd',
          }}>
            <h2 style={{ color: darkMode ? 'white' : '#333', marginBottom: '20px' }}>
              Sign In Required
            </h2>
            <p style={{ color: darkMode ? '#cbd5e0' : '#666', marginBottom: '30px' }}>
              Google One Tap should appear above. If not, use the button below:
            </p>
            <GoogleButton />
            
            <div style={{
              marginTop: '30px',
              padding: '15px',
              backgroundColor: darkMode ? '#4a5568' : '#f8f9fa',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <p style={{ margin: 0, color: darkMode ? '#cbd5e0' : '#666' }}>
                <strong>Debug Info:</strong> Google API {googleLoaded ? '✅ Loaded' : '❌ Loading...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <TaskProvider>
      <MainApp />
    </TaskProvider>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial',
    padding: '20px',
    backgroundColor: 'white',
    minHeight: '100vh',
  },
  appDark: {
    fontFamily: 'Arial',
    padding: '20px',
    backgroundColor: '#1a202c',
    minHeight: '100vh',
    color: 'white',
  },
  header: {
    marginBottom: '20px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  titleDark: {
    color: 'white',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  searchInputDark: {
    flex: 1,
    padding: '8px',
    border: '1px solid #4a5568',
    borderRadius: '4px',
    backgroundColor: '#2d3748',
    color: 'white',
  },
  darkModeButton: {
    padding: '8px 16px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  darkModeButtonDark: {
    padding: '8px 16px',
    backgroundColor: '#f7fafc',
    color: '#1a202c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  columns: {
    display: 'flex',
    gap: '20px',
  },
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  authBox: {
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  authMessage: {
    flex: 1,
    textAlign: 'center',
    padding: '10px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4285f4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default App;