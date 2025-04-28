import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await api.post('/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,
            });

            localStorage.setItem('token', res.data.access_token);
            onLogin(); // call parent handler
        } catch (err) {
            alert('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: 400 }}>
            <h3 className="mb-4">Login</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label>Username</label>
                    <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <button type="button" className="btn btn-link w-100 mt-2" onClick={onSwitchToRegister}>
                    Don't have an account? Register
                </button>

            </form>
        </div>
    );
};

export default Login;
