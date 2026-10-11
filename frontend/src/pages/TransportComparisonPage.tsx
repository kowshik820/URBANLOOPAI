import React, { useState, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TransportMode, TransportCalculationResult } from '../types';
import {
  Car,
  Zap,
  Bus,
  Train,
  Bike,
  Footprints,
  Award,
  CheckCircle2,
  TrendingDown,
  Info,
  Sliders,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export const TransportComparisonPage: React.FC = () => {
  const { user, addPoints } = useAuth();

  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [tripsPerMonth, setTripsPerMonth] = useState<number>(22); // average monthly commute days
  const [loggedTripMode, setLoggedTripMode] = useState<TransportMode | null>(null);
  const [pointsClaimedToday, setPointsClaimedToday] = useState(false);

  const result: TransportCalculationResult = useMemo(() => {
    return api.calculateTransport(distanceKm, tripsPerMonth);
  }, [distanceKm, tripsPerMonth]);

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'petrol_car': return Car;
      case 'ev_car': return Zap;
      case 'city_bus': return Bus;
      case 'metro_train': return Train;
      case 'bicycle': return Bike;
      case 'walking': return Footprints;
    }
  };

  const getModeColor = (mode: TransportMode) => {
    switch (mode) {
      case 'petrol_car': return '#ef4444';
      case 'ev_car': return '#3b82f6';
      case 'city_bus': return '#f59e0b';
      case 'metro_train': return '#10b981';
      case 'bicycle': return '#059669';
      case 'walking': return '#047857';
    }
  };

  const handleLogCommute = (mode: TransportMode, pointsEarned: number, co2SavedKg: number) => {
    if (pointsClaimedToday) {
      alert('You have already logged your primary commute for today! Duplicate prevention is active.');
      return;
    }

    if (pointsEarned <= 0) {
      alert('Petrol car trips do not generate eco bonus points. Choose EV, public transit, or active cycling to earn points!');
      return;
    }

    api.logLocalActivity({
      userId: user?.id || 'user-01',
      activityType: 'GREEN_COMMUTE',
      title: `Low-Carbon Trip Logged: ${mode.replace('_', ' ').toUpperCase()}`,
      description: `Traveled ${distanceKm} km using low-carbon transit instead of gasoline vehicle.`,
      pointsEarned,
      co2SavedKg: Number(((distanceKm * 0.192) - (co2SavedKg)).toFixed(1))
    });

    addPoints(pointsEarned);
    setLoggedTripMode(mode);
    setPointsClaimedToday(true);
  };

  const chartData = result.options.map(opt => ({
    name: opt.title.split(' ')[0],
    emissions: opt.annualEmissionsKg,
    mode: opt.mode
  }));

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2 pb-2 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-semibold border border-purple-200">
          <Train className="w-3.5 h-3.5 text-purple-600" />
          <span>Multi-Modal Clean Mobility</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          EV, Transit & Active Mobility Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Compare carbon intensity across internal combustion vehicles, electric cars, public bus, electrified subway, and non-motorized cycling based on verified IPCC passenger-km factors.
        </p>
      </div>

      {/* Input Parameters Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-slate-700">One-Way Commute Distance (km)</label>
              <span className="font-bold font-mono text-emerald-700">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 1)}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Typical city commute: 5 km - 25 km</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-slate-700">Commute Trips Per Month</label>
              <span className="font-bold font-mono text-purple-700">{tripsPerMonth} trips</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              step="2"
              value={tripsPerMonth}
              onChange={(e) => setTripsPerMonth(parseInt(e.target.value) || 1)}
              className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Based on working days or regular trips</span>
          </div>
        </div>

        {/* Recommendation Pill */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">
              Optimal Low-Carbon Choice for {distanceKm} km: <strong className="text-emerald-700">{result.recommendedMode}</strong>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Potential Annual Savings vs Petrol: <strong className="text-slate-900">{result.annualSavingsVsPetrolKgCO2.toLocaleString()} kg CO2e</strong>
          </span>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.options.map((opt) => {
          const Icon = getModeIcon(opt.mode);
          const color = getModeColor(opt.mode);
          return (
            <div
              key={opt.mode}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                opt.isZeroEmission
                  ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2.5 rounded-xl text-white shadow-xs"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{opt.title}</h3>
                      <span className="text-[10px] text-slate-400">{opt.emissionsGramsPerKm} g CO2 / pass-km</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    opt.sustainabilityScore >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : opt.sustainabilityScore >= 50
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {opt.sustainabilityScore}/100 Eco
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Single Trip CO2</span>
                    <strong className="text-slate-800 font-mono">{opt.tripEmissionsKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Annual Total</span>
                    <strong className="text-slate-800 font-mono">{opt.annualEmissionsKg.toLocaleString()} kg</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Monthly Cost</span>
                    <strong className="text-slate-800 font-mono">${opt.monthlyCostEstimate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Points Earnable</span>
                    <strong className="text-emerald-700 font-mono">+{opt.greenPointsAwarded} pts</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                {opt.greenPointsAwarded > 0 ? (
                  <button
                    onClick={() => handleLogCommute(opt.mode, opt.greenPointsAwarded, opt.tripEmissionsKg)}
                    disabled={pointsClaimedToday}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      loggedTripMode === opt.mode
                        ? 'bg-emerald-100 text-emerald-800'
                        : pointsClaimedToday
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {loggedTripMode === opt.mode ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Commute Logged Today
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" /> Log Trip (+{opt.greenPointsAwarded} pts)
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-400 py-1.5 italic">
                    Baseline mode (0 bonus points)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Annual Emission Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Annual Carbon Footprint by Mode (kg CO2e)</h3>
            <p className="text-xs text-slate-500">Based on {distanceKm} km commute x {tripsPerMonth} trips/month</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Lower is better</span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v} kg`} />
              <Tooltip
                formatter={(val: any) => [`${val} kg CO2e / yr`, 'Annual Emissions']}
                contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getModeColor(entry.mode as any)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emission Factors & Standards Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-500" /> Emission Factors & Accounting Method
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 leading-relaxed">
          <p>
            • <strong>Gasoline Vehicle:</strong> 192 g CO2e/km (average internal combustion engine car with single occupancy, EPA 2024).
          </p>
          <p>
            • <strong>Electric Vehicle (EV):</strong> 53 g CO2e/km (includes regional power plant grid mix upstream transmission loss).
          </p>
          <p>
            • <strong>Transit Bus:</strong> 82 g CO2e/passenger-km (average 15-passenger municipal diesel-hybrid fleet).
          </p>
          <p>
            • <strong>Electric Subway:</strong> 28 g CO2e/passenger-km (high passenger density electric rail traction).
          </p>
        </div>
      </div>

    </div>
  );
};
