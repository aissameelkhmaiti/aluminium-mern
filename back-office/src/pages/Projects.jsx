import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Image } from 'cloudinary-react'; // à ajuster si tu changes la gestion des images
import axios from 'axios';

const categories = ["Fenêtre", "Porte", "Clôture"];
const statuses = ["En cours", "Terminé", "Annulé"];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Pour gérer plusieurs images à uploader (on gère ici juste 1 fichier à la fois simplifié)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    clientName: 'Anonyme',
    location: '',
    date: '',
    status: 'Terminé',
    images: [], // tableau d'images {url, publicId, alt} en lecture, mais ici on upload fichiers
    newImages: [], // fichiers uploadés en local avant envoi
  });

  const [updateData, setUpdateData] = useState({ ...formData });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/project'); // endpoint API projet
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Gestion des modales
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      clientName: 'Anonyme',
      location: '',
      date: '',
      status: 'Terminé',
      images: [],
      newImages: [],
    });
  };

  const handleOpenEdit = async (projectId) => {
    setSelectedProjectId(projectId);
    try {
      const res = await axios.get(`http://localhost:3001/api/project/${projectId}`);
      const data = res.data;
      setUpdateData({
        title: data.title,
        description: data.description,
        category: data.category,
        clientName: data.clientName || 'Anonyme',
        location: data.location || '',
        date: data.date ? data.date.split('T')[0] : '', // format YYYY-MM-DD
        status: data.status,
        images: data.image || [],
        newImages: [],
      });
      setOpenEdit(true);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProjectId(null);
  };

  const handleOpenDelete = (projectId) => {
    setProjectToDelete(projectId);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setProjectToDelete(null);
  };

  // Gestion des inputs
  const handleChange = (e, isUpdate = false) => {
    const { name, value, type, files } = e.target;
    const dataSetter = isUpdate ? setUpdateData : setFormData;
    const currentData = isUpdate ? updateData : formData;

    if (type === 'file') {
      // Pour simplifier, on accepte plusieurs fichiers
      dataSetter({ ...currentData, newImages: Array.from(files) });
    } else {
      dataSetter({ ...currentData, [name]: value });
    }
  };

  // Submit Add Project
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const projectForm = new FormData();
      projectForm.append('title', formData.title);
      projectForm.append('description', formData.description);
      projectForm.append('category', formData.category);
      projectForm.append('clientName', formData.clientName);
      projectForm.append('location', formData.location);
      projectForm.append('date', formData.date || new Date().toISOString());
      projectForm.append('status', formData.status);
      // Upload images one by one (tu devras gérer côté serveur)
      formData.newImages.forEach((file) => {
        projectForm.append('images', file);
      });

      await axios.post('http://localhost:3001/api/project', projectForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Project added successfully');
      handleCloseAdd();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error adding project');
    }
  };

  // Submit Edit Project
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const projectForm = new FormData();
      projectForm.append('title', updateData.title);
      projectForm.append('description', updateData.description);
      projectForm.append('category', updateData.category);
      projectForm.append('clientName', updateData.clientName);
      projectForm.append('location', updateData.location);
      projectForm.append('date', updateData.date || new Date().toISOString());
      projectForm.append('status', updateData.status);
      // New images upload
      updateData.newImages.forEach((file) => {
        projectForm.append('images', file);
      });

      await axios.put(`http://localhost:3001/api/project/${selectedProjectId}`, projectForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Project updated successfully');
      handleCloseEdit();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error updating project');
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/project/${projectToDelete}`);
      alert('Project deleted successfully');
      handleCloseDelete();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    }
  };

  return (
    <div style={{ padding: '2rem', marginLeft: '5rem', maxWidth: 900 }}>
      <h1 className="text-4xl font-semibold mb-5 tracking-tight">Project Management</h1>

      <Button variant="contained" color="primary" onClick={handleOpenAdd} style={{ marginBottom: '1rem' }}>
        Add Project
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="projects table">
          <TableHead>
            <TableRow>
              <TableCell>Images</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map(project => (
              <TableRow key={project._id}>
                <TableCell style={{ display: 'flex', gap: '0.3rem' }}>
                  {(project.image || []).map(img => (
                    <div key={img.publicId} style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                      <Image
                        cloudName="dowbut7iq"
                        publicId={img.publicId}
                        alt={img.alt || project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </TableCell>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.date ? new Date(project.date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell align="right">
                  <Button color="primary" onClick={() => handleOpenEdit(project._id)}>Edit</Button>
                  <Button color="error" onClick={() => handleOpenDelete(project._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Project Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <form id="add-project-form" onSubmit={handleSubmitAdd} style={{ marginTop: 10 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="dense"
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                {statuses.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
              </Select>
            </FormControl>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              accept="image/*"
              multiple
              style={{ marginTop: '1rem' }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button type="submit" form="add-project-form" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <form id="edit-project-form" onSubmit={handleSubmitEdit} style={{ marginTop: 10 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              name="title"
              value={updateData.title}
              onChange={(e) => handleChange(e, true)}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={updateData.description}
              onChange={(e) => handleChange(e, true)}
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={updateData.category}
                onChange={(e) => handleChange(e, true)}
                label="Category"
              >
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="dense"
              label="Client Name"
              name="clientName"
              value={updateData.clientName}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Location"
              name="location"
              value={updateData.location}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Date"
              name="date"
              type="date"
              value={updateData.date}
              onChange={(e) => handleChange(e, true)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={updateData.status}
                onChange={(e) => handleChange(e, true)}
                label="Status"
              >
                {statuses.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
              </Select>
            </FormControl>

            <div style={{ margin: '0.5rem 0' }}>
              <strong>Current Images:</strong>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {(updateData.images || []).map(img => (
                  <Image
                    key={img.publicId}
                    cloudName="dowbut7iq"
                    publicId={img.publicId}
                    alt={img.alt || updateData.title}
                    style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>

            <input
              type="file"
              name="images"
              onChange={(e) => handleChange(e, true)}
              accept="image/*"
              multiple
              style={{ marginTop: '1rem' }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button type="submit" form="edit-project-form" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this project?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
