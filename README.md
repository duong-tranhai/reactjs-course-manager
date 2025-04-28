Course Manager Frontend (ReactJS)

This project is the frontend interface for the Course Manager system, built with ReactJS, Axios, and Bootstrap.

It supports role-based access, clean UI flows for students, teachers, and admins, and communicates with the FastAPI backend through secure APIs.

🚀 Main Features
🔐 Authentication
Login with JWT token (stored in localStorage)

Refresh token mechanism with session timeout modal

Role-based redirects based on user type (Student, Teacher, Admin)

🧑‍🏫 Teacher Panel
Create Courses

Manage Courses (edit, delete own courses)

Add Lessons to courses

Create Quizzes inside lessons (multi-question quizzes)

View Quiz Attempts and Analytics

Create Attendance Sessions for lessons

Enroll Students manually to courses

👨‍🎓 Student Panel
Browse Course Catalog

Enroll into Courses

View Enrolled Courses

View Lessons inside enrolled courses

Attempt Quizzes (with limited attempts)

View Progress (lesson and course completion %)

Check-In for Attendance linked to lessons

👑 Admin Panel
Dashboard Overview (total users, courses, lessons)

Manage Users (list, search users, see roles)

Manage Courses (view, edit, delete any course)

View Course Details (students enrolled, lessons count)

(Planned) Export users, courses, results to CSV

(Planned) Login Activity Logs for auditing

🛠 Technology Stack

Layer	Technology
Frontend	ReactJS
HTTP Client	Axios
UI Components	Bootstrap, React-Bootstrap
Routing	React Router v6
State Handling	useState, useEffect hooks
Authentication	JWT with Authorization headers