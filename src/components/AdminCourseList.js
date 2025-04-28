import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminCourseList = () => {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data);
        } catch {
            alert('Failed to load courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEditClick = (course) => {
        setEditingCourse(course);
        setEditTitle(course.title);
        setEditDescription(course.description);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/admin/courses/${editingCourse.id}`, {
                title: editTitle,
                description: editDescription,
            });
            setShowEditModal(false);
            fetchCourses();
        } catch {
            alert('Failed to update course.');
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/admin/courses/${courseId}`);
            fetchCourses();
        } catch {
            alert('Failed to delete course.');
        }
    };

    return (
        <div className="container mt-4">
            <h4>📚 All Courses</h4>
            {loading ? (
                <p>Loading...</p>
            ) : courses.length === 0 ? (
                <p className="text-muted">No courses found.</p>
            ) : (
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Creator</th>
                            <th>Enrolled</th>
                            <th>Lessons</th>
                            <th>Avg. Completion</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.title}</td>
                                <td>{c.creator.username}</td>
                                <td>{c.total_students}</td>
                                <td>{c.lesson_count}</td>
                                <td>{c.avg_completion_rate}%</td>
                                <td>
                                    <button
                                        className="btn btn-outline-info btn-sm me-2"
                                        onClick={() => navigate(`/admin/courses/${c.id}/details`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => handleEditClick(c)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ✅ Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminCourseList;
