import React from 'react';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';
import './Column.css'; 

const Column = ({ title, status, tasks, darkMode }) => {
  const { moveTask } = useTasks();
  const filteredTasks = tasks.filter(task => task.status === status);

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    moveTask(taskId, status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  
  const getColumnClass = () => {
    let className = 'column';
    
   
    switch (status) {
      case 'To Do':
        className += ' column-todo';
        break;
      case 'In Progress':
        className += ' column-progress';
        break;
      case 'Done':
        className += ' column-done';
        break;
      default:
        break;
    }
    
   
    if (darkMode) {
      className += ' dark';
    }
    
    return className;
  };


  const getTitleStyle = () => {
    const baseStyle = {
      margin: '0 0 15px 0',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '1.1rem',
      fontWeight: '600',
    };

    
    if (!darkMode) {
      switch (status) {
        case 'To Do':
          return { ...baseStyle, backgroundColor: '#e9ecef', color: '#495057' };
        case 'In Progress':
          return { ...baseStyle, backgroundColor: '#cce5ff', color: '#004085' };
        case 'Done':
          return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
        default:
          return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#333' };
      }
    } else {
      
      switch (status) {
        case 'To Do':
          return { ...baseStyle, backgroundColor: '#2d3748', color: '#e2e8f0' };
        case 'In Progress':
          return { ...baseStyle, backgroundColor: '#2c5282', color: '#e2e8f0' };
        case 'Done':
          return { ...baseStyle, backgroundColor: '#276749', color: '#e2e8f0' };
        default:
          return { ...baseStyle, backgroundColor: '#4a5568', color: '#e2e8f0' };
      }
    }
  };

  return (
    <div 
      className={getColumnClass()}
      style={styles.column}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div style={styles.columnHeader}>
        <h3 style={getTitleStyle()}>
          {title} <span style={styles.taskCount}>({filteredTasks.length})</span>
        </h3>
      </div>
      
      <div style={styles.tasksContainer}>
        {filteredTasks.length === 0 ? (
          <div style={darkMode ? styles.emptyStateDark : styles.emptyState}>
            <p>No tasks yet</p>
            <small>Drop tasks here or create new ones</small>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              darkMode={darkMode} 
            />
          ))
        )}
      </div>
    </div>
  );
};


const styles = {
  column: {
    flex: 1,
    margin: '0 10px',
    minWidth: '280px',
    maxWidth: '350px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
  },
  columnHeader: {
    marginBottom: '10px',
  },
  taskCount: {
    fontSize: '0.9rem',
    fontWeight: 'normal',
    marginLeft: '5px',
    opacity: 0.8,
  },
  tasksContainer: {
    minHeight: '200px',
    maxHeight: 'calc(100vh - 250px)',
    overflowY: 'auto',
    padding: '5px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6',
    color: '#6c757d',
  },
  emptyStateDark: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: '#2d3748',
    borderRadius: '8px',
    border: '2px dashed #4a5568',
    color: '#a0aec0',
  },
};

export default Column;