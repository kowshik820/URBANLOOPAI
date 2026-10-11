import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAppMode } from '../context/AppModeContext';
import { UserActivity } from '../types';
import {
  Award,
  Leaf,
  Clock,
  Sparkles,
  Recycle,
  Truck,
  Sun,
  Filter,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserActivityPage: React.FC = () => {
  const { user } = useAuth();
  const { mode } = useAppMode();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const dash = await api.getDashboardSummary();
        setActivities(dash.recentActivities || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mode]);

  const filtered = activities.filter(a => {
    if (filter === 'ALL') return true;
    return a.activityType === filter;
  });

  const totalPoints = activities.reduce((acc, curr) => acc + curr.pointsEarned, 0);
  const totalCO2 = activities.reduce((acc, curr) => acc + curr.co2SavedKg, 0);

  const getActivityIcon = (type: UserActivity['activityType']) => {
    switch (type) {
      case 'RECYCLING_COLLECTED': return Recycle;
      case 'EWASTE_SCHEDULED': return Truck;
      case 'SOLAR_SIMULATED': return Sun;
      case 'GREEN_COMMUTE': return Sparkles;
      case 'REWARD_REDEEMED': return Gift;
      default: return Leaf;
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2 pb-2 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Award className="w-3.5 h-3.5" />
          <span>Eco Ledger & Ledger Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Sustainability Activity History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Verifiable record of community actions, eco points earned, and direct carbon mitigation contributions.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Available Eco Balance</span>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-2">
              {user?.points || totalPoints} <span className="text-xs font-normal text-slate-400 font-sans">pts</span>
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Tier: Urban Eco Steward</span>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <Link
              to="/rewards"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Redeem for Amazon Vouchers →</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Cumulative CO2 Avoided</span>
          <p className="text-2xl font-extrabold text-teal-600 font-mono mt-2">
            {totalCO2.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">kg CO2e</span>
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">Directly attributed to verified actions</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Logged Actions</span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {activities.length} <span className="text-xs font-normal text-slate-400 font-sans">events</span>
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">Recorded across waste, transit, and solar</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {['ALL', 'RECYCLING_COLLECTED', 'EWASTE_SCHEDULED', 'SOLAR_SIMULATED', 'GREEN_COMMUTE', 'REWARD_REDEEMED', 'WASTE_LOGGED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === f
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'All Activity' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading activity ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No events found</p>
            <p className="text-[11px] text-slate-400">Complete an action in the app to record points in your activity ledger.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const Icon = getActivityIcon(item.activityType);
              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                        {item.isDemo && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Demo Audit
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs font-mono">
                      +{item.pointsEarned} pts
                    </span>
                    {item.co2SavedKg > 0 && (
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {item.co2SavedKg} kg CO2 avoided
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
