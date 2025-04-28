import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="text-center mt-5">
      <h2 className="mb-3">👩‍🎓 Welcome to Your Learning Space</h2>
      <p className="lead">
        This platform connects you with the courses and lessons you need to succeed. Explore, enroll, and stay on track!
      </p>
      <ul className="list-unstyled fs-5 mt-4">
        <li>📚 Browse available courses and enroll in topics that interest you</li>
        <li>🎯 View your personalized course list and track your progress</li>
        <li>📖 Access lesson materials added by your instructors</li>
        <li>🧭 Navigate easily between learning and engagement</li>
      </ul>
      <p className="mt-4">Use the navigation bar above to get started with your courses.</p>
    </div>
  );
};

export default StudentDashboard;
