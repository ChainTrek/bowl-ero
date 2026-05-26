import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bowleroLogo from '../../assets/bowlero-logo.png';

export default function AdminLoginPage() {
  const { login, isAuthenticated, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setStatusMessage('Email and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage('');
      await login(formData.email.trim(), formData.password);
    } catch (error) {
      setStatusMessage(`Login failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="site-logo-link admin-login-card__logo" aria-label="Go to home page">
          <img
            className="site-logo site-logo--login"
            src={bowleroLogo}
            alt="Bowlero logo"
          />
        </Link>
        <h1>Admin Login</h1>
        <p>Sign in to manage Bowl-Ero site content.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {statusMessage && <p className="status-message">{statusMessage}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}