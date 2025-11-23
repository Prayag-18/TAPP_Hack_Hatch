import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAPI';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CREATOR' | 'BRAND' | 'FAN'>('CREATOR');
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      if (mode === 'register') {
        // Register and auto-login
        await register(email, password, role);
        const loginResponse = await login(email, password);

        // Store tokens
        localStorage.setItem('accessToken', loginResponse.access_token);
        localStorage.setItem('refreshToken', loginResponse.refresh_token);

        // Redirect to community
        navigate('/community');
      } else {
        // Just login
        const response = await login(email, password);
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        navigate('/community');
      }
    } catch (err: any) {
      setApiError(err.message || `${mode === 'register' ? 'Registration' : 'Login'} failed`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-4xl font-light mb-2 glow-text">
            {mode === 'login' ? 'Welcome Back' : 'Join TAPP'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Create a new account to get started'}
          </p>

          {apiError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6 text-red-200 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-muted/50 border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-muted/50 border-border"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'CREATOR' | 'BRAND' | 'FAN')}
                  className="w-full bg-muted/50 border border-border rounded-lg p-2 text-foreground"
                >
                  <option value="CREATOR">Creator</option>
                  <option value="BRAND">Brand</option>
                  <option value="FAN">Fan</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full neo-button h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setApiError(null);
              }}
              className="w-full text-primary hover:text-primary/80"
            >
              {mode === 'login' ? 'Create one' : 'Sign in instead'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
