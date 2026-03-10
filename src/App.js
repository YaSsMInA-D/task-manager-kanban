import React, { useEffect, useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Column from './components/Column';
import TaskForm from './components/TaskForm';
import Profile from './components/Profile';
import GoogleButton from './components/GoogleButton';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const MainApp = () => {
  const { 
    filteredTasks, 
    searchTerm, 
    setSearchTerm, 
    darkMode, 
    toggleDarkMode,
    loading: tasksLoading,
    clearCompletedTasks 
  } = useTasks();
  
  const { user, loading: authLoading } = useAuth();
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
    if (!googleLoaded || !window.google?.accounts?.id || user) return;

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: (response) => {
        console.log('One Tap response:', response);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt();
  }, [googleLoaded, user]);

  const columns = [
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Done', status: 'Done' },
  ];

  const getTaskCount = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'Done').length;
    return { total, completed };
  };

  if (authLoading || tasksLoading) {
    return (
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  const { total, completed } = getTaskCount();

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">
            📋 Kanban Task Manager
          </h1>
          {user && <Profile />}
        </div>
        
        <div className="header-controls">
          {user ? (
            <>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="🔍 Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`search-input ${darkMode ? 'dark' : ''}`}
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="header-buttons">
                <button
                  onClick={toggleDarkMode}
                  className="theme-toggle"
                >
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
                
                <button
                  onClick={clearCompletedTasks}
                  className="clear-completed"
                  title="Clear completed tasks"
                >
                  🗑️ Clear Done
                </button>
              </div>
            </>
          ) : (
            <div className="auth-message">
              <p>Please sign in to manage your tasks</p>
            </div>
          )}
        </div>

        {user && (
          <div className="task-stats">
            <span>📊 Total: {total}</span>
            <span>✅ Completed: {completed}</span>
            <span>⏳ Pending: {total - completed}</span>
          </div>
        )}
      </header>
      
      <main className="app-main">
        {user ? (
          <>
            <section className="form-section">
              <TaskForm darkMode={darkMode} />
            </section>
            
            <section className="board-section">
              <div className="board">
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
            </section>
          </>
        ) : (
          <div className="auth-container">
            <div className={`auth-box ${darkMode ? 'dark' : ''}`}>
              <h2>Welcome to Kanban Task Manager</h2>
              <p>Sign in to start organizing your tasks efficiently</p>
              
              <GoogleButton />
              
              <div className="auth-features">
                <h3>Features:</h3>
                <ul>
                  <li>✅ Drag & drop tasks</li>
                  <li>🌙 Dark mode support</li>
                  <li>🔍 Real-time search</li>
                  <li>💾 Persistent storage</li>
                  <li>📱 Responsive design</li>
                </ul>
              </div>
              
              <div className="auth-status">
                <p>
                  <strong>Status:</strong> 
                  <span className={googleLoaded ? 'status-success' : 'status-loading'}>
                    {googleLoaded ? '✅ Google API Ready' : '⏳ Loading Google API...'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {user && (
        <footer className="app-footer">
          <p>© 2024 Kanban Task Manager - {new Date().getFullYear()}</p>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <MainApp />
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;