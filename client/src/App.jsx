import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Public
import Home from "./pages/Home";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProfile from "./admin/AdminProfile";
import AdminProjects from "./admin/AdminProjects";
import AdminSkills from "./admin/AdminSkills";
import AdminGallery from "./admin/AdminGallery";
import AdminMessages from "./admin/AdminMessages";
import {
  AdminExperience,
  AdminEducation,
  AdminCertifications,
  AdminAchievements,
} from "./admin/AdminGeneric";

import "./styles/global.css";

// Admin routes wrapper (checks auth, shows layout)
const AdminApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <AdminLayout user={user}>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="education" element={<AdminEducation />} />
        <Route path="certifications" element={<AdminCertifications />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="messages" element={<AdminMessages />} />
      </Routes>
    </AdminLayout>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLoginGate />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

// Redirect to dashboard if already logged in
const AdminLoginGate = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
};

export default App;
