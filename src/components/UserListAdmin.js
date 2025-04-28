import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role_id = roleFilter;

      const res = await api.get('/admin/users', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="container mt-4">
      <h4>👥 User Management</h4>
      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select me-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="1">Teacher</option>
          <option value="2">Student</option>
          <option value="3">Admin</option>
        </select>
        <button className="btn btn-outline-primary" type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No users found.</p>
      )}
    </div>
  );
};

export default UserListAdmin;
