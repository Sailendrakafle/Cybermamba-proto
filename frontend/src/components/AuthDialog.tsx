import { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { authApi } from '@/services/api';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegisterSuggestion, setShowRegisterSuggestion] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowRegisterSuggestion(false);

    try {
      if (isLogin) {
        const response = await authApi.login({
          username: formData.username,
          password: formData.password,
        });

        if (response.data.success) {
          window.location.href = '/dashboard';
        } else {
          setError(response.data.message || 'Login failed');
        }
      } else {
        const response = await authApi.register({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
        });

        if (response.data.success) {
          window.location.href = '/dashboard';
        } else {
          setError(response.data.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        if (err.response.data.showRegister) {
          setShowRegisterSuggestion(true);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
    });
    setError('');
    setShowRegisterSuggestion(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div>
        <h2>
          {isLogin ? 'Login' : 'Register'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              <div>
                <span>{error}</span>
                {showRegisterSuggestion && (
                  <button
                    type="button"
                    onClick={switchMode}
                  >
                    Register now
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        {!showRegisterSuggestion && (
          <div>
            <button
              type="button"
              onClick={switchMode}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}