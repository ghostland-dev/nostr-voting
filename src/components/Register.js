import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNostr from '../hooks/useNostr';

function Register({ isAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { registerUser } = useNostr(isAuthenticated);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    registerUser(username, password);
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
