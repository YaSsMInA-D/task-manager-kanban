import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
   
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  }, []);

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const updateTask = useCallback((id, updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  }, []);

  const clearCompletedTasks = useCallback(() => {
    if (window.confirm('Delete all completed tasks?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.status !== 'Done'));
    }
  }, []);

  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const value = {
    tasks,
    filteredTasks,
    addTask,
    deleteTask,
    moveTask,
    updateTask,
    clearCompletedTasks,
    getTasksByStatus,
    getTasksByPriority,
    searchTerm,
    setSearchTerm,
    darkMode,
    toggleDarkMode,
    loading,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};