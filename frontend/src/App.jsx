import './App.css'
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import MapPage from './pages/MapPage';
import Layout from './components/Layout';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={user ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
