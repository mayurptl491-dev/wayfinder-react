import { createContext, useContext, useState, useCallback } from 'react';

/*
 * Demo authentication. Accounts live in this browser's localStorage and
 * passwords are SHA-256 hashed with a per-user salt. This is NOT secure
 * enough for production: replace login/signup with calls to a real backend.
 */
const USERS_KEY = 'wf-users';
const SESSION_KEY = 'wf-session';

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

async function hash(password, salt) {
  const data = new TextEncoder().encode(salt + ':' + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null));

  const signup = useCallback(async ({ name, email, password }) => {
    const users = read(USERS_KEY, []);
    const key = email.trim().toLowerCase();
    if (users.some((u) => u.email === key)) {
      throw new Error('An account with this email already exists. Log in instead.');
    }
    const salt = crypto.getRandomValues(new Uint32Array(2)).join('-');
    users.push({ name: name.trim(), email: key, salt, hash: await hash(password, salt) });
    write(USERS_KEY, users);
    const session = { name: name.trim(), email: key };
    write(SESSION_KEY, session);
    setUser(session);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const users = read(USERS_KEY, []);
    const key = email.trim().toLowerCase();
    const found = users.find((u) => u.email === key);
    if (!found || (await hash(password, found.salt)) !== found.hash) {
      throw new Error('Email or password is incorrect.');
    }
    const session = { name: found.name, email: found.email };
    write(SESSION_KEY, session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
