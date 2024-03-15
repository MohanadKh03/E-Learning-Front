import React, { useState } from 'react';
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

function AssignGrade() {
  const [studentId, setStudentId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null | undefined>(null);
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleCourseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseId(e.target.value);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(parseFloat(e.target.value));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  const handleAssignGrade = async () => {
    console.log("HRERE")
    try {
      if (!studentId || !courseId || studentId === '' || courseId === '') {
        setErrors([{ field: 'general', message: 'Please enter both student ID and course ID.' }]);
        return;
      }

      const newGrade: IGrade = {
        student: studentId,
        course: courseId,
        grade: grade,
        feedback: feedback,
      };

      const response = await axios.post('http://localhost:1234/grades/assign', newGrade);
      console.log('Grade assigned successfully:', response.data);
      setErrors(null);
      setSuccessMessage('Grade assigned successfully!');
    } catch (error: any) {
      console.error('Error:', error.message);
      setErrors([{ field: 'general', message: error.response.data.message }]);
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Assign Grade to Student</h3>
              <div className="mb-3">
                Student ID: <input type="text" className="form-control" placeholder="Enter Student ID" value={studentId} onChange={handleStudentIdChange} />
              </div>
              <div className="mb-3">
                Course ID: <input type="text" className="form-control" placeholder="Enter Course ID" value={courseId} onChange={handleCourseIdChange} />
              </div>
              <div className="mb-3">
                Grade: <input type="number" className="form-control" placeholder="Enter Grade" value={grade} onChange={handleGradeChange} />
              </div>
              <div className="mb-3">
                Feedback: <input type="text" className="form-control" placeholder="Enter Feedback" value={feedback || ''} onChange={handleFeedbackChange} />
              </div>
              <button className="btn btn-primary mb-3" onClick={handleAssignGrade}>Assign Grade</button>
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

export default AssignGrade;
