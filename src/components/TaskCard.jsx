import React from 'react';
import { useTasks } from '../context/TaskContext';

const TaskCard = ({ task, darkMode }) => {
  const { deleteTask, moveTask } = useTasks();

  window.moveTaskFunction = moveTask;

  const statusOrder = ['To Do', 'In Progress', 'Done'];
  const currentIndex = statusOrder.indexOf(task.status);
  
  const canMoveForward = currentIndex < statusOrder.length - 1;
  const canMoveBackward = currentIndex > 0;

  const getCardStyle = () => {
    const baseStyle = {
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '4px',
      borderLeft: '4px solid #ddd',
      cursor: 'grab',
    };
    
    if (darkMode) {
      baseStyle.backgroundColor = '#4a5568';
      baseStyle.color = 'white';
    } else {
      baseStyle.backgroundColor = 'white';
    }
    
    if (task.priority === 'High') {
      baseStyle.borderLeftColor = 'red';
    } else if (task.priority === 'Medium') {
      baseStyle.borderLeftColor = 'orange';
    } else {
      baseStyle.borderLeftColor = 'green';
    }
    
    return baseStyle;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div 
      style={getCardStyle()}
      draggable
      onDragStart={handleDragStart}
    >
      <div style={styles.header}>
        <h4 style={styles.taskTitle}>{task.title}</h4>
        <button 
          onClick={() => deleteTask(task.id)}
          style={darkMode ? styles.deleteButtonDark : styles.deleteButton}
        >
          ×
        </button>
      </div>
      
      {task.description && <p style={darkMode ? styles.descriptionDark : styles.description}>{task.description}</p>}
      
      <div>
        <span style={darkMode ? styles.priorityDark : styles.priority}>
          Priority: {task.priority}
        </span>
      </div>
      
      <div style={styles.actions}>
        <button
          onClick={() => moveTask(task.id, statusOrder[currentIndex - 1])}
          disabled={!canMoveBackward}
          style={darkMode ? styles.moveButtonDark : styles.moveButton}
        >
          ←
        </button>
        <button
          onClick={() => moveTask(task.id, statusOrder[currentIndex + 1])}
          disabled={!canMoveForward}
          style={darkMode ? styles.moveButtonDark : styles.moveButton}
        >
          →
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  taskTitle: {
    margin: 0,
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999',
  },
  deleteButtonDark: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#cbd5e0',
  },
  description: {
    color: '#666',
    margin: '10px 0',
  },
  descriptionDark: {
    color: '#cbd5e0',
    margin: '10px 0',
  },
  priority: {
    backgroundColor: '#eee',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  priorityDark: {
    backgroundColor: '#718096',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'white',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  moveButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  moveButtonDark: {
    padding: '5px 10px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default TaskCard;