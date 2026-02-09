import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode } = useTasks();

  if (!user) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      backgroundColor: darkMode ? '#2d3748' : '#f5f5f5',
      borderRadius: '8px',
      border: darkMode ? '1px solid #4a5568' : '1px solid #ddd',
    }}>
      <img 
        src={user.picture} 
        alt={user.name}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #4285f4'
        }}
      />
      <div>
        <p style={{ 
          margin: 0, 
          fontWeight: 'bold',
          color: darkMode ? 'white' : '#333'
        }}>
          {user.name}
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '12px',
          color: darkMode ? '#cbd5e0' : '#666'
        }}>
          {user.email}
        </p>
      </div>
      <button
        onClick={logout}
        style={{
          marginLeft: '10px',
          padding: '8px 16px',
          backgroundColor: darkMode ? '#e53e3e' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;