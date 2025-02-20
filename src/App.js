import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import Register from './pages/Register';
import RequestPage from './pages/RequestPage';
import AdminHomePage from './pages/AdminHomePage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';


function ProtectedRoute({ element, isAdminRoute }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/" />;
  }

  return element;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <NavBar />
          <Routes>
            {/* ✅ Redirect Admins to Admin Page */}
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminHomePage />} isAdminRoute />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/requests" element={<ProtectedRoute element={<RequestPage />} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
