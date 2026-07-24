import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Toast,
  ToastContainer,
  Badge,
  Alert,
} from 'react-bootstrap';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    foundingDate: '',
  });
  const [clubError, setClubError] = useState('');
  const [submittingClub, setSubmittingClub] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to fetch users',
        'danger'
      );
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchClubs = useCallback(async () => {
    try {
      setLoadingClubs(true);
      const response = await api.get('/clubs');
      setClubs(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to fetch clubs',
        'danger'
      );
    } finally {
      setLoadingClubs(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, [fetchUsers, fetchClubs]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingRole(userId);
      await api.put(`/users/${userId}/role`, { role: newRole });
      showToast('User role updated successfully');
      fetchUsers();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to update user role',
        'danger'
      );
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setClubError('');

    if (!clubForm.name.trim()) {
      setClubError('Club name is required');
      return;
    }

    try {
      setSubmittingClub(true);
      await api.post('/clubs', {
        name: clubForm.name.trim(),
        description: clubForm.description,
        foundingDate: clubForm.foundingDate || null,
      });
      showToast('Club created successfully');
      setClubForm({ name: '', description: '', foundingDate: '' });
      fetchClubs();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create club';
      setClubError(message);
      showToast(message, 'danger');
    } finally {
      setSubmittingClub(false);
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container className="page-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Manage users and club registry</p>
      </div>

      <Card className="section-card">
        <Card.Header as="h4">User Management</Card.Header>
        <Card.Body>
          {loadingUsers ? (
            <LoadingSpinner message="Loading users..." />
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg="secondary" className="role-badge">
                          {formatRole(user.role)}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          style={{ maxWidth: '180px' }}
                          value={user.role}
                          disabled={updatingRole === user._id}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="club_manager">Club Manager</option>
                          <option value="member">Member</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="section-card">
        <Card.Header as="h4">Club Management</Card.Header>
        <Card.Body>
          <Form onSubmit={handleClubSubmit} className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Club Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter club name"
                    value={clubForm.name}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={clubForm.description}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Founding Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={clubForm.foundingDate}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, foundingDate: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            {clubError && <Alert variant="danger">{clubError}</Alert>}

            <Button type="submit" variant="primary" disabled={submittingClub}>
              {submittingClub ? 'Creating...' : 'Create Club'}
            </Button>
          </Form>

          <h5 className="mb-3">Registered Clubs</h5>
          {loadingClubs ? (
            <LoadingSpinner message="Loading clubs..." />
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Founding Date</th>
                  <th>Created By</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {clubs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No clubs registered yet
                    </td>
                  </tr>
                ) : (
                  clubs.map((club) => (
                    <tr key={club._id}>
                      <td>{club.name}</td>
                      <td>{club.description || 'N/A'}</td>
                      <td>{formatDate(club.foundingDate)}</td>
                      <td>
                        {club.createdBy
                          ? `${club.createdBy.name} (${club.createdBy.email})`
                          : 'N/A'}
                      </td>
                      <td>{formatDate(club.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <ToastContainer className="toast-container-fixed" position="top-end">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={4000}
          autohide
        >
          <Toast.Body className={toast.variant === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default AdminDashboard;
