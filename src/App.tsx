import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserCreation from './components/UserCreation';

import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/Home';
import UserUpdate from './components/UserUpdate';
import UserDeletion from './components/UserDeletion';

function App() {
  let name = 'John Doe';
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/create' Component={UserCreation}/>
        <Route path='/update' Component={UserUpdate}/>
        <Route path='/delete' Component={UserDeletion}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
