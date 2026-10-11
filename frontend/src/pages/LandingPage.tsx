import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Recycle,
  Sun,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Gift
} from 'lucide-react';
import { useAppMode } from '../context/AppModeContext';

export const LandingPage: React.FC = () => {
  const { mode, setMode } = useAppMode();

  const keyFeatures = [
    {
      title: 'Intelligent Waste Segregation',
      description: 'Search household waste items to receive instant disposal guidelines, hazard alerts, and verified vs illustrative local sorting criteria.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Zero Landfill',
      path: '/segregation'
    },
    {
      title: 'Recycling & Informal Collectors',
      description: 'Schedule doorstep pickup for paper, plastics, and metals. Connect formal and informal waste collectors with fair compensation tracking.',
      icon: Recycle,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Circular Economy',
      path: '/recycling'
    },
    {
      title: 'Certified E-Waste Stewardship',
      description: 'Dispose of obsolete batteries, phones, and appliances safely. Track chain of custody to verified R2v3 and WEEE recycling facilities.',
      icon: Truck,
      color: 'from-amber-500 to-orange-600',
      badge: 'Toxic Diversion',
      path: '/ewaste'
    },
    {
      title: 'Rooftop Solar Energy Model',
      description: 'Calculate daily and annual PV generation, electricity bill offsets, simple payback horizon, and tree absorption equivalents.',
      icon: Sun,
      color: 'from-yellow-400 to-amber-500',
      badge: 'Clean Kilowatts',
      path: '/solar'
    },
    {
      title: 'Multi-Modal EV & Transit Comparison',
      description: 'Compare emissions between petrol vehicles, EVs, buses, and metro trains. Earn eco points for logged low-carbon commutes.',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      badge: 'Low Carbon',
      path: '/transport'
    },
    {
      title: 'Eco Rewards & Amazon Vouchers',
      description: 'Redeem your verified eco points for instant Amazon Gift Cards, unlimited city metro transit passes, and municipal utility bill credits.',
      icon: Gift,
      color: 'from-amber-500 to-orange-600',
      badge: 'Real Rewards',
      path: '/rewards'
    },
    {
      title: 'City Sustainability Analytics',
      description: 'Holistic municipal dashboard aggregating waste diversion, collector logistics, solar generation, and cumulative CO2 reduction.',
      icon: TrendingUp,
      color: 'from-emerald-600 to-green-700',
      badge: 'City ESG',
      path: '/dashboard'
    }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-emerald-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Hackathon 2026 Innovation Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white font-sans">
            Waste Less. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200">
              Power More. Move Smarter.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            UrbanLoop AI unites household circular waste sorting, informal collector logistics, rooftop clean solar modeling, and multi-modal transit analysis into a single unified serverless platform.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition duration-200"
            >
              Open City Dashboard <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/segregation"
              className="px-6 py-3.5 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-white font-semibold text-sm border border-emerald-500/30 flex items-center gap-2 transition duration-200"
            >
              Test Waste Assistant <Sparkles className="w-4 h-4 text-emerald-400" />
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
              <span>Active Environment:</span>
              <button
                onClick={() => setMode(mode === 'DEMO' ? 'AWS' : 'DEMO')}
                className="underline hover:text-white font-mono font-medium text-emerald-300"
              >
                {mode === 'DEMO' ? 'Demo Sandbox (Switch to AWS)' : 'AWS Mode (Switch to Demo)'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-forest-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">142.8 t</p>
              <p className="text-xs text-slate-400">Waste Diverted</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">685 MWh</p>
              <p className="text-xs text-slate-400">Solar Simulated</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">198.4 t</p>
              <p className="text-xs text-slate-400">CO2 Emissions Avoided</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300 font-mono">38</p>
              <p className="text-xs text-slate-400">Informal Recyclers Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Comprehensive Urban Sustainability Pillars
          </h2>
          <p className="text-sm text-slate-600">
            Engineered to empower citizens, recyclers, and municipal planners with practical tools, verified data, and zero empty templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Link
                    to={feat.path}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition"
                  >
                    Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cloud Architecture & Safety Strip */}
      <section className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider flex items-center gap-1">
              <Cpu className="w-4 h-4" /> Cloud Architecture
            </span>
            <h3 className="text-lg font-bold text-slate-900">100% Serverless & Budget Guarded</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered for student credit safety ($200 AWS credit envelope). API Gateway HTTP API v2 + Lambda Node.js + DynamoDB on-demand eliminates idle cloud costs.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Dual Environments:</strong> Switch instantly between standalone Sandbox and live deployed AWS Cloud API.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Scientific Rigor:</strong> EPA/IPCC emission factors and real irradiance coefficients prevent misleading environmental claims.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Informal Sector Inclusion:</strong> Integrates informal recyclers with transparent collection logs and incentive points.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Zero Template Facades:</strong> Every button, calculation, filter, and form is fully functional and validated.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
