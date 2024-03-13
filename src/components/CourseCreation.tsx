import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ICourse {
  title: string;
  description: string;
  imageUrl?: string;
  professor: string;
  students: string[];
  _id: string;
}

interface IError {
  field: string;
  message: string;
}

function CourseCreation() {
  const [course, setCourse] = useState<ICourse>({
    title: '',
    description: '',
    professor: '',
    imageUrl: '',
    students: [],
    _id: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImage(file || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append('courseImage', image);
      }
      formData.append('title', course.title);
      formData.append('description', course.description);
      formData.append('professor', course.professor);

      const response = await axios.post(`http://localhost:1234/courses/create/${course.professor}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      setCourse({
        title: '',
        description: '',
        professor: '',
        students: [],
        _id: '',
      });
      setImage(null);
      setErrors(null);
      setSuccess('Course added successfully!');
    } catch (error: any) {
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Error response:', );
        setErrors([{ field: 'general', message: error.response.data.message}]);
      } else {
        setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
      }
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Add New Course</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Title" name="title" value={course.title} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" placeholder="Description" name="description" value={course.description} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Professor" name="professor" value={course.professor} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
                {errors && (
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <p key={index}>{error.message}</p>
                      ))}
                    </ul>
                  </div>
                )}
                {success && (
                  <div className="alert alert-success">
                    <p>{success}</p>
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">Add Course</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCreation;
