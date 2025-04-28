import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getCurrentUserId } from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState({});
    const [newUserId, setNewUserId] = useState('');

    const navigate = useNavigate();

    const currentUserId = parseInt(getCurrentUserId());

    const fetchCourses = async () => {
        const res = await api.get('/courses');
        setCourses(res.data);
    };

    const deleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(course => course.id !== id));
        } catch (err) {
            alert("Failed to delete course");
        }
    };

    const handleEdit = (course) => {
        setEditingId(course.id);
        setNewTitle(course.title);
        setNewDescription(course.description);
    };

    const saveEdit = async (id) => {
        try {
            await api.put(`/courses/${id}`, { title: newTitle, description: newDescription, creator_id: currentUserId });
            setCourses(courses.map(c => (c.id === id ? { ...c, title: newTitle, description: newDescription } : c)));
            setEditingId(null);
        } catch (err) {
            alert("Failed to update the course detail");
        }
    };

    const toggleStudents = async (courseId) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
        } else {
            const res = await api.get(`/courses/by-course/${courseId}/users`);
            setEnrolledStudents((prev) => ({ ...prev, [courseId]: res.data }));
            setExpandedCourseId(courseId);
        }
    };

    const enrollUser = async (courseId) => {
        try {
            const res = await api.post(`/courses/${courseId}/enroll-user/${newUserId}`);
            alert(res.data.message);
            setNewUserId('');
            toggleStudents(courseId); // refresh the list
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to enroll user');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="mt-4">
            <h4>📋 Manage Courses</h4>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "30%" }}>Title</th>
                        <th>Description</th>
                        <th style={{ width: "20%" }}>Actions</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => {
                        const isOwner = course.creator_id === currentUserId;

                        return (
                            <React.Fragment key={course.id}>
                                <tr>
                                    <td>
                                        {editingId === course.id ? (
                                            <input
                                                className="form-control"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                            />
                                        ) : (
                                            <span>{course.title}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingId === course.id ? (
                                            <input
                                                className="form-control"
                                                value={newDescription}
                                                onChange={(e) => setNewDescription(e.target.value)}
                                            />
                                        ) : (
                                            <span>{course.description}</span>
                                        )}
                                        {!isOwner && (
                                            <span className="badge bg-secondary ms-2">Not yours</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {isOwner && editingId === course.id ? (
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => saveEdit(course.id)}
                                            >
                                                Save
                                            </button>
                                        ) : isOwner ? (
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() => handleEdit(course)}
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline-secondary btn-sm me-2" disabled>
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className={`btn btn-sm ${isOwner ? "btn-danger" : "btn-outline-secondary"}`}
                                            disabled={!isOwner}
                                            onClick={() => isOwner && deleteCourse(course.id)}
                                        >
                                            {isOwner ? "Delete" : "Not Allowed"}
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm me-2"
                                            onClick={() => toggleStudents(course.id)}
                                        >
                                            {expandedCourseId === course.id ? "Hide" : "Manage Students"}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => navigate(`/courses/${course.id}/lessons/manage`)}
                                        >
                                            📚 Manage Lessons
                                        </button>
                                    </td>
                                </tr>
                                {
                                    expandedCourseId === course.id && (
                                        <tr>
                                            <td colSpan="3">
                                                <h6>👥 Enrolled Students:</h6>
                                                {enrolledStudents[course.id]?.length > 0 ? (
                                                    <ul>
                                                        {enrolledStudents[course.id].map(student => (
                                                            <li key={student.id}>{student.username} (ID: {student.id})</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No students enrolled yet.</p>
                                                )}

                                                <div className="input-group mb-2" style={{ maxWidth: 300 }}>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter student ID"
                                                        value={newUserId}
                                                        onChange={(e) => setNewUserId(e.target.value)}
                                                    />
                                                    <button className="btn btn-outline-success" onClick={() => enrollUser(course.id)}>
                                                        Enroll
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>

    );
};

export default ManageCourses;
