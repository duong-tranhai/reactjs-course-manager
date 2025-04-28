import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getCurrentUserId } from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const currentUserId = parseInt(getCurrentUserId());
    const navigate = useNavigate();

    const fetchMyCourses = async () => {
        try {
            const res = await api.get(`/courses/by-user/${currentUserId}`);
            setMyCourses(res.data);
        } catch (err) {
            alert('Failed to load your courses');
        }
    };

    const markCourseComplete = async (courseId) => {
        try {
            await api.patch(`/courses/${courseId}/complete`);
            const updatedCourses = myCourses.map(c =>
                c.id === courseId ? { ...c, is_completed: true } : c
            );
            setMyCourses(updatedCourses);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to mark course as completed");
        }
    };

    useEffect(() => {
        fetchMyCourses();
    }, []);

    return (
        <div className="mt-4">
            <h4>📚 My Enrolled Courses</h4>
            {myCourses.length > 0 ? (
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "25%" }}>Title</th>
                            <th>Description</th>
                            <th style={{ width: "25%" }}>Progress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCourses.map(course => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>
                                    <div className="mb-2">
                                        <div className="progress" style={{ height: '20px' }}>
                                            <div
                                                className={`progress-bar ${course.progress === 100 ? 'bg-success' : 'bg-info'}`}
                                                role="progressbar"
                                                style={{ width: `${course.progress}%` }}
                                            >
                                                {course.progress}%
                                            </div>
                                        </div>
                                    </div>
                                    {course.is_completed ? (
                                        <span className="badge bg-success">Completed</span>
                                    ) : course.progress === 100 ? (
                                        <button
                                            className="btn btn-outline-success btn-sm mt-2"
                                            onClick={() => markCourseComplete(course.id)}
                                        >
                                            Mark as Completed
                                        </button>
                                    ) : (
                                        <span className="text-muted small">Complete all lessons first</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => navigate(`/student/courses/${course.id}/lessons`)}
                                    >
                                        View Lessons
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You are not enrolled in any courses yet.</p>
            )}
        </div>
    );
};

export default MyCourses;
