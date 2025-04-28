import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminCourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await api.get(`/admin/courses/${courseId}/details`);
        setCourse(res.data);
      } catch (err) {
        alert('Failed to load course details');
        navigate('/admin/courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p className="text-danger">Course not found.</p>;

  return (
    <div className="container mt-4">
      <h4>📘 Course Details</h4>
      <p><strong>Title:</strong> {course.title}</p>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Creator:</strong> {course.creator.username} ({course.creator.email})</p>

      <h5 className="mt-4">📚 Lessons</h5>
      {course.lessons.length > 0 ? (
        <ul className="list-group mb-4">
          {course.lessons.map(lesson => (
            <li key={lesson.id} className="list-group-item">
              <strong>{lesson.title}</strong> — {lesson.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No lessons added.</p>
      )}

      <h5>👥 Enrolled Students</h5>
      {course.users.length > 0 ? (
        <ul className="list-group">
          {course.users.map(student => (
            <li key={student.id} className="list-group-item">
              {student.username} ({student.email})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No students enrolled.</p>
      )}

      <button className="btn btn-outline-secondary mt-4" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};

export default AdminCourseDetails;
