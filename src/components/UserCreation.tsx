import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface IError {
  field: string;
  message: string;
}

function UserCreation() {
  const [user, setUser] = useState<IUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student', // Default role
  });

//   const [errors, setErrors] = useState<string | null>(null);
const [errors,setErrors] = useState<IError[] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1234/users/create', user);
      console.log('Response:', response.data);
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Student',
      });
      setErrors(null);
    } catch (error: any) {
        console.log("HERE ARE" + errors)
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrors(error.response.data.body);
      } else {
        console.error('Error:', error.message);
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
          <h3 className="text-center mb-3">New User</h3> 
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="First Name" name="firstName" value={user.firstName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={user.lastName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email" name="email" value={user.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password" value={user.password} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <select className="form-select" name="role" value={user.role} onChange={handleInputChange}>
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
              </select>
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
            <button type="submit" className="btn btn-primary w-100">Create User</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default UserCreation;
