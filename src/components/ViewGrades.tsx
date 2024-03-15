import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IError {
  field: string;
  message: string;
}

interface IGrade {
  student: string;
  course: string;
  grade: number;
  feedback?: string | null | undefined;
}

function ViewGradesByStudent() {
  const [courseId, setCourseId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [errors, setErrors] = useState<IError[] | null>(null);

  const fetchGrades = async () => {
    try {
        let response
        if(courseId)
            response = await axios.get(`http://localhost:1234/grades/${studentId}?courseId=${courseId}`);
        else
            response = await axios.get(`http://localhost:1234/grades/${studentId}`);
        console.log('Grades:', response.data.body);
      setGrades(response.data.body);
      setErrors(null);
    } catch (error: any) {
      console.error('Error here with: ' , error);
      setErrors([{ field: 'general', message: error.response.data.message }]);
    }
  };

  const handleSearch = () => {
    if (studentId.trim() !== '') {
      fetchGrades();
    } else {
      setErrors([{ field: 'general', message: 'Please enter both course ID and student ID.' }]);
    }
  };

  const handleCourseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseId(e.target.value);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">View Grades by Student</h3>
              <div className="mb-3">
                Course ID: <input type="text" className="form-control" placeholder="Enter Course ID" value={courseId} onChange={handleCourseIdChange} />
              </div>
              <div className="mb-3">
                Student ID: <input type="text" className="form-control" placeholder="Enter Student ID" value={studentId} onChange={handleStudentIdChange} />
              </div>
              <button className="btn btn-primary mb-3" onClick={handleSearch}>Search</button>
              {grades.length > 0 ? (
                <div>
                    <h4>Grades</h4>
                    <ul>
                    {grades.map((grade, index) => (
                        <li key={index}>
                        <p>Student: {grade.student}</p>
                        <p>CourseID: {grade.course}</p>
                        <p>Grade: {grade.grade}</p>
                        {grade.feedback && <p>Feedback: {grade.feedback}</p>}
                        </li>
                    ))}
                    </ul>
                </div>
                ) : (
                <p>No grades found for the specified course and student.</p>
                )}


              {errors && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGradesByStudent;
