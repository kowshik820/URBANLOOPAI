import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppMode } from '../context/AppModeContext';
import { User, Award, Shield, MapPin, Mail, Phone, Calendar, Server, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, apiStatus } = useAppMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">You are not signed in.</p>
        <Link to="/auth" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white text-xl font-black shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                {user.role}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Eco Points Ledger</span>
            <div className="flex items-center gap-1.5 font-mono text-2xl font-black text-emerald-600 mt-0.5">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>{user.points} pts</span>
            </div>
          </div>
        </div>

        {/* Contact & Address Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Email: <strong>{user.email}</strong></span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Phone: <strong>{user.phone}</strong></span>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Registered Location: <strong>{user.address}</strong></span>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Member Since: <strong>{new Date(user.createdAt).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Environment Status */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-500" /> Connected Runtime: {mode} Mode
          </span>
          <p className="text-[11px] text-slate-500 font-mono truncate">
            Target Endpoint: {apiStatus.apiUrl || 'Local In-Memory'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/activity" className="text-xs font-bold text-emerald-700 hover:underline">
            View My Full Activity Log →
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};
