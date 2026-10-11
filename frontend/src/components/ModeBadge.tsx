import React, { useState } from 'react';
import { useAppMode } from '../context/AppModeContext';
import { Server, Database, CheckCircle, AlertTriangle, XCircle, Settings, RefreshCw } from 'lucide-react';

export const ModeBadge: React.FC = () => {
  const { mode, apiStatus, setMode, apiUrl, setApiUrl, refreshStatus } = useAppMode();
  const [showModal, setShowModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStatus();
    setIsRefreshing(false);
  };

  const handleSaveUrl = () => {
    setApiUrl(customUrl);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
          mode === 'DEMO'
            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            : apiStatus.online
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
        }`}
        title="Click to view AWS Environment & Mode Settings"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              mode === 'DEMO'
                ? 'bg-amber-400'
                : apiStatus.online
                ? 'bg-emerald-400'
                : 'bg-rose-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              mode === 'DEMO'
                ? 'bg-amber-500'
                : apiStatus.online
                ? 'bg-emerald-600'
                : 'bg-rose-600'
            }`}
          />
        </span>
        <span>{mode === 'DEMO' ? 'DEMO SANDBOX' : 'AWS CLOUD MODE'}</span>
        {mode === 'AWS' && apiStatus.latencyMs !== undefined && (
          <span className="text-[10px] opacity-70">({apiStatus.latencyMs}ms)</span>
        )}
        <Settings className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </button>

      {/* Mode & AWS Configuration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Application Environment</h3>
                  <p className="text-xs text-slate-500">Configure Live AWS vs Demo Sandbox</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('DEMO')}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  mode === 'DEMO'
                    ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-300/40 text-amber-950'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Demo Sandbox</span>
                  {mode === 'DEMO' && <CheckCircle className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  Offline interactive mode with realistic sample records. No AWS credentials needed.
                </p>
              </button>

              <button
                onClick={() => setMode('AWS')}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  mode === 'AWS'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/40 text-emerald-950'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Live AWS Mode</span>
                  {mode === 'AWS' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  Communicates directly with deployed Amazon API Gateway & DynamoDB.
                </p>
              </button>
            </div>

            {/* AWS Endpoint Settings */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Amazon API Gateway HTTP Endpoint URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://abc123xyz.execute-api.us-east-1.amazonaws.com"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-700"
                />
                <button
                  onClick={handleSaveUrl}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Connection Status Box */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              apiStatus.online
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {apiStatus.online ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  Status: {apiStatus.online ? 'Connected & Healthy' : 'Connection Unreachable'}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Ping
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-500 truncate">
                Target: {apiStatus.apiUrl || 'None'}
              </p>
              {apiStatus.errorMessage && (
                <p className="text-rose-600 text-[11px] font-medium pt-1">
                  {apiStatus.errorMessage}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
