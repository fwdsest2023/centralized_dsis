import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function App() {
  const navigate = useNavigate();
  const tokenCheck = () => {
    let appData = localStorage.getItem('token');
    const token = appData;
    if (token) {
      navigate('/dashboard/home',  { replace: true })
    } else {
      navigate('/auth/sign-in',  { replace: true })
    }
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
