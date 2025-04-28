import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/admin/overview');
        setStats(res.data);
      } catch (err) {
        alert('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (!stats) return <p className="text-danger">No stats available.</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📊 Admin Dashboard</h3>

      <div className="row g-4">
        <StatCard label="Total Users" value={stats.total_users} color="primary" />
        <StatCard label="Total Courses" value={stats.total_courses} color="success" />
        <StatCard label="Total Lessons" value={stats.total_lessons} color="info" />
        <StatCard label="Active Students" value={stats.active_students} color="warning" />
        <StatCard
          label="Avg. Completion Rate"
          value={`${stats.average_completion_rate}%`}
          color="secondary"
        />
      </div>

      <div className="mt-5">
        <h5>🛠️ Admin Tools</h5>
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-outline-primary" onClick={() => navigate('/admin/users')}>
            👥 Manage Users
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/courses')}>
            📚 View All Courses
          </button>
          <button className="btn btn-outline-success" onClick={() => navigate('/admin/logs')}>
            🔐 Login Activity Logs
          </button>
          <button className="btn btn-outline-info" onClick={() => navigate('/admin/exports')}>
            📥 Export System Data
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="col-md-4">
    <div className={`card border-${color}`}>
      <div className={`card-body text-${color}`}>
        <h5 className="card-title">{label}</h5>
        <h3 className="card-text fw-bold">{value}</h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
