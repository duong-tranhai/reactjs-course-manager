import React from 'react';

const TeacherDashboard = () => {
  return (
    <div className="text-center mt-5">
      <h2 className="mb-3">👨‍🏫 Welcome to the Teacher Dashboard</h2>
      <p className="lead">
        This Course Management System empowers you to manage and deliver high-quality online learning experiences.  
      </p>
      <ul className="list-unstyled fs-5 mt-4">
        <li>📋 Create and edit courses with ease</li>
        <li>👥 Enroll and manage student participation</li>
        <li>📚 Add structured lessons to each course</li>
        <li>🗂 Track content ownership and permissions securely</li>
      </ul>
      <p className="mt-4">Use the navigation bar above to begin managing your content.</p>
    </div>
  );
};

export default TeacherDashboard;
