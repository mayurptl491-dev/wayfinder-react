import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

// Keeps the navbar visible while the selected page changes.
export default function Layout() {
  return (
    <div className="wrap">
      <Navbar />
      <Outlet />
    </div>
  );
}
