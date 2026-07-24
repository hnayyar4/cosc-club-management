import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'club_manager':
        return '/manager/dashboard';
      case 'member':
        return '/member/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? getDashboardLink() : '/'}>
          COSC Club Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {isAuthenticated && user ? (
              <>
                <Nav.Link as={Link} to={getDashboardLink()}>
                  Dashboard
                </Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard">
                    Admin Panel
                  </Nav.Link>
                )}
                <Navbar.Text className="me-3 text-light">
                  {user.name} ({user.role.replace('_', ' ')})
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
