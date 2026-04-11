import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email');
      setLoading(false);
      return;
    }

    // Demo Login (Replace with API call)
    setTimeout(() => {
      if (email === 'admin@ananta.com' && password === 'admin123') {
        const adminData = {
          id: 1,
          email: email,
          name: 'Admin',
          role: 'Super Admin'
        };
        login(adminData);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary'>
      <div className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-primary mb-2'>Admin Panel</h1>
          <p className='text-gray-600'>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className='space-y-6'>
          {/* Email */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@ananta.com'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className='mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-primary'>
          <p className='text-sm text-gray-600 font-semibold mb-2'>Demo Credentials:</p>
          <p className='text-sm text-gray-600'>Email: admin@ananta.com</p>
          <p className='text-sm text-gray-600'>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;