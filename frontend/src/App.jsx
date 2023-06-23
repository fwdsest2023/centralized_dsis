import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth, Dsis } from "@/layouts";
import jwtDecode from "jwt-decode";

function App() {
  const navigate = useNavigate();
  const tokenCheck = () => {
    let appData = localStorage.getItem('token');
    const token = appData;
    if (token) {
      const usrData = jwtDecode(token);
      if(usrData.uui === 'DSIS'){ 
        navigate('/dsis/home', { replace: true })
      } else {
        navigate('/dashboard/home',  { replace: true })
      }
    } else {
      navigate('/auth/sign-in',  { replace: false })
    }
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/dsis/*" element={<Dsis />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
