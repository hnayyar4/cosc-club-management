import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'club_manager':
        return <Navigate to="/manager/dashboard" replace />;
      case 'member':
        return <Navigate to="/member/dashboard" replace />;
      default:
        break;
    }
  }

  return (
    <div className="home-page">
      <main className="home-hero">
        <div className="hero-content text-center">
          <h1 className="hero-title">
            COSC Club <span className="hero-title-accent">Management</span>
          </h1>
          <Button as={Link} to="/login" size="lg" className="hero-btn-primary">
            Log In
          </Button>
          <Button as={Link} to="/signup" size="lg" className="hero-btn-secondary ms-3">
            Sign Up
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;
