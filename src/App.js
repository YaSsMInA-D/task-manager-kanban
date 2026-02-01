import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import Column from './components/Column';
import TaskForm from './components/TaskForm';

const MainApp = () => {
  const { tasks, searchTerm, setSearchTerm, darkMode, toggleDarkMode } = useTasks();

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Done', status: 'Done' },
  ];

  return (
    <div style={darkMode ? styles.appDark : styles.app}>
      <div style={styles.header}>
        <h1 style={darkMode ? styles.titleDark : styles.title}>Task Manager Kanban</h1>
        
        <div style={styles.controls}>
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
        </div>
      </div>
      
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
  title: {
    color: '#333',
  },
  titleDark: {
    color: 'white',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
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
  },
};

export default App;