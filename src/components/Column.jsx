import React from 'react';
import TaskCard from './TaskCard';

const Column = ({ title, status, tasks, darkMode }) => {
  const filteredTasks = tasks.filter(task => task.status === status);

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const moveTask = window.moveTaskFunction;
    if (moveTask) {
      moveTask(taskId, status);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      style={darkMode ? styles.columnDark : styles.column}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3 style={darkMode ? styles.titleDark : styles.title}>{title}</h3>
      <div>
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  column: {
    flex: 1,
    margin: '10px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  },
  columnDark: {
    flex: 1,
    margin: '10px',
    padding: '15px',
    backgroundColor: '#2d3748',
    borderRadius: '5px',
  },
  title: {
    color: '#333',
  },
  titleDark: {
    color: 'white',
  },
};

export default Column;