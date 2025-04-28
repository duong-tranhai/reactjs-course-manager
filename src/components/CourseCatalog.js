import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getCurrentUserId } from '../utils/tokenUtils';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const currentUserId = parseInt(getCurrentUserId());

    const fetchAllCourses = async () => {
        const res = await api.get('/courses');
        setCourses(res.data);
    };

    const fetchMyCourses = async () => {
        const res = await api.get(`/courses/by-user/${currentUserId}`);
        setMyCourses(res.data.map(course => course.id));
    };

    const enrollInCourse = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/enroll`);
            alert('Successfully enrolled!');
            fetchMyCourses();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to enroll');
        }
    };

    useEffect(() => {
        fetchAllCourses();
        fetchMyCourses();
    }, []);

    return (
        <div className="mt-4">
            <h4>🎓 Available Courses</h4>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "25%" }}>Title</th>
                        <th>Description</th>
                        <th style={{ width: "25%" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => {
                        const alreadyEnrolled = myCourses.includes(course.id);

                        return (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>
                                    {alreadyEnrolled ? (
                                        <span className="badge bg-success">Enrolled</span>
                                    ) : (
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => enrollInCourse(course.id)}
                                        >
                                            Enroll
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CourseCatalog;
