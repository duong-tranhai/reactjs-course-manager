import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleId } from '../utils/tokenUtils';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();
    const roleId = getUserRoleId();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">🎓 Course Portal</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {roleId === 1 && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/teacher/courses">Manage Courses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/teacher/create">Add Course</Link>
                                </li>
                            </>
                        )}
                        {roleId === 2 && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/student/catalog">Course Catalog</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/student/my-courses">My Courses</Link>
                                </li>
                            </>
                        )}
                        {getUserRoleId() === 3 && (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/users" className="nav-link">Users</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => {
                        onLogout();
                        navigate('/');
                    }}>
                        🔒 Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
