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

function UserDeletion() {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);
  const [errors, setErrors] = useState<IError[] | null>(null);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleConfirmation = () => {
    setConfirmation(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:1234/users/${userId}`);
      const foundUser = response.data.body;
      // Find the user with the matching userId
      if (foundUser) {
        setUser(foundUser);
        setErrors(null); 
        setUser(null);
        setConfirmation(false);
        setSuccess('');
      } else {
        setErrors([{ field: 'userId', message: response.data.message }]);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.data.message)
            setErrors([{ field: 'userId', message: error.response.data.message }]);
        else
          setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
      } else {
        setErrors([{ field: 'general', message: 'An error occurred. Please try again later.' }]);
      }
        setUser(null);
        setConfirmation(false);
        setSuccess('');
    }
  };
  
  const handleDelete = async () => {
    try {
      if (user) {
        await axios.delete(`http://localhost:1234/users/${user._id}`);
        console.log('User deleted successfully!');
        setErrors(null);
        setSuccess('User deleted successfully!');
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
    setUser(null);
    setSuccess('');
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Delete User</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Search by User ID" value={userId} onChange={handleUserIdChange} />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Search</button>
              </form>
              {user && (
                <>
                  <div className="alert alert-warning mb-3">
                    Are you sure you want to delete this user?
                  </div>
                  <button className="btn btn-danger w-100 mb-3" onClick={handleConfirmation}>Confirm Delete</button>
                </>
              )}
              {confirmation && (
                <button className="btn btn-danger w-100 mb-3" onClick={handleDelete}>Delete User</button>
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

export default UserDeletion;
