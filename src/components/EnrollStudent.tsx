import React, { useState } from 'react';
import axios from 'axios';

interface ICourse {
  _id: string;
  title: string;
  description: string;
  professor: string;
  imageUrl?: string;
  students: string[];
}

interface IError {
  field: string;
  message: string;
}

function EnrollStudent() {
  const [courseId, setCourseId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [courseDetails, setCourseDetails] = useState<ICourse | null>(null);

  const handleCourseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseId(e.target.value);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleSearchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/courses/${courseId}`);
      console.log('Course details:', response.data);
      setCourseDetails(response.data.body);
      setErrors(null);
    } catch (error: any) {
      console.error('Error:', error.message);
      setErrors([{ field: 'general', message: 'An error occurred while fetching course details. Please try again later.' }]);
      setCourseDetails(null);
    }
  };

  const handleEnroll = async () => {
    try {
      if (!courseId || !studentId) {
        setErrors([{ field: 'general', message: 'Please enter a course ID and student ID.' }]);
        return;
      }
      const response = await axios.post(`http://localhost:1234/courses/${courseId}/enroll/${studentId}`);
      console.log('Enrollment successful:', response.data);
      setErrors(null);
      setSuccessMessage('Enrollment successful!');
    } catch (error: any) {
      console.error('Error:', error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Enroll Student to Course</h3>
              <div className="mb-3">
                Course ID: <input type="text" className="form-control" placeholder="Enter Course ID" value={courseId} onChange={handleCourseIdChange} />
                <button className="btn btn-primary ms-2" onClick={handleSearchCourse}>Search</button>
              </div>
              {courseDetails && (
                <div>
                  <h4>Course Details</h4>
                  <p>Title: {courseDetails.title}</p>
                  <p>Description: {courseDetails.description}</p>
                  <p>Professor: {courseDetails.professor}</p>
                  {courseDetails.students.length > 0 && (
                    <div>
                      <h5>Enrolled Students</h5>
                      <ul>
                        {courseDetails.students.map(student => (
                          <li key={student}>{student}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <div className="mb-3">
                Student ID: <input type="text" className="form-control" placeholder="Enter Student ID" value={studentId} onChange={handleStudentIdChange} />
              </div>
              <button className="btn btn-primary mb-3" onClick={handleEnroll}>Enroll</button>
              {errors && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollStudent;
