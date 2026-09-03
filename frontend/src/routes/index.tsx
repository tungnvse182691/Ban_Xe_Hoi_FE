import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/common/MainLayout';
import AdminLayout from '@/components/common/AdminLayout';
import { AdminRoute, ProtectedRoute } from '@/components/common/ProtectedRoute';
import Home from '@/pages/Home';
import CarList from '@/pages/CarList';
import CarDetail from '@/pages/CarDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import PostCar from '@/pages/PostCar';
import EditCar from '@/pages/EditCar';
import MyCars from '@/pages/MyCars';
import Compare from '@/pages/Compare';
import Favorites from '@/pages/Favorites';
import Appointments from '@/pages/Appointments';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminPendingCars from '@/pages/admin/PendingCars';
import AdminUsers from '@/pages/admin/Users';
import AdminBrands from '@/pages/admin/Brands';
import AppointmentsAdmin from '@/pages/admin/AppointmentsAdmin';
import WebhookSettings from '@/pages/admin/WebhookSettings';
import ReviewsAdmin from '@/pages/admin/ReviewsAdmin';
import NotFoundPage from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/cars', element: <CarList /> },
      { path: '/cars/:id', element: <CarDetail /> },
      { path: '/compare', element: <Compare /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/post-car', element: <PostCar /> },
          { path: '/cars/:id/edit', element: <EditCar /> },
          { path: '/my-cars', element: <MyCars /> },
          { path: '/appointments', element: <Appointments /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'cars', element: <AdminPendingCars /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'brands', element: <AdminBrands /> },
          { path: 'appointments', element: <AppointmentsAdmin /> },
          { path: 'webhook', element: <WebhookSettings /> },
          { path: 'reviews', element: <ReviewsAdmin /> },        ],
      },
    ],
  },
]);
