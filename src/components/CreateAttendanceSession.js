import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateAttendanceSession = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('manual');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch {
        alert('Failed to load courses.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchLessonsAndSessions = async () => {
      if (!courseId) {
        setLessons([]);
        setSessions([]);
        return;
      }
      try {
        const [lessonsRes, sessionsRes] = await Promise.all([
          api.get(`/lessons/by-course/${courseId}`),
          api.get(`/attendances/course/${courseId}`)
        ]);
        setLessons(lessonsRes.data);
        setSessions(sessionsRes.data);
      } catch {
        alert('Failed to load lessons or sessions.');
      }
    };
    fetchLessonsAndSessions();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !startTime || !endTime || !type) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await api.post('/attendances/sessions', {
        course_id: parseInt(courseId),
        lesson_id: lessonId ? parseInt(lessonId) : null,
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        type,
      });
      alert('✅ Attendance session created!');
      setLessonId('');
      setStartTime('');
      setEndTime('');
      setType('manual');
      const updatedSessions = await api.get(`/attendances/course/${courseId}`);
      setSessions(updatedSessions.data);
    } catch (err) {
      alert('❌ Failed to create attendance session.');
    }
  };

  return (
    <div className="container mt-4">
      <h4>📅 Create Attendance Session</h4>
      <form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Course *</label>
          <select
            className="form-select"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Lesson (optional)</label>
          <select
            className="form-select"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            disabled={!lessons.length}
          >
            <option value="">Select lesson</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Start Time *</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Time *</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type *</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="quiz-based">Quiz-based</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          ➕ Create Session
        </button>
      </form>

      {/* ✅ Sessions Table */}
      {sessions.length > 0 && (
        <div className="mt-5">
          <h5>📝 Existing Attendance Sessions</h5>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Session ID</th>
                <th>Lesson</th>
                <th>Start</th>
                <th>End</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.lesson_id || '-'}</td>
                  <td>{new Date(s.start_time).toLocaleString()}</td>
                  <td>{new Date(s.end_time).toLocaleString()}</td>
                  <td>{s.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreateAttendanceSession;
