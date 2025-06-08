import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  firstname: string;
  lastname: string;
  email: string;
  userid: string;
}

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get<User>('http://localhost:3001/settings', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Settings - fetch error:', err);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const pageBody = (
    <div className="container py-5">
      <h2 className="mb-4"><strong>Settings</strong></h2>
      <div className="card shadow-sm p-4" style={{ maxWidth: '75%'}}>
        <form>
          <div className="mb-3">
            <label className="form-label">User ID</label>
            <input type="text" className="form-control" value={user?.userid || ''} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" value={user?.firstname || ''} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" value={user?.lastname || ''} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="text" className="form-control" value={user?.email || ''} disabled />
          </div>
          
        </form>
      </div>
      <button
        type="button"
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/list')}
        >
        <strong>Back to List</strong>
        </button>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 bg-light">
      {user ? pageBody : 'Not authenticated'}
    </div>
  );
};

export default Settings;
