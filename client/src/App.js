import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterPage from './Components/Register/RegisterPage';
import MainPage from './Components/Main/MainPage';
import JobDetails from './Components/Main/JobDetail';
import NotFoundPage from './Components/Error/NotFoundPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register/*' element={<RegisterPage />} />
        <Route path='/jobs/:id' component={<JobDetails />} />
        <Route path='/*' component={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
