import React, { memo } from 'react';
import { useTasks } from '../context/TaskContext';
import './TaskCard.css';
import PropTypes from 'prop-types';

const TaskCard = memo(({ task, darkMode }) => {
  const { deleteTask, moveTask } = useTasks();

  const statusOrder = ['To Do', 'In Progress', 'Done'];
  const currentIndex = statusOrder.indexOf(task.status);
  
  const canMoveForward = currentIndex < statusOrder.length - 1;
  const canMoveBackward = currentIndex > 0;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleMoveForward = () => {
    moveTask(task.id, statusOrder[currentIndex + 1]);
  };

  const handleMoveBackward = () => {
    moveTask(task.id, statusOrder[currentIndex - 1]);
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getPriorityLabel = () => {
    switch (task.priority) {
      case 'High':
        return '🔴 High';
      case 'Medium':
        return '🟡 Medium';
      case 'Low':
        return '🟢 Low';
      default:
        return task.priority;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`task-card ${getPriorityClass()} ${darkMode ? 'dark' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <button 
          onClick={handleDelete}
          className="delete-btn"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      
      {task.description && (
        <p className={`task-description ${darkMode ? 'dark' : ''}`}>
          {task.description}
        </p>
      )}
      
      <div className="task-meta">
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {getPriorityLabel()}
        </span>
        
        {task.createdAt && (
          <span className={`task-date ${darkMode ? 'dark' : ''}`}>
            📅 {formatDate(task.createdAt)}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        <button
          onClick={handleMoveBackward}
          disabled={!canMoveBackward}
          className={`move-btn ${darkMode ? 'dark' : ''}`}
          aria-label="Move backward"
        >
          ←
        </button>
        
        <span className="task-status">
          {task.status}
        </span>
        
        <button
          onClick={handleMoveForward}
          disabled={!canMoveForward}
          className={`move-btn ${darkMode ? 'dark' : ''}`}
          aria-label="Move forward"
        >
          →
        </button>
      </div>
    </div>
  );
});

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

TaskCard.displayName = 'TaskCard';

export default TaskCard;