import React from 'react';
import {
  LineChart,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  Award,
  Globe,
  Database
} from 'lucide-react';

export const SustainabilityInsightsPage: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2 pb-2 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <LineChart className="w-3.5 h-3.5" />
          <span>Scientific Methodology & Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sustainability Accounting & Research Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Detailed breakdown of calculation baselines, emissions conversion factors, informal sector inclusion, and verification ethics.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Principles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3>Zero Double-Counting Guarantee</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In municipal carbon accounting, a common flaw is counting emissions reductions both at the household level and by waste management utilities. UrbanLoop AI strictly categorizes reductions:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4">
            <li>
              <strong>Scope 1 Displaced:</strong> Direct tailpipe fuel combustion avoided when residents choose walking, cycling, or electrified subway transit over internal combustion vehicles.
            </li>
            <li>
              <strong>Scope 2 Displaced:</strong> Grid electricity displaced by direct rooftop solar PV micro-generation.
            </li>
            <li>
              <strong>Scope 3 Avoided:</strong> Landfill methane generation avoided via organic composting and raw bauxite mining displaced by aluminum recycling.
            </li>
          </ul>
        </div>

        {/* Informal Sector Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-base">
            <Scale className="w-5 h-5 text-blue-600" />
            <h3>Informal Recycler Dignity & Inclusion</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Waste pickers and informal aggregators provide essential environmental services in cities worldwide, frequently without formal safety equipment, transparent scales, or fair prices.
          </p>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Standardized digital weigh-ins eliminate middleman exploitation.</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Direct residential pickup dispatch optimizes transit routes, saving travel time.</span>
            </div>
          </div>
        </div>

        {/* E-Waste Stewardship Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <Globe className="w-5 h-5 text-amber-600" />
            <h3>Chain-of-Custody Certification Standards</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Electronic waste contains hazardous heavy metals (lead, cadmium, mercury) alongside precious recoverable minerals (gold, copper, lithium). UrbanLoop mandates that e-waste requests only route to certified processors adhering to:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="block text-slate-800">R2v3 Standard</strong>
              <span className="text-[11px] text-slate-500">Responsible recycling of electronics</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="block text-slate-800">e-Stewards</strong>
              <span className="text-[11px] text-slate-500">Zero export to developing nations</span>
            </div>
          </div>
        </div>

        {/* Cloud & AWS Architecture Specs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-forest-800 font-bold text-base">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3>Serverless Environmental Footprint</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Traditional monolithic servers consume constant idle electricity regardless of user traffic. UrbanLoop's AWS cloud architecture is optimized for near-zero idle compute:
          </p>
          <div className="space-y-2 text-xs text-slate-600">
            <p>• <strong>AWS Lambda:</strong> Code runs strictly upon incoming HTTP invocations, consuming compute for milliseconds.</p>
            <p>• <strong>DynamoDB On-Demand:</strong> Auto-scales to 0 read/write units during off-peak periods.</p>
            <p>• <strong>API Gateway HTTP API:</strong> Lightweight routing engine with low memory footprint.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
