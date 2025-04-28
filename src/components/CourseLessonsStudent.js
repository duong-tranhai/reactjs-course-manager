import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CourseLessonsStudent = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [completions, setCompletions] = useState({});

    const fetchLessons = async () => {
        const res = await api.get(`/lessons/course/${courseId}/with-progress`);
        setLessons(res.data);

        const statuses = {};
        for (let lesson of res.data) {
            const statusRes = await api.get(`/lessons/${lesson.id}/completed`);
            statuses[lesson.id] = statusRes.data.is_completed;
        }
        setCompletions(statuses);
    };

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    return (
        <div className="mt-4">
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                ← Back to My Courses
            </button>

            <h4>📖 Course Lessons</h4>

            {lessons.length > 0 ? (
                <ul className="list-group">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="me-auto">
                                <h5>{lesson.title}</h5>
                                <p>{lesson.content}</p>
                            </div>
                            <div className="text-end">
                                {completions[lesson.id] && (
                                    <span className="badge bg-success mb-2">Completed</span>
                                )}
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => navigate(`/student/lessons/${lesson.id}/quiz`)}
                                >
                                    Start Quiz
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No lessons available.</p>
            )}
        </div>
    );
};

export default CourseLessonsStudent;
