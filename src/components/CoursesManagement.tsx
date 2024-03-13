import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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

function CourseManagement() {
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [success, setSuccess] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('http://localhost:1234/courses');
        setCourses(response.data);
      } catch (error: any) {
        console.error('Error:', error.message);
        setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
      }
    }

    fetchCourses();
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setErrors([{ field: 'searchTerm', message: 'Please enter a course ID.' }]);
      setSelectedCourse(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:1234/courses/${searchTerm}`);
      if (response.data.body.imageUrl) {
        const imageResponse = await axios.get(response.data.body.imageUrl, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(imageResponse.data);
        setSelectedCourse({ ...response.data.body, imageUrl });
      } else {
        setSelectedCourse(response.data.body);
      }
      setErrors(null);
    } catch (error: any) {
      console.error('Error:', error.message);
      setErrors([{ field: 'general', message: error.response.data.message}]);
      setSelectedCourse(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedCourse) {
      setSelectedCourse({
        ...selectedCourse,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedCourse) return;
    try {
      const response = await axios.put(`http://localhost:1234/courses/${selectedCourse._id}`, selectedCourse);
      console.log('Course updated successfully:', response.data);
      setSuccess('Course updated successfully!');
    } catch (error: any) {
      console.error('Error:', error.message);
      if(error.response.data.message)
        setErrors([{ field: 'general', message: error.response.data.message}]);
    }
  };

  const handleViewAll = async () => {
    // Fetch all courses from the database
    try {
        setCourses([])
        setSelectedCourse(null)
        const response = await axios.get('http://localhost:1234/courses');
      console.log(response)
      if(response.data.body.length !== 0)
        setCourses(response.data.body)
      const fetchCourseImages = async () => {
        try {
          const imagePromises = courses.map(async (course) => {
            if (course.imageUrl) {
              const imageResponse = await axios.get(course.imageUrl, { responseType: 'blob' });
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...course, imageUrl };
            }
            return course;
          });
          const coursesWithImages = await Promise.all(imagePromises);
          setCourses(coursesWithImages);
          setErrors(null);
        } catch (error: any) {
          console.error('Error:', error.message);
          setErrors([{ field: 'general', message: 'An error occurred while fetching course images. Please try again later.' }]);
        }
      };
      await fetchCourseImages();
    } catch (error: any) {
      console.error('Error:', error.message);
      setErrors([{ field: 'general', message: 'An error occurred while fetching courses. Please try again later.' }]);
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">View and Update Courses</h3>
              <div className="mb-3 d-flex">
                <input type="text" className="form-control me-2" placeholder="Enter Course ID" onChange={handleIdChange} />
                <button className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button className="btn btn-primary" onClick={handleViewAll}>View All</button>
              </div>
              {selectedCourse && (
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Title" name="title" value={selectedCourse.title} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" placeholder="Description" name="description" value={selectedCourse.description} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Professor" name="professor" value={selectedCourse.professor} onChange={handleInputChange} />
                  </div>
                  {selectedCourse.imageUrl && (
                    <div className="mb-3">
                      <img src={selectedCourse.imageUrl} alt="Course" className="img-fluid" />
                    </div>
                  )}
                  <button type="button" className="btn btn-primary mb-3" onClick={handleUpdate}>Update Course</button>
                </form>
              )}
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
              {courses.length > 0 && (
  <div>
    <h4>All Courses</h4>
    <div className="row">
      {courses.map(course => (
        <div className="col-md-6 mb-3" key={course._id}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{course.title}</h5>
              <p className="card-text"><strong>Description:</strong> {course.description}</p>
              <p className="card-text"><strong>Professor:</strong> {course.professor}</p>
              {course.imageUrl && (
                <div>
                  <img src={course.imageUrl} alt={course.title} className="img-fluid mb-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;
