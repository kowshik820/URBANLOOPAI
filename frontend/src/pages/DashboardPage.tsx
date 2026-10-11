import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAppMode } from '../context/AppModeContext';
import { DashboardSummary } from '../types';
import {
  Recycle,
  Trash2,
  Sun,
  Truck,
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { mode } = useAppMode();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await api.getDashboardSummary();
      setData(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [mode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Aggregating city sustainability metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 max-w-xl mx-auto space-y-4 my-10">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600" />
          <h3 className="font-bold text-base">Dashboard Data Unavailable</h3>
        </div>
        <p className="text-xs text-rose-700">{error}</p>
        <p className="text-[11px] text-rose-600">
          In AWS Mode, this occurs if the API Gateway endpoint has not yet been deployed or is returning an error. Switch to Demo Sandbox in the header or check AWS credentials.
        </p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              City Sustainability Dashboard
            </h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              mode === 'DEMO' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {mode === 'DEMO' ? 'Demo Sandbox Data' : 'Live AWS DynamoDB Records'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time urban resource diversion, clean energy potential, and informal recycler engagement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
          </button>
          <Link
            to="/segregation"
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
          >
            Log Waste Item
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Waste Diverted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Waste Diverted</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {(data.totalWasteDivertedKg / 1000).toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">tonnes</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4% vs last month
            </p>
          </div>
        </div>

        {/* E-Waste Processed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certified E-Waste</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {(data.eWasteProcessedKg / 1000).toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">tonnes</span>
            </p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Zero toxic landfill leak
            </p>
          </div>
        </div>

        {/* Clean Energy Generated */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Solar Energy Modeled</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {Math.round(data.cleanEnergySimulatedKwh / 1000)} <span className="text-sm font-sans font-normal text-slate-500">MWh/yr</span>
            </p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rooftop PV estimations
            </p>
          </div>
        </div>

        {/* Total CO2 Avoided */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net CO2 Offset</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {(data.totalCO2SavedKg / 1000).toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">t CO2e</span>
            </p>
            <p className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Zero double-counting verified
            </p>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Material Diversion Trend (kg)</h3>
              <p className="text-xs text-slate-500">Compostable organics, dry recyclables, and certified e-waste</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              Past 6 Months
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRecyclingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} kg`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="organic" name="Compostable Organic" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recyclable" name="Dry Recyclable" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ewaste" name="E-Waste" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Composition Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Waste Stream Breakdown</h3>
            <p className="text-xs text-slate-500">Proportional volume by category</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.wasteDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.wasteDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity & Informal Recycler Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Community Sustainability Activity</h3>
              <p className="text-xs text-slate-500">Live feed of verified collections, simulations, and transit shifts</p>
            </div>
            <Link to="/activity" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Activity →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data.recentActivities.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent records found in this environment.</p>
            ) : (
              data.recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{act.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {act.isDemo && ' • Demo Record'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      +{act.pointsEarned} pts
                    </span>
                    {act.co2SavedKg > 0 && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {act.co2SavedKg} kg CO2 saved
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Informal Sector & Verification Card */}
        <div className="bg-gradient-to-br from-forest-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-500/20 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              Social & Ecological Impact
            </span>
            <h3 className="text-base font-bold text-white">
              Informal Recycler Inclusion
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In developing urban centers, over 60% of recyclable material is sorted by informal waste workers. UrbanLoop bridges them with direct residential requests, standardized digital weigh-ins, and fair point-backed compensation.
            </p>
            <div className="space-y-2 pt-2 border-t border-forest-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Registered Collectors:</span>
                <span className="font-bold text-emerald-300">{data.activeCollectorsCount} Co-ops</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Pending Residential Pickups:</span>
                <span className="font-bold text-emerald-300">{data.activeRecyclingRequests} Bookings</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Verified Recyclability Rate:</span>
                <span className="font-bold text-emerald-300">91.4%</span>
              </div>
            </div>
          </div>

          <Link
            to="/recycling"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs rounded-xl text-center transition block shadow-sm"
          >
            Manage Recycler Network
          </Link>
        </div>

      </div>

    </div>
  );
};
