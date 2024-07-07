import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginForm/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import MainPage from './Components/Main/MainPage';
import JobDetail from './Components/Main/JobDetail';
import NotFoundPage from './Components/Error/NotFoundPage';
import RegisterStudent from './Components/Register/RegisterStudent';
import RegisterCompany from './Components/Register/RegisterCompany';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/register/student' element={<RegisterStudent />} />
          <Route path='/register/company' element={<RegisterCompany />} />
          <Route path='/job/:jobId' element={<JobDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
