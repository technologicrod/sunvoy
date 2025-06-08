import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthResponse {
  valid: boolean;
  allowed: boolean;
  status: string;
  timeleft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface User {
  firstname: string;
  lastname: string;
  email: string;
  userid: string | number;
}

const Home: React.FC = () => {
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    Axios.get('http://localhost:3001/logout', { withCredentials: true })
      .then(() => {
        navigate('/login');
      })
      .catch((err: unknown) => {
        console.error('Home - logout error', err);
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    Axios.get<AuthResponse>('http://localhost:3001/getauth', { withCredentials: true })
      .then((res) => {
        const { valid } = res.data;
        if (valid) {
          setAuth(true);
        } else {
          logout();
        }
      })
      .catch((err: unknown) => {
        console.error('Home - getauth error', err);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logout]);

  useEffect(() => {
    Axios.get<User[]>('http://localhost:3001/', { withCredentials: true })
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err: unknown) => {
        console.error('Home - getusers error', err);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div>Loading users...</div>
      </div>
    );
  }

  const pageBody = (
    <div className="container py-5">
        <h2 className="mb-4"><strong>Users List</strong></h2>
        <div className="row gx-1">
            {users.map((user, index) => (
            <div className="col-md-4 mb-2" key={index}> {/* smaller bottom margin too */}
                <div className="card" style={{ fontSize: '0.85rem', padding: '0.5rem', width: '80%' }}>
                <div className="card-body p-2">
                    <h5 className="card-title mb-1">{user.firstname} {user.lastname}</h5>
                    <p className="card-text mb-1">{user.email}</p>
                    <p className="card-text text-muted mb-0" style={{ fontSize: '0.75rem' }}>ID: {user.userid}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => navigate('/settings')}
        >
            <strong>Settings</strong>
        </button>
    </div>

  );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 bg-light">
      {auth ? pageBody : 'Not authenticated'}
    </div>
  );
};

export default Home;
