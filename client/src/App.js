import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/Login/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import MainPage from './Components/Main/MainPage';
import JobDetail from './Components/Main/JobDetail';
import NotFoundPage from './Components/Error/NotFoundPage';
import RegisterUser from './Components/Register/RegisterUser';
import RegisterCompany from './Components/Register/RegisterCompany';
import { AuthProvider } from './AuthContext';
import UserProfile from './Components/Profile/UserProfile';
import CreateNewJob from './Components/Application/CreateNewJob';
import ViewUserProfile from './Components/Profile/ViewUserProfile';
import Applicants from './Components/Application/Applicants';
import CompanyProfile from './Components/Profile/CompanyProfile';
import SendProblem from './Components/Admin/SendProblem';
import Users from './Components/Admin/Users';
import Companies from './Components/Admin/Companies';
import Problems from './Components/Admin/Problems';
import Departments from './Components/Admin/Departments';
import MyApplications from './Components/Application/MyApplications';
import Accepts from './Components/Application/Accepts';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/register/student' element={<RegisterUser />} />
          <Route path='/register/company' element={<RegisterCompany />} />
          <Route path='/job/:jobId' element={<JobDetail />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/company' element={<CompanyProfile />} />
          <Route path='/application' element={<MyApplications />} />
          <Route path='admin/user' element={<Users />} />
          <Route path='admin/company' element={<Companies />} />
          <Route path='admin/problem' element={<Problems />} />
          <Route path='admin/department' element={<Departments />} />
          <Route path='/report' element={<SendProblem />} />
          <Route path='/profile/:profileId' element={<ViewUserProfile />} />
          <Route path='/company/createJob' element={<CreateNewJob />} />
          <Route path='/job/:jobId/student' element={<Accepts />} />
          <Route path='/company/job/applicant/:jobId' element={<Applicants />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
