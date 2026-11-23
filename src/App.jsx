import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Destination from './pages/Destination.jsx';

// All application pages are listed here.
export default function App() {
  return (
    <Routes>
      {/* Layout keeps the navbar on every page. */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Only logged-in users can open a destination guide. */}
        <Route
          path="/place/:id"
          element={
            <ProtectedRoute>
              <Destination />
            </ProtectedRoute>
          }
        />

        {/* Send unknown URLs back to the home page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
