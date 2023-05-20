import React from 'react'
import { useNavigate } from "react-router-dom";

export function checkToken(routePath) {
    const navigate = useNavigate();

    const tokenCheck = () => {
        console.log(routePath)
        let appData = localStorage.getItem('token');
        const token = appData;
        if (token) {
            navigate(routePath,  { replace: true })
        } else {
            navigate('/auth/sign-in',  { replace: true })
        }
    }

    React.useEffect(() => {
        tokenCheck()
    }, [])
}

export default checkToken