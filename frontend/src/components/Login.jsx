import React, { useState } from 'react';
import {
  Button,
  TextInputField,
  Pane,
  Heading,
  Card,
  toaster,
  Group
} from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/axios'; // Import from our central API file

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const navigate = useNavigate();

  const authOptions = [
    { label: 'Login', value: 'login' },
    { label: 'Register', value: 'register' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const response = await authAPI.login({ username, password });
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toaster.success('Login successful!');
        navigate('/users');
      } else {
        const response = await authAPI.register({ username, password });
        // You might want to auto-login after registration or just show success message
        toaster.success('Registration successful! Please log in.');
        setMode('login'); // Switch to login mode after successful registration
      }
    } catch (error) {
      const action = mode === 'login' ? 'Login' : 'Registration';
      toaster.danger(`${action} failed. ${error.response?.data?.message || 'Please try again.'}`);
      console.error(`${action} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      background="tint2"
    >
      <Card
        elevation={2}
        background="white"
        padding={40}
        width={400}
        maxWidth="90%"
      >
        <Pane marginBottom={24} textAlign="center">
          <Heading size={700}>User Management System</Heading>
          <Pane marginTop={16} display="flex" justifyContent="center">
            <Group>
              {authOptions.map(({ label, value }) => (
                <Button
                  key={value}
                  isActive={mode === value}
                  onClick={() => setMode(value)}
                >
                  {label}
                </Button>
              ))}
            </Group>
          </Pane>
        </Pane>
        
        <form onSubmit={handleSubmit}>
            <TextInputField
              label="Username"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required={true}
            />
          
          <TextInputField
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <Button
            appearance="primary"
            intent="success"
            isLoading={loading}
            type="submit"
            width="100%"
          >
            {mode === 'login' ? 'Log In' : 'Register'}
          </Button>
        </form>
      </Card>
    </Pane>
  );
};

export default Auth;