import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-task" 
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login initialIsLogin={true} />} />
          <Route path="/signup" element={<Login initialIsLogin={false} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
