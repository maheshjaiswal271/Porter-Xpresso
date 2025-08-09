import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import API from '../config';

const roles = ['USER', 'PORTER', 'ADMIN'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'USER', password: '' });
  const [viewUser, setViewUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [confirmBlock, setConfirmBlock] = useState(null);
  const [confirmUnblock, setConfirmUnblock] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => setEditUser(user);
  const handleEditClose = () => setEditUser(null);
  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/users/${editUser.id}`, editUser, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User updated', severity: 'success' });
      fetchUsers();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
    }
    handleEditClose();
  };

  const handleDelete = (user) => setDeleteUser(user);
  const handleDeleteClose = () => setDeleteUser(null);
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/users/${deleteUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User deleted', severity: 'success' });
      fetchUsers();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
    }
    handleDeleteClose();
  };

  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);
  const handleAddUserSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/admin/users`, newUser, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User added', severity: 'success' });
      fetchUsers();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add user', severity: 'error' });
    }
    setAddUserOpen(false);
    setNewUser({ username: '', email: '', role: 'USER', password: '' });
  };

  const handleView = (user) => setViewUser(user);
  const handleViewClose = () => setViewUser(null);
  const handleReset = (user) => setResetUser(user);
  const handleResetClose = () => setResetUser(null);
  const handleResetConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post( `${API}/auth/reset-password-link/${encodeURIComponent(resetUser.email)}`,{}, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Password reset email sent successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to sent reset password Link', severity: 'error' });
    }
    setResetUser(null);
  };

  const handleBlock = (user) => setConfirmBlock(user);
  const handleUnblock = (user) => setConfirmUnblock(user);

  const confirmBlockUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/users/${confirmBlock.id}/block`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User blocked', severity: 'success' });
      fetchUsers();
    } catch {
      setSnackbar({ open: true, message: 'Failed to block user', severity: 'error' });
    }
    setConfirmBlock(null);
  };

  const confirmUnblockUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/users/${confirmUnblock.id}/unblock`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User unblocked', severity: 'success' });
      fetchUsers();
    } catch {
      setSnackbar({ open: true, message: 'Failed to unblock user', severity: 'error' });
    }
    setConfirmUnblock(null);
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'blocked', headerName: 'Blocked', flex: 0.7, renderCell: (params) => params.row.blocked ? 'Yes' : 'No' },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row)}><VisibilityIcon /></IconButton>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row)} color="error"><DeleteIcon /></IconButton>
          <IconButton onClick={() => handleReset(params.row)} color="primary"><LockResetIcon /></IconButton>
          {params.row.blocked ? (
            <IconButton onClick={() => handleUnblock(params.row)} color="success" title="Unblock User"><LockOpenIcon /></IconButton>
          ) : (
            <IconButton onClick={() => handleBlock(params.row)} color="warning" title="Block User"><BlockIcon /></IconButton>
          )}
        </>
      ),
      flex: 1
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          placeholder="Search by username, email, or role"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddUserOpen}>Add User</Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={filteredUsers} columns={columns} getRowId={row => row.id} loading={loading} />
        </div>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onClose={handleAddUserClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField label="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} fullWidth margin="normal" />
          <TextField label="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} fullWidth margin="normal" />
          <TextField label="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} fullWidth margin="normal" />
          <TextField select label="Role" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} fullWidth margin="normal">
            {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserClose}>Cancel</Button>
          <Button onClick={handleAddUserSave} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      {/* View User Dialog */}
      <Dialog open={!!viewUser} onClose={handleViewClose}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUser && (
            <>
              <Typography>Username: {viewUser.username}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Role: {viewUser.role}</Typography>
              <Typography>ID: {viewUser.id}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Reset Password Dialog */}
      <Dialog open={!!resetUser} onClose={handleResetClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography>Send password reset email to {resetUser?.email}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetClose}>Cancel</Button>
          <Button onClick={handleResetConfirm} color="primary" variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={!!editUser} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField label="Username" value={editUser?.username || ''} fullWidth margin="normal" disabled />
          <TextField label="Email" value={editUser?.email || ''} fullWidth margin="normal" disabled />
          <TextField select label="Role" value={editUser?.role || ''} onChange={e => setEditUser({ ...editUser, role: e.target.value })} fullWidth margin="normal">
            {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={!!deleteUser} onClose={handleDeleteClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete user {deleteUser?.username}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Block User Confirmation Dialog */}
      <Dialog open={!!confirmBlock} onClose={() => setConfirmBlock(null)}>
        <DialogTitle>Block User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to block user {confirmBlock?.username}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBlock(null)}>Cancel</Button>
          <Button onClick={confirmBlockUser} color="warning" variant="contained">Block</Button>
        </DialogActions>
      </Dialog>
      {/* Unblock User Confirmation Dialog */}
      <Dialog open={!!confirmUnblock} onClose={() => setConfirmUnblock(null)}>
        <DialogTitle>Unblock User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to unblock user {confirmUnblock?.username}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmUnblock(null)}>Cancel</Button>
          <Button onClick={confirmUnblockUser} color="success" variant="contained">Unblock</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsers; 