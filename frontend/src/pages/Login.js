import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role);
    }
  }, [isAuthenticated, user]);

  React.useEffect(() => {
    if (location.hash === '#demo-accounts') {
      document.getElementById('demo-accounts')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [location.hash]);

  const redirectByRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'club_manager':
        navigate('/manager/dashboard');
        break;
      case 'member':
        navigate('/member/dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const userData = await login(email, password);
      redirectByRole(userData.role);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
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
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle text-muted mb-0">
                Sign in to your COSC Club account
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 login-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>

            <div id="demo-accounts" className="login-demo-accounts mt-4">
              <p className="demo-label">Demo accounts</p>
              <div className="demo-account-row">
                <span className="demo-role">Admin</span>
                <span>admin@test.com / Admin123!</span>
              </div>
              <div className="demo-account-row">
                <span className="demo-role">Manager</span>
                <span>manager@test.com / Manager123!</span>
              </div>
              <div className="demo-account-row">
                <span className="demo-role">Member</span>
                <span>member@test.com / Member123!</span>
              </div>
            </div>
            <p className="text-center text-muted small mt-4 mb-0">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
