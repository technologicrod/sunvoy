import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
  Axios.get('http://localhost:3001/logout', { withCredentials: true }) //for auto logout when accessed since there is no logout button
    .then(() => {
      return Axios.get('http://localhost:3001/getauth', { withCredentials: true });
    })
    .then(res => {
      if (res.data.valid) {
        window.location.href = '/list';
      } else {
        setLoading(false);
      }
    })
    .catch(err => {
      console.error('Login - logout/getauth error', err);
      setLoading(false);
    });
}, []);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    Axios.post('http://localhost:3001/login', {
      username,
      password
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        window.location.href = '/list';
      })
      .catch(err => {
        if (Axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            alert('Unauthorized: Invalid username or password');
          } else {
            console.log(err);
            alert('An error occurred during login');
          }
        } else {
          alert('An unexpected error occurred');
        }
        console.error('Login - loginauth', err);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const pageBody = (
    <div className="card p-4 shadow" style={{ width: '300px' }}>
      <h1 className="mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        <div className="form-group mt-3 position-relative">
          <label htmlFor="password">Password</label>
          <input
            type='password'
            className="form-control pe-5"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4 w-100" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      {loading ? <div>Loading...</div> : pageBody}
    </div>
  );
}

export default Login;
