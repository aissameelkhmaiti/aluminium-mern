// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';

import DashboardPage from './pages/Dashboard';
import AdminsPage from './pages/Admin';
import ProjectsPage from './pages/Projects';
import LoginPage from './pages/Login';
import NotFound from './components/NotFound'; // <-- Import the 404 page

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'admins', element: <AdminsPage /> },
      { path: 'projects', element: <ProjectsPage /> },
  
    ],
  },
  {
    path: '*',
    element: <NotFound />, // Optional top-level fallback (e.g., for unknown top-level paths)
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
