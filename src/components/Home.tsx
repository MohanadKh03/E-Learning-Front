import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-5">
            <h1>Welcome to E-Learning</h1>
          </div>
          <div className="d-grid gap-2">
            <Link to="/create" className="btn btn-warning btn-lg mb-3">
              Create a new user
            </Link>
            <Link to="/delete" className="btn btn-danger btn-lg mb-3">
              Delete an existing user
            </Link>
            <Link to="/update" className="btn btn-info btn-lg mb-3">
              Update an existing user
            </Link>
            <Link to="/course-create" className="btn btn-info btn-lg mb-3">
              Create a new course
            </Link>
            <Link to="/course-management" className="btn btn-info btn-lg mb-3">
              Manage courses
            </Link>
            <Link to="/add-student" className="btn btn-info btn-lg mb-3">
              Add new student to course
            </Link>
            <Link to="/assign-grade" className="btn btn-info btn-lg mb-3">
              Assign grade to student
            </Link>
            <Link to="/view-grades" className="btn btn-info btn-lg mb-3">
              View grades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
