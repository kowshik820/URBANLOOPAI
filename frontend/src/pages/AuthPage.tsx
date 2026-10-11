import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, UserCheck, ShieldCheck, User, ArrowRight, Lock, Mail } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('resident');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, selectedRole);
    navigate('/dashboard');
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 mx-auto flex items-center justify-center text-white shadow-md">
          <Recycle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isSignUp ? 'Join UrbanLoop AI' : 'Sign in to UrbanLoop AI'}
        </h1>
        <p className="text-xs text-slate-500">
          Empowering citizens, recyclers, and cities toward zero waste.
        </p>
      </div>

      {/* Fast Hackathon Persona Quick-Login Box */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
            Hackathon Fast Sign-In
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">1-Click Test Personas</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickLogin('resident')}
            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition text-center flex flex-col items-center gap-1"
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">Resident</span>
            <span className="text-[9px] text-slate-400">Kowshik V.</span>
          </button>

          <button
            onClick={() => handleQuickLogin('collector')}
            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition text-center flex flex-col items-center gap-1"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Collector</span>
            <span className="text-[9px] text-slate-400">Rajesh K.</span>
          </button>

          <button
            onClick={() => handleQuickLogin('admin')}
            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition text-center flex flex-col items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span className="text-xs font-bold text-slate-800">Admin</span>
            <span className="text-[9px] text-slate-400">Chief Sarah</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="resident">Household Resident / Citizen</option>
                <option value="collector">Informal Recycler / Aggregator</option>
                <option value="admin">Municipal Sustainability Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            {isSignUp ? 'Already registered? Sign in instead' : "Don't have an account? Sign up free"}
          </button>
        </div>
      </div>

    </div>
  );
};
