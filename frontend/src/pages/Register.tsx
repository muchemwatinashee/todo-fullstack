import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { Loader2, UserPlus } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/register', { username, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-purple-100/40 w-full max-w-md border border-white">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-50 text-green-500 rounded-2xl mb-4">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-400 mt-2">Join Chantel's Checklist today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input 
            type="text" 
            placeholder="Username"
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-green-200 outline-none transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-green-200 outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#D1FAE5] hover:bg-[#bbf7d0] text-green-800 font-bold rounded-2xl transition-all shadow-md shadow-green-100 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;