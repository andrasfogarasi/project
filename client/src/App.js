import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginForm/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import MainPage from './Components/Main/MainPage';
import JobDetail from './Components/Main/JobDetail';
import NotFoundPage from './Components/Error/NotFoundPage';
import RegisterUser from './Components/Register/RegisterUser';
import RegisterCompany from './Components/Register/RegisterCompany';
import { AuthProvider } from './AuthContext';
import UserProfile from './Components/Profile/UserProfile';
import CreateNewJob from './Components/Application/CreateNewJob';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/register/student' element={<RegisterUser />} />
          <Route path='/register/company' element={<RegisterCompany />} />
          <Route path='/job/:jobId' element={<JobDetail />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/company/:companyId/createJob' element={<CreateNewJob />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
