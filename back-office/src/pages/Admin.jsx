import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Image } from 'cloudinary-react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    role: 'admin',
    verification: false,
    status: false,
    image: null,
  });

  const [updateData, setUpdateData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    role: 'admin',
    verification: false,
    status: false,
    image: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/user');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for opening modals
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setFormData({
      email: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      role: 'admin',
      verification: false,
      status: false,
      image: null,
    });
  };

  const handleOpenEdit = async (userId) => {
    setSelectedUserId(userId);
    try {
      const res = await axios.get(`http://localhost:3001/api/user/${userId}`);
      const data = res.data;
      setUpdateData({
        email: data.email,
        password: '',
        confirm_password: '',
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        verification: data.verification,
        status: data.status,
        image: null, // reset, user can upload new image
      });
      setOpenEdit(true);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUserId(null);
  };

  const handleOpenDelete = (userId) => {
    setUserToDelete(userId);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setUserToDelete(null);
  };

  // Form change handlers
  const handleChange = (e, isUpdate = false) => {
    const { name, value, type, checked, files } = e.target;
    const dataSetter = isUpdate ? setUpdateData : setFormData;
    const currentData = isUpdate ? updateData : formData;

    if (type === 'checkbox') {
      dataSetter({ ...currentData, [name]: checked });
    } else if (type === 'file') {
      dataSetter({ ...currentData, [name]: files[0] });
    } else {
      dataSetter({ ...currentData, [name]: value });
    }
  };

  // Submit handlers
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const user = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        user.append(key, value);
      });

      await axios.post('http://localhost:3001/api/user/register', user);
      alert('User added successfully');
      handleCloseAdd();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error adding user');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const user = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        user.append(key, value);
      });

      await axios.put(`http://localhost:3001/api/user/${selectedUserId}`, user);
      alert('User updated successfully');
      handleCloseEdit();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/user/${userToDelete}`);
      alert('User deleted successfully');
      handleCloseDelete();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  return (
    <div style={{ padding: '2rem', marginLeft: '5rem', maxWidth: 900 }}>
      <h1 className="text-4xl font-semibold mb-5 tracking-tight">
  Admin Management
</h1>

      <Button variant="contained" color="primary" onClick={handleOpenAdd} style={{ marginBottom: '1rem' }}>
        Add Admin
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.image ? (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                      <Image cloudName="dowbut7iq" publicId={user.image.publicId} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell style={{ color: user.status ? 'green' : 'red' }}>
                  {user.status ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell align="right">
                  <Button color="primary" onClick={() => handleOpenEdit(user._id)}>Edit</Button>
                  <Button color="error" onClick={() => handleOpenDelete(user._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <form id="add-user-form" onSubmit={handleSubmitAdd} style={{ marginTop: 10 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>
                  <Checkbox
                    name="verification"
                    checked={formData.verification}
                    onChange={handleChange}
                  />
                  Verification
                </label>
              </div>
              <div>
                <label>
                  <Checkbox
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  Status
                </label>
              </div>
            </div>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ marginTop: '1rem' }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button type="submit" form="add-user-form" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <form id="edit-user-form" onSubmit={handleSubmitEdit} style={{ marginTop: 10 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              value={updateData.email}
              onChange={(e) => handleChange(e, true)}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Password"
              name="password"
              type="password"
              value={updateData.password}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={updateData.confirm_password}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="First Name"
              name="first_name"
              value={updateData.first_name}
              onChange={(e) => handleChange(e, true)}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Last Name"
              name="last_name"
              value={updateData.last_name}
              onChange={(e) => handleChange(e, true)}
              required
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>
                  <Checkbox
                    name="verification"
                    checked={updateData.verification}
                    onChange={(e) => handleChange(e, true)}
                  />
                  Verification
                </label>
              </div>
              <div>
                <label>
                  <Checkbox
                    name="status"
                    checked={updateData.status}
                    onChange={(e) => handleChange(e, true)}
                  />
                  Status
                </label>
              </div>
            </div>
            <input
              type="file"
              name="image"
              onChange={(e) => handleChange(e, true)}
              accept="image/*"
              style={{ marginTop: '1rem' }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button type="submit" form="edit-user-form" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
