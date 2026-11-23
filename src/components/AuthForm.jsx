import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DEST } from '../data/destinations.js';

/* Shared by the log in and sign up pages. */
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? DEST[from.split('/').pop()] : null;

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (user && !busy) return <Navigate to={from || '/'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup) {
      if (form.name.trim().length < 2) return setError('Enter your name.');
      if (form.password.length < 8) return setError('Use a password with at least 8 characters.');
      if (form.password !== form.confirm) return setError('The two passwords do not match.');
    }
    setBusy(true);
    try {
      await (isSignup ? signup(form) : login(form));
      navigate(from || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
      setBusy(false);
    }
  };

  const other = isSignup ? '/login' : '/signup';

  return (
    <main className="auth">
      <form className="panel authcard" onSubmit={submit} noValidate>
        <div>
          <h2>{isSignup ? 'Create your account' : 'Log in to continue'}</h2>
          <p className="sub">
            {target
              ? `Your guide to ${target.name} is ready. ${isSignup ? 'Sign up' : 'Log in'} to open it.`
              : 'Save your start city and open any destination guide.'}
          </p>
        </div>
        {isSignup && (
          <label className="lab">Name
            <input id="name" type="text" autoComplete="name" value={form.name} onChange={set('name')} required />
          </label>
        )}
        <label className="lab">Email
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
        </label>
        <label className="lab">Password
          <input id="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} required />
        </label>
        {isSignup && (
          <label className="lab">Confirm password
            <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
          </label>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn wide" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>
        <p className="swap">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={other} state={location.state}>{isSignup ? 'Log in' : 'Create an account'}</Link>
        </p>
        <p className="note">Demo sign-in: accounts are stored only in this browser. Connect a real backend before going live.</p>
      </form>
    </main>
  );
}
