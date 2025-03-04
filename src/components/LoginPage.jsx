// LoginPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import '../Auth.css'; // Import shared styles for auth pages

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    // For demonstration purposes, navigate to home page after successful login
    navigate('/');
  };

  return (
    <Container className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <div className="input-group">
              <span className="input-group-icon"><FiMail /></span>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <span className="input-group-icon"><FiLock /></span>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="auth-button">
            Sign In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
