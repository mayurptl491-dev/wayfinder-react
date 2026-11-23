import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrip } from '../context/TripContext.jsx';
import { FX } from '../data/destinations.js';

// Main navigation and trip settings shown on every page.
export default function Navbar() {
  const { user, logout } = useAuth();
  const { origin, setOrigin, cur, setCur, ORIGINS } = useTrip();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('wayfinder-theme') || 'light');

  // Apply the selected theme and remember it for the next visit.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wayfinder-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Wayfinder
        <small>Plan your next trip</small>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        {user && <NavLink to="/">Destinations</NavLink>}
      </nav>

      <div className="nav-settings">
        <button
          className="btn ghost theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <label className="field">
          From
          <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
            {ORIGINS.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </label>

        <div className="seg" role="group" aria-label="Currency">
          {Object.keys(FX).map((currency) => (
            <button
              key={currency}
              aria-pressed={cur === currency}
              onClick={() => setCur(currency)}
            >
              {currency}
            </button>
          ))}
        </div>

        {user ? (
          <div className="account">
            <span className="who">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn ghost" onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div className="account">
            <Link className="btn ghost" to="/login">Log in</Link>
            <Link className="btn" to="/signup">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
