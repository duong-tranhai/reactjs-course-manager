import React, { useState } from 'react';
import api from '../services/api';

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(2); // 1 = admin/teacher, 2 = student

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', {
        username,
        password,
        email,
        role_id: roleId
      });
      alert('Registration successful. You can now log in!');
      onSwitchToLogin();
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed.');
      console.error(err);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4">Register</h3>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-select" value={roleId} onChange={e => setRoleId(parseInt(e.target.value))}>
            <option value={2}>Student</option>
            <option value={1}>Teacher</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-2">Register</button>
        <button type="button" className="btn btn-link w-100" onClick={onSwitchToLogin}>
          Already have an account? Log in
        </button>
      </form>
    </div>
  );
};

export default Register;
