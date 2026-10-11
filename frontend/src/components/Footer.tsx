import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Cloud, Cpu, ArrowUpRight, Heart } from 'lucide-react';
import { useAppMode } from '../context/AppModeContext';

export const Footer: React.FC = () => {
  const { mode } = useAppMode();

  return (
    <footer className="bg-forest-950 text-slate-300 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">
                UrbanLoop<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering smart circular cities through AI-assisted waste sorting, informal recycler inclusion, rooftop clean energy forecasting, and low-carbon urban transit.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forest-900/80 border border-emerald-500/20 text-[11px] text-emerald-300">
              <Cloud className="w-3.5 h-3.5" />
              <span>AWS Serverless Architecture</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Sustainability Hub</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/segregation" className="hover:text-emerald-400 transition">Waste Classification Assistant</Link></li>
              <li><Link to="/recycling" className="hover:text-emerald-400 transition">Recycling Request Network</Link></li>
              <li><Link to="/ewaste" className="hover:text-emerald-400 transition">Certified E-Waste Management</Link></li>
              <li><Link to="/solar" className="hover:text-emerald-400 transition">Rooftop Solar Model</Link></li>
              <li><Link to="/transport" className="hover:text-emerald-400 transition">EV & Multi-Modal Transit</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">AWS Infrastructure</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> AWS Lambda (Node.js 20)</li>
              <li className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-emerald-400" /> Amazon API Gateway (HTTP v2)</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Amazon DynamoDB (On-Demand)</li>
              <li className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-emerald-400" /> AWS Amplify Hosting</li>
              <li className="text-[11px] text-slate-500 pt-1">Active mode: <strong className="text-emerald-300">{mode}</strong></li>
            </ul>
          </div>

          {/* Hackathon Integrity & Disclaimers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Verification & Ethics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Waste segregation guides distinguish verified municipal practices from illustrative samples. Emission figures adhere to EPA & IPCC passenger-km baselines.
            </p>
            <p className="text-[11px] text-slate-500">
              Designed for hackathon demonstration with budget-safe serverless scaling ($200 AWS credit target).
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 UrbanLoop AI. Open source sustainability engineering.</p>
          <div className="flex items-center gap-4">
            <Link to="/insights" className="hover:text-emerald-400 transition flex items-center gap-1">
              Methodology & Sources <ArrowUpRight className="w-3 h-3" />
            </Link>
            <Link to="/admin" className="hover:text-emerald-400 transition">Municipality Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
