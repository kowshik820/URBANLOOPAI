import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ModeBadge } from './ModeBadge';
import {
  Recycle,
  LayoutDashboard,
  Sparkles,
  Sun,
  Truck,
  LineChart,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Award,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Segregation', path: '/segregation', icon: Sparkles },
    { name: 'Recycling', path: '/recycling', icon: Recycle },
    { name: 'E-Waste', path: '/ewaste', icon: Truck },
    { name: 'Solar', path: '/solar', icon: Sun },
    { name: 'Transit', path: '/transport', icon: Truck },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
                <Recycle className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                  UrbanLoop<span className="text-emerald-600 font-black">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 tracking-wide font-medium -mt-1">
                  Circular Sustainability Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls: Mode Badge, Points, Role Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <ModeBadge />

            {/* Points Indicator */}
            {user && (
              <Link
                to="/activity"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition"
                title="View your Eco Points and Activity History"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.points} pts</span>
              </Link>
            )}

            {/* Fast Persona Switcher (For Hackathon Review) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                title="Switch persona role (Resident / Collector / City Admin)"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize">{user?.role || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Switch Persona</p>
                    <p className="text-xs font-medium text-slate-600 truncate">{user?.name}</p>
                  </div>
                  <button
                    onClick={() => handleRoleChange('resident')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      user?.role === 'resident' ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Resident (Kowshik)</span>
                    <span className="text-[10px] text-slate-400">Requestor</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('collector')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      user?.role === 'collector' ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Collector (Rajesh K.)</span>
                    <span className="text-[10px] text-slate-400">Pickups</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      user?.role === 'admin' ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>City Admin (Sarah)</span>
                    <span className="text-[10px] text-slate-400">Municipality</span>
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      to="/profile"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      User Profile & Settings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <ModeBadge />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <Link
              to="/activity"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Eco Points: {user?.points || 0}</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-600 font-semibold"
            >
              Profile ({user?.role})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
