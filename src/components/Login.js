import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNostr from '../hooks/useNostr';

function Login() {
  const [privateKey, setPrivateKey] = useState('');
  const { loginUser } = useNostr();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(privateKey);
    navigate('/profile');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Private Key:
          <input type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
