import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaUserShield,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaUserCog
} from 'react-icons/fa';
import { getAllUsers, updateUserRole, deleteUser, checkAdminAuth } from '../../services/adminApi';
import './UsersManagement.css';

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!checkAdminAuth()) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [navigate, currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      
      const response = await getAllUsers(params);
      const { users: userData, pagination } = response.data.data;
      
      setUsers(userData);
      setTotalPages(pagination.totalPages);
      setTotalUsers(pagination.totalUsers);
      setError('');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setTotalUsers(totalUsers - 1);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <FaUserShield /> : <FaUser />;
  };

  const getRoleClass = (role) => {
    return role === 'admin' ? 'role-admin' : 'role-user';
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-management">
      <div className="page-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/admin')}
          >
            <FaChevronLeft />
            Back to Dashboard
          </button>
          <div className="header-info">
            <h1><FaUsers /> Users Management</h1>
            <p>Manage user accounts and permissions</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="users-stats">
          <span className="stat-item">Total Users: <strong>{totalUsers}</strong></span>
          <span className="stat-item">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <strong>{user.name}</strong>
                        <small>ID: {user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <div className="role-container">
                      <span className={`role-badge ${getRoleClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                        disabled={user.role === 'admin' && user.email === 'admin@cottonco.com'}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <span className="join-date">{formatDate(user.createdAt)}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
            Previous
          </button>
          
          <div className="pagination-info">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
