import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { useTasks } from '../context/TaskContext';
import './TaskForm.css';
import PropTypes from 'prop-types';

const TaskForm = ({ darkMode }) => {
  const { addTask } = useTasks();
  const [errors, setErrors] = useState({});
  
  const { values, handleChange, resetForm } = useForm({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!values.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (values.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (values.title.length > 50) {
      newErrors.title = 'Title must be less than 50 characters';
    }
    
    if (values.description && values.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    addTask({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      status: values.status,
    });
    
    resetForm();
    setErrors({});
    
    // Show success message (optional)
    const formElement = e.target;
    formElement.classList.add('form-submitted');
    setTimeout(() => {
      formElement.classList.remove('form-submitted');
    }, 500);
  };

  const handleClear = () => {
    resetForm();
    setErrors({});
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`task-form ${darkMode ? 'dark' : ''}`}
    >
      <h3 className="form-title">Create New Task</h3>
      
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className={`form-input ${errors.title ? 'error' : ''} ${darkMode ? 'dark' : ''}`}
          maxLength="50"
        />
        {errors.title && (
          <span className="error-message">{errors.title}</span>
        )}
        <small className="char-count">
          {values.title.length}/50
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">
          Description <span className="optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="3"
          className={`form-textarea ${errors.description ? 'error' : ''} ${darkMode ? 'dark' : ''}`}
          maxLength="200"
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
        <small className="char-count">
          {values.description.length}/200
        </small>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className={`form-select ${darkMode ? 'dark' : ''}`}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Initial Status</label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            className={`form-select ${darkMode ? 'dark' : ''}`}
          >
            <option value="To Do">📝 To Do</option>
            <option value="In Progress">⚡ In Progress</option>
            <option value="Done">✅ Done</option>
          </select>
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn-submit"
        >
          ✨ Create Task
        </button>
        <button 
          type="button" 
          onClick={handleClear}
          className="btn-clear"
        >
          🗑️ Clear
        </button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default TaskForm;