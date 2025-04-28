import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CreateCourse from './components/CreateCourse';
import ManageCourses from './components/ManageCourses';
import CourseCatalog from './components/CourseCatalog';
import MyCourses from './components/MyCourses';
import CourseLessonsTeacher from './components/CourseLessonsTeacher';
import CourseLessonsStudent from './components/CourseLessonsStudent'
import TeacherDashboard from './components/TeacherDashboard';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import LessonQuizStudent from './components/LessonQuizStudent';
import LessonQuizEditor from './components/LessonQuizEditor';
import ProtectedRoute from './components/ProtectedRoute';
import QuizResultsTable from './components/QuizResultsTable';
import AdminDashboard from './components/AdminDashboard';
import UserListAdmin from './components/UserListAdmin';
import AdminCourseList from './components/AdminCourseList';
import AdminCourseDetails from './components/AdminCourseDetails';
import CreateAttendanceSession from './components/CreateAttendanceSession';

import { getUserRoleId, getPayload } from './utils/tokenUtils';
import api from './services/api';

const CourseLessonsTeacherWrapper = () => {
  const { courseId } = useParams();
  return <CourseLessonsTeacher courseId={parseInt(courseId)} />;
};

const CourseLessonsStudentWrapper = () => {
  const { courseId } = useParams();
  return <CourseLessonsStudent courseId={parseInt(courseId)} />;
};

const LessonQuizEditorWrapper = () => {
  const { lessonId } = useParams();
  return <LessonQuizEditor lessonId={parseInt(lessonId)} />;
};

const LessonQuizStudentWrapper = () => {
  const { lessonId } = useParams();
  return <LessonQuizStudent lessonId={parseInt(lessonId)} />;
};

const QuizResultsTableWrapper = () => {
  const { quizId } = useParams();
  return <QuizResultsTable lessonId={parseInt(quizId)} />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [expireTime, setExpireTime] = useState();

  useEffect(() => {
    const payload = getPayload();
    if (!payload?.exp) return;

    const expTime = payload.exp * 1000; // ms
    setExpireTime(expTime);

    const now = Date.now();
    const warningTime = expTime - 60000;

    const warningTimeout = setTimeout(() => setShowTimeoutModal(true), warningTime - now);
    const logoutTimeout = setTimeout(() => handleLogout(), expTime - now);

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
    };
  }, [loggedIn]); // Rerun when logged in again


  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setShowTimeoutModal(false);
  };

  const handleRefresh = async () => {
    try {
      const res = await api.post("/auth/refresh-token", null, { withCredentials: true });
      localStorage.setItem("token", res.data.access_token);

      // Optionally reset decoded data
      const payload = getPayload(res.data.access_token);
      setExpireTime(payload.exp * 1000); // UNIX timestamp → ms

      setShowTimeoutModal(false);
      alert("✅ Session refreshed");
    } catch {
      alert("❌ Failed to refresh session. Please login again.");
      handleLogout();
    }
  };


  if (!loggedIn) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onLogin={() => {
          setLoggedIn(true);
          setShowTimeoutModal(false);
        }}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <>
      {showTimeoutModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Session Expiring</h5>
              </div>
              <div className="modal-body">
                <p>Your session will expire at: {new Date(expireTime).toLocaleTimeString()}. Please save your work.</p>
              </div>
              <button className="btn btn-outline-primary me-2" onClick={handleRefresh}>
                🔄 Refresh Session
              </button>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleLogout}>Logout Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Navbar onLogout={handleLogout} />
      <div className="container mt-4">
        <h1 className="mb-4">Student Course Portal</h1>
        <Routes>
          {getUserRoleId() === 1 && (
            <>
              <Route path="/" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/courses" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <ManageCourses />
                </ProtectedRoute>
              } />
              <Route path="/teacher/create" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <CreateCourse onCreated={() => window.location.reload()} />
                </ProtectedRoute>
              } />
              <Route path="/courses/:courseId/lessons/manage" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <CourseLessonsTeacherWrapper />
                </ProtectedRoute>
              } />
              <Route path="/teacher/lessons/:lessonId/quiz/edit" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <LessonQuizEditorWrapper />
                </ProtectedRoute>
              } />
              <Route path="/quizzes/:quizId/results" element={<ProtectedRoute allowedRoles={[1]}>
                <QuizResultsTableWrapper />
              </ProtectedRoute>} />
              <Route path="/teacher/attendance/create" element={
                <ProtectedRoute allowedRoles={[1]}>
                  <CreateAttendanceSession />
                </ProtectedRoute>
              } />
            </>
          )}
          {getUserRoleId() === 2 && (
            <>
              <Route path="/" element={
                <ProtectedRoute allowedRoles={[2]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/catalog" element={
                <ProtectedRoute allowedRoles={[2]}>
                  <CourseCatalog />
                </ProtectedRoute>} />
              <Route path="/student/my-courses" element={
                <ProtectedRoute allowedRoles={[2]}>
                  <MyCourses />
                </ProtectedRoute>} />
              <Route path="/student/courses/:courseId/lessons" element={
                <ProtectedRoute allowedRoles={[2]}>
                  <CourseLessonsStudentWrapper />
                </ProtectedRoute>} />
              <Route path="/student/lessons/:lessonId/quiz" element={
                <ProtectedRoute allowedRoles={[2]}>
                  <LessonQuizStudentWrapper />
                </ProtectedRoute>} />
            </>
          )}
          {getUserRoleId() === 3 && (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserListAdmin />} />
              <Route path="/admin/courses" element={<AdminCourseList />} />
              <Route path="/admin/courses/:courseId/details" element={<AdminCourseDetails />} />
            </>
          )}
          <Route path="*" element={<p>404 - Page not found</p>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
