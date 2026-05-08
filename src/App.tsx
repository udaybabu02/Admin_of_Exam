import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';

import Students from './pages/Students';
import AdminLogin from './pages/AdminLogin';
import Exams from './pages/Exams';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="questions" element={<Questions />} />
          <Route path="exams" element={<Exams />} />
          <Route path="students" element={<Students />} />
          <Route path="exams" element={<div style={{ padding: '40px' }}>Exams Configuration Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;