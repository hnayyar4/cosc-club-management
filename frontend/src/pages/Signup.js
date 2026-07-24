import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/member/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);
      navigate('/member/dashboard');
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <div className="login-back-link">
          <Link to="/">&larr; Back to Home</Link>
        </div>
        <Card className="login-card mx-auto">
          <Card.Body className="p-4 p-md-5">
            <div className="login-header text-center mb-4">
              <h2 className="login-title">Create an Account</h2>
              <p className="login-subtitle text-muted mb-0">
                Join the COSC Club Management System
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength="6"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" className="login-submit-btn w-100" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </Form>

            <p className="text-center text-muted small mt-4 mb-0">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
