import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/clubs');
      setClubs(response.data);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return (
    <Container className="page-container">
      <Card className="welcome-card mb-4">
        <Card.Body>
          <h1>Member Dashboard</h1>
          <p className="lead mt-3">
            Welcome, <strong>{user?.name}</strong>!
          </p>
          <p className="text-muted">
            Browse the registered clubs below and discover activities happening
            on campus.
          </p>
          <hr />
          <p className="mb-0 text-muted small">Email: {user?.email}</p>
        </Card.Body>
      </Card>

      <section>
        <h2 className="h3 mb-3">Registered Clubs</h2>
        {loading ? (
          <LoadingSpinner message="Loading clubs..." />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : clubs.length === 0 ? (
          <Alert variant="info">No clubs have been registered yet.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {clubs.map((club) => (
              <Col key={club._id}>
                <Card className="h-100 section-card mb-0">
                  <Card.Body>
                    <Card.Title>{club.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {club.description || 'No description provided.'}
                    </Card.Text>
                  </Card.Body>
                  {club.foundingDate && (
                    <Card.Footer className="text-muted small">
                      Founded {new Date(club.foundingDate).toLocaleDateString()}
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </Container>
  );
};

export default MemberDashboard;
