import { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
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
        await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        onClose();
        window.location.reload(); // Refresh page to update auth state
      } else {
        await authApi.register({
          username: formData.username,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        });
        setIsLogin(true);
      }
    } catch (err) {
      if (isLogin && err instanceof Error && err.message.includes('Invalid credentials')) {
        setShowRegisterSuggestion(true);
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setShowRegisterSuggestion(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <div>
        <div>
          <h2>
            {isLogin ? 'Log In' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <Alert>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {showRegisterSuggestion && (
              <div>
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                  >
                    Register
                  </button>
                </p>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
              >
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={toggleAuthMode}
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
