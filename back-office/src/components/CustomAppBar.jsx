// src/components/CustomAppBar.jsx

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import logo from '../assets/logo.png'; // Remplace par ton propre chemin

export default function CustomAppBar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ height: 40, mr: 2 }}
        />
        <Typography variant="h6" noWrap>
          Toolpad
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
