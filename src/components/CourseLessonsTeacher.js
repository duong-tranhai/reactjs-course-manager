import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CourseLessonsTeacher = ({ courseId }) => {
    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState({ title: '', content: '' });
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [editLessonData, setEditLessonData] = useState({ title: '', content: '' });

    const navigate = useNavigate();

    const fetchLessons = async () => {
        const res = await api.get(`/lessons/course/${courseId}`);
        setLessons(res.data);
    };

    const handleAddLesson = async () => {
        try {
            await api.post(`/lessons/course/${courseId}`, newLesson);
            setNewLesson({ title: '', content: '' });
            fetchLessons();
        } catch {
            alert('Failed to add lesson');
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Delete this lesson?')) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            fetchLessons();
        } catch {
            alert('Failed to delete lesson');
        }
    };

    const handleUpdateLesson = async (lessonId) => {
        try {
            await api.put(`/lessons/${lessonId}`, editLessonData);
            setEditingLessonId(null);
            fetchLessons();
        } catch {
            alert('Failed to update lesson');
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    return (
        <div className="mt-4">
            <h5>📚 Manage Lessons</h5>

            <div className="mb-3">
                <input
                    className="form-control mb-1"
                    placeholder="Lesson Title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <textarea
                    className="form-control mb-2"
                    placeholder="Lesson Content"
                    rows={3}
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                />
                <button className="btn btn-primary btn-sm" onClick={handleAddLesson}>
                    ➕ Add Lesson
                </button>
            </div>

            <ul className="list-group">
                {lessons.map((lesson) => (
                    <li key={lesson.id} className="list-group-item">
                        {editingLessonId === lesson.id ? (
                            <>
                                <input
                                    className="form-control mb-1"
                                    value={editLessonData.title}
                                    onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    value={editLessonData.content}
                                    rows={3}
                                    onChange={(e) => setEditLessonData({ ...editLessonData, content: e.target.value })}
                                />
                                <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateLesson(lesson.id)}>
                                    💾 Save
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditingLessonId(null)}>
                                    ❌ Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <strong>{lesson.title}</strong>
                                <p>{lesson.content}</p>
                                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => {
                                    setEditingLessonId(lesson.id);
                                    setEditLessonData({ title: lesson.title, content: lesson.content });
                                }}>
                                    ✏️ Edit
                                </button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteLesson(lesson.id)}>
                                    🗑 Delete
                                </button>
                            </>
                        )}
                        <button
                            className="btn btn-outline-secondary btn-sm mt-2"
                            onClick={() => navigate(`/teacher/lessons/${lesson.id}/quiz/edit`)}
                        >
                            📝 Edit Quiz
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseLessonsTeacher;
