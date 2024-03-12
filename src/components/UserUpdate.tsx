import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IUser {
  _id: string;
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

function UserUpdate() {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [success, setSuccess] = useState<string>('');

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:1234/users');
      const users = response.data.body;
        console.log(users)
      // Find the user with the matching userId
      const foundUser = users.find((u: any) => u._id === userId);
        
      if (foundUser) {
        setUser(foundUser);
        setErrors(null); 
      } else {
        setErrors([{ field: 'userId', message: 'User not found.' }]);
      }
    } catch (error: any) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            if (error.response.data.body)
            setErrors(error.response.data.body);
            else
            setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
        } else {
            setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
        }
    }
  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (user) {
        console.log("UPDATING")
        console.log(user)
        await axios.put(`http://localhost:1234/users/${user._id}`, user);
        console.log('User updated successfully!');
        setErrors(null)
        setSuccess("User updated successfully!")
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.data.body)
          setErrors(error.response.data.body);
        else
          setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
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
              <h3 className="text-center mb-3">Update User</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Search by User ID" value={userId} onChange={handleUserIdChange} />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Search</button>
              </form>
              {user && (
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="First Name" name="firstName" value={user.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={user.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email" name="email" value={user.email} onChange={handleInputChange} disabled />
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
                  
                  <button type="button" className="btn btn-primary w-100" onClick={handleUpdate}>Update User</button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserUpdate;
