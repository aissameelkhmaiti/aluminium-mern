// src/routes/layout.jsx

import * as React from 'react';
import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'; // ou FolderIcon



import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'admins', title: 'Admins', icon: <AdminPanelSettingsIcon /> },
  { segment: 'projects', title: 'Projects', icon: <WorkOutlineIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Analytics' },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      { segment: 'sales', title: 'Sales', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
    ],
  },
  { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
];
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function Layout({ window }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, ''); // remove initial "/"

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={window}>
      <DashboardLayout>
        <Box sx={{ p: 4 }}>
          <Outlet /> {/* Where route pages will be rendered */}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};
