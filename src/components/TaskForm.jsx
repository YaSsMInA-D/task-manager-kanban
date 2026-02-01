import React from 'react';
import useForm from '../hooks/useForm';
import { useTasks } from '../context/TaskContext';

const TaskForm = ({ darkMode }) => {
  const { addTask } = useTasks();
  
  const { values, handleChange, resetForm } = useForm({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!values.title.trim()) return;
    
    addTask(values);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} style={darkMode ? styles.formDark : styles.form}>
      <input
        type="text"
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Task Title"
        required
        style={darkMode ? styles.inputDark : styles.input}
      />
      
      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="Description"
        style={darkMode ? styles.textareaDark : styles.textarea}
      />
      
      <select
        name="priority"
        value={values.priority}
        onChange={handleChange}
        style={darkMode ? styles.selectDark : styles.select}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      
      <select
        name="status"
        value={values.status}
        onChange={handleChange}
        style={darkMode ? styles.selectDark : styles.select}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      
      <div style={styles.buttons}>
        <button type="submit" style={styles.submitButton}>
          Add Task
        </button>
        <button type="button" onClick={resetForm} style={darkMode ? styles.resetButtonDark : styles.resetButton}>
          Clear
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    maxWidth: '400px',
  },
  formDark: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    maxWidth: '400px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  inputDark: {
    padding: '10px',
    border: '1px solid #4a5568',
    borderRadius: '4px',
    backgroundColor: '#2d3748',
    color: 'white',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
  },
  textareaDark: {
    padding: '10px',
    border: '1px solid #4a5568',
    borderRadius: '4px',
    resize: 'vertical',
    backgroundColor: '#2d3748',
    color: 'white',
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  selectDark: {
    padding: '10px',
    border: '1px solid #4a5568',
    borderRadius: '4px',
    backgroundColor: '#2d3748',
    color: 'white',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  resetButton: {
    padding: '10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  resetButtonDark: {
    padding: '10px',
    backgroundColor: '#718096',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default TaskForm;