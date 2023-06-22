import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import Auth from '@/api/Auth'

export function SignIn() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const authLogin = async (e) => {
    e.preventDefault();

    let payload = {
      username: username,
      password: password
    };

    // API Execution
    const {status, data} = await Auth.authUserLogin(payload);

    // Action Scenario
    if(status <= 200){
      let userData = {
        name: data.fullName,
        key: data.userId
      }
      localStorage.setItem('token', data.jwt)
      localStorage.setItem('interface', data.uui)
      localStorage.setItem('userData', JSON.stringify(userData))

      if(data.uui === 'DSIS'){ navigate('/dsis/dashboard', { replace: true })}
      else {
        navigate('/dashboard/home',  { replace: true })
        }
    }
  }

  const tokenCheck = () => {
    let appData = localStorage.getItem('token');
    const token = appData;
    if (token) {
      let uui = localStorage.getItem('interface')
      if(uui === 'DSIS'){ navigate('/dsis/dashboard', { replace: true })}
      else {
        navigate('/dashboard/home',  { replace: true })
        }
    } else {
      navigate('/auth/sign-in',  { replace: true })
    }
  }

  React.useEffect(() => {
    tokenCheck()
  }, [])

  return (
    <>
      {/* <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      /> */}
      <img
        src="/img/dvslogo.png"
        className="absolute inset-0 z-0 h-full w-full object-contain"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <form onSubmit={authLogin}>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-20 place-items-center"
          >
            <Typography className="font-normal text-white-600">
                <strong>Login your account</strong>
            </Typography>
          </CardHeader>
          
            <CardBody className="flex flex-col gap-4">
              
              <Input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                label="Username" 
                size="lg"
              />
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                label="Password" 
                size="lg" 
              />
              
            </CardBody>
          
          <CardFooter className="pt-0">
            <Button type='submit' variant="gradient" fullWidth>
              Sign In
            </Button>
          </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
