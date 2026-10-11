import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAppMode } from '../context/AppModeContext';
import { RecyclingRequest, EWasteRequest } from '../types';
import {
  ShieldCheck,
  Users,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  BarChart3,
  Layers,
  Building
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { mode, apiStatus, apiUrl } = useAppMode();
  const [recycling, setRecycling] = useState<RecyclingRequest[]>([]);
  const [ewaste, setEWaste] = useState<EWasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [r, e] = await Promise.all([
          api.getRecyclingRequests(),
          api.getEWasteRequests()
        ]);
        setRecycling(r);
        setEWaste(e);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [mode]);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Municipal Sustainability Administration
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-900 text-white">
              City Authority
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Environmental Protection oversight console for collection verification, logistics audit, and AWS cloud posture.
          </p>
        </div>

        {user?.role !== 'admin' && (
          <button
            onClick={() => switchRole('admin')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Switch to Admin Role
          </button>
        )}
      </div>

      {/* Cloud & System Operational Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">API Gateway & Runtime</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{mode === 'DEMO' ? 'Sandbox Active' : 'AWS HTTP API'}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              apiStatus.online ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {apiStatus.online ? 'Healthy' : 'Offline'}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 truncate">
            {apiUrl || 'In-Memory / Local Sandbox'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">DynamoDB Multi-Tenant Tables</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">4 Tables Provisioned</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              PAY_PER_REQUEST
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Zero idle cost storage envelope configured
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Informal Collector Network</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">38 Active Co-ops</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Fair point incentives & logistics routing enabled
          </p>
        </div>
      </div>

      {/* Audit Table of Recycling Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Live Request Audit Ledger ({recycling.length})</h2>
          <span className="text-xs text-slate-400">Read-only audit record</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Req ID</th>
                <th className="py-2.5 px-3">Resident</th>
                <th className="py-2.5 px-3">Material Stream</th>
                <th className="py-2.5 px-3">Est. Weight</th>
                <th className="py-2.5 px-3">Assigned Collector</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recycling.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{r.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{r.userName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.wasteType}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{r.estimatedKg} kg</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">{r.collectorName || 'Unassigned'}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E-Waste Certificate Verification Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">E-Waste Disposal Chain-of-Custody Records ({ewaste.length})</h2>
          <span className="text-xs text-slate-400">Certified plant certificates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Items Count</th>
                <th className="py-2.5 px-3">Target Facility</th>
                <th className="py-2.5 px-3">Certificate Hash</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ewaste.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{e.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{e.userName}</td>
                  <td className="py-2.5 px-3">{e.items.length} unit(s)</td>
                  <td className="py-2.5 px-3 text-slate-600">{e.facilityName}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-700 font-bold">
                    {e.certificateId || 'Pending Inbound Weigh-In'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
