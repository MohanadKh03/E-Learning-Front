import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserCreation from './components/UserCreation';

import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/Home';
import UserUpdate from './components/UserUpdate';
import UserDeletion from './components/UserDeletion';
import CourseCreation from './components/CourseCreation';
import CourseManagement from './components/CoursesManagement';
import EnrollStudent from './components/EnrollStudent';
import AssignGrade from './components/GradeAssignment' 
import ViewGrade from './components/ViewGrades' 

function App() {
  let name = 'John Doe';
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/create' Component={UserCreation}/>
        <Route path='/update' Component={UserUpdate}/>
        <Route path='/delete' Component={UserDeletion}/>
        <Route path='/course-create' Component={CourseCreation}/>
        <Route path='/course-management' Component={CourseManagement}/>
        <Route path='/add-student' Component={EnrollStudent}/>
        <Route path='/assign-grade' Component={AssignGrade}/>
        <Route path='/view-grades' Component={ViewGrade}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
