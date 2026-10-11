import React, { useState, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SolarCalculationInput, SolarCalculationResult } from '../types';
import {
  Sun,
  DollarSign,
  Zap,
  TrendingUp,
  Clock,
  Leaf,
  Info,
  HelpCircle,
  Save,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const SolarCalculatorPage: React.FC = () => {
  const { user, addPoints } = useAuth();

  const [inputs, setInputs] = useState<SolarCalculationInput>({
    capacityKw: 5.0,
    peakSunHours: 4.8,
    performanceRatio: 0.78,
    gridTariffPerKwh: 0.16,
    installationCost: 7500
  });

  const [simulationSaved, setSimulationSaved] = useState(false);

  // Compute live with safety checks
  const results: SolarCalculationResult = useMemo(() => {
    return api.calculateSolar(inputs);
  }, [inputs]);

  const handleSaveSimulation = () => {
    api.logLocalActivity({
      userId: user?.id || 'user-01',
      activityType: 'SOLAR_SIMULATED',
      title: `Rooftop Solar Model: ${inputs.capacityKw} kW`,
      description: `Projected annual generation: ${results.annualGenerationKwh.toLocaleString()} kWh with $${results.annualSavingsUsd}/yr savings.`,
      pointsEarned: 25,
      co2SavedKg: Number((results.co2OffsetKgPerYear / 12).toFixed(1))
    });
    addPoints(25);
    setSimulationSaved(true);
    setTimeout(() => setSimulationSaved(false), 4000);
  };

  // 25-Year Cumulative Cash Flow Data
  const cumulativeData = useMemo(() => {
    const data = [];
    let net = -inputs.installationCost;
    for (let yr = 0; yr <= 25; yr++) {
      if (yr > 0) {
        // factoring in 0.5% yearly module degradation
        const degradedFactor = Math.pow(1 - 0.005, yr - 1);
        net += results.annualSavingsUsd * degradedFactor;
      }
      data.push({
        year: `Yr ${yr}`,
        netCashFlow: Math.round(net),
      });
    }
    return data;
  }, [inputs, results]);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2 pb-2 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Clean Energy Forecasting Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Rooftop Solar Energy & Financial Model
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Model rooftop photovoltaic yield, annual utility offsets, payback horizon, and lifecycle carbon mitigation using empirical derate formulas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Input Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" /> System Parameters
            </h2>
            <span className="text-[11px] text-slate-400">Live Recalculation</span>
          </div>

          <div className="space-y-4">
            {/* System Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">PV Array Capacity</label>
                <span className="font-bold font-mono text-emerald-700">{inputs.capacityKw} kW</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={inputs.capacityKw}
                onChange={(e) => setInputs({ ...inputs, capacityKw: parseFloat(e.target.value) || 0 })}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Typical residential array: 3 kW - 10 kW</span>
            </div>

            {/* Peak Sun Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">Peak Sun Hours (hrs/day)</label>
                <span className="font-bold font-mono text-amber-700">{inputs.peakSunHours} hrs</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="7.0"
                step="0.1"
                value={inputs.peakSunHours}
                onChange={(e) => setInputs({ ...inputs, peakSunHours: parseFloat(e.target.value) || 0 })}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Average solar irradiance for latitude</span>
            </div>

            {/* Performance Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">Performance Ratio (PR)</label>
                <span className="font-bold font-mono text-slate-800">{(inputs.performanceRatio * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.65"
                max="0.88"
                step="0.01"
                value={inputs.performanceRatio}
                onChange={(e) => setInputs({ ...inputs, performanceRatio: parseFloat(e.target.value) || 0 })}
                className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Inverter loss, thermal derating, and dust soiling</span>
            </div>

            {/* Grid Tariff */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">Electricity Tariff ($/kWh)</label>
                <span className="font-bold font-mono text-slate-800">${inputs.gridTariffPerKwh.toFixed(2)}</span>
              </div>
              <input
                type="number"
                min="0.01"
                max="1.50"
                step="0.01"
                value={inputs.gridTariffPerKwh}
                onChange={(e) => setInputs({ ...inputs, gridTariffPerKwh: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            {/* Installation Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-700">Net Installation Cost ($)</label>
                <span className="font-bold font-mono text-slate-800">${inputs.installationCost.toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={inputs.installationCost}
                onChange={(e) => setInputs({ ...inputs, installationCost: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSimulation}
            disabled={simulationSaved}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              simulationSaved
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {simulationSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Simulation Logged (+25 Eco Points)
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Log Simulation to Eco Profile
              </>
            )}
          </button>
        </div>

        {/* Right Column: Key Outputs & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Output Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Daily Generation</span>
              <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                {results.dailyGenerationKwh} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Annual Output</span>
              <p className="text-xl font-extrabold text-amber-600 font-mono mt-1">
                {results.annualGenerationKwh.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Annual Savings</span>
              <p className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                ${results.annualSavingsUsd.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Simple Payback</span>
              <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                {results.simplePaybackYears > 0 ? `${results.simplePaybackYears} yrs` : 'Immediate'}
              </p>
            </div>
          </div>

          {/* Environmental Benefits Pill */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-emerald-950 font-bold">Annual Carbon Abatement</strong>
                <p className="text-emerald-800 text-[11px]">
                  Offsets {results.co2OffsetKgPerYear.toLocaleString()} kg CO2e / year (displaces grid thermal load)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white rounded-full font-bold text-emerald-800 border border-emerald-200 text-xs shadow-2xs self-start sm:self-auto">
              ~{results.equivalentTreesPlanted} trees planted equivalent
            </span>
          </div>

          {/* Monthly Generation Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Seasonal Monthly Generation Profile (kWh)
              </h3>
              <span className="text-[11px] text-slate-400">Solar Geometry Factored</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    formatter={(val: any) => [`${val} kWh`, 'Generation']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="kwh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cumulative 25-Year Net Cash Flow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Cumulative 25-Year Net Cash Flow ($ USD)
              </h3>
              <span className="text-[11px] font-bold text-emerald-600">
                Lifetime ROI: +${results.lifetimeSavingsUsd.toLocaleString()}
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={10} interval={4} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Net Flow']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="netCashFlow" stroke="#059669" fill="#d1fae5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assumptions & Limitations Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" /> Engineering Assumptions & Transparent Limitations
            </h4>
            <ul className="space-y-1 text-slate-500 text-[11px] list-disc pl-4 leading-relaxed">
              {results.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
              <li>Roof azimuth (orientation) assumed optimal south/south-west with zero structural tree shading.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
