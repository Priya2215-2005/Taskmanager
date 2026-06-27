import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>✓ TaskFlow</h1>
        <h2 style={styles.heading}>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input
                style={styles.input}
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', borderRadius: 16, padding: '2.5rem', width: 420, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.1)' },
  logo: { fontSize: 24, fontWeight: 700, color: '#2563eb', marginBottom: '1rem', textAlign: 'center' },
  heading: { fontSize: 20, fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center', color: '#111' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', fontSize: 14 },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem' },
  toggle: { textAlign: 'center', marginTop: '1.25rem', fontSize: 14, color: '#666' },
  link: { color: '#2563eb', cursor: 'pointer', fontWeight: 500 },
};
