import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadSavedPlan } from './redux/features/plans/plansSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import MapPage from './pages/MapPage';
import PlansPage from './pages/PlansPage'; // Yeni import
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Tema değişimini yönetmek için useEffect kullanıyoruz
  React.useEffect(() => {
    // localStorage'dan kayıtlı tercihi kontrol et
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Kayıtlı tercih varsa onu kullan
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Kayıtlı tercih yoksa sistem tercihini kullan
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      
      // Sistem teması değiştiğinde dinle (sadece kayıtlı tercih yoksa)
      const handleChange = (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  // Kaydedilmiş planı yükle
  React.useEffect(() => {
    if (user) {
      dispatch(loadSavedPlan());
    }
  }, [dispatch, user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/home" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/plans" element={user ? <PlansPage /> : <Navigate to="/login" />} /> {/* Yeni route */}
          <Route path="/tasks" element={user ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="/resources" element={user ? <ResourcesPage /> : <Navigate to="/login" />} />
          <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
