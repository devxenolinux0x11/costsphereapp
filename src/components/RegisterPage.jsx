import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';
import '../Auth.css'; // Import shared styles for auth pages

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male'); // Default value
  const [country, setCountry] = useState('');
  const [emailId, setEmailId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success message

    // Validation
    if (!username || !password || !name || !age || !gender || !country || !emailId) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      setError('Invalid email address.');
      return;
    }

    if (isNaN(age) || age <= 0) {
      setError('Age must be a valid positive number.');
      return;
    }

    const userData = {
      username: username,
      password: password,
      name: name,
      age: parseInt(age), // Convert age to number
      gender: gender,
      country: country,
      emailId: emailId,
    };

    try {
      const response = await axios.post('http://localhost:8081/api/users', userData);  // Changed endpoint

      if (response.data.success) {
        setSuccess('User registered successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect after 2 seconds
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Check console for details.');
    }
  };

  return (
    <Container className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <div className="input-group">
              <span className="input-group-icon"><FiUser /></span>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Full Name</Form.Label>
            <div className="input-group">
              <span className="input-group-icon"><FiUser /></span>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmailId">
            <Form.Label>Email address</Form.Label>
            <div className="input-group">
              <span className="input-group-icon"><FiMail /></span>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="auth-button">
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default RegisterPage;
