import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAppMode } from '../context/AppModeContext';
import { RecyclingRequest, RequestStatus } from '../types';
import {
  Recycle,
  PlusCircle,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Calendar,
  Phone,
  RefreshCw,
  X
} from 'lucide-react';

export const RecyclingMarketplacePage: React.FC = () => {
  const { user, addPoints } = useAuth();
  const { mode } = useAppMode();
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    contactNumber: user?.phone || '+1 (555) 234-5678',
    address: user?.address || '128 Green Valley Blvd, Eco District',
    wasteType: 'Paper & Cardboard' as RecyclingRequest['wasteType'],
    estimatedKg: 10,
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    pickupTimeSlot: 'Morning (8AM - 12PM)' as RecyclingRequest['pickupTimeSlot'],
    notes: ''
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRecyclingRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('Error fetching recycling requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [mode]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const created = await api.createRecyclingRequest({
        ...formData,
        userId: user?.id || 'user-01',
      });
      setShowCreateModal(false);
      addPoints(Math.round(formData.estimatedKg * 2));
      await loadRequests();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit pickup request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    try {
      await api.updateRecyclingStatus(id, newStatus, user?.name);
      await loadRequests();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending Assignment', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock };
      case 'ASSIGNED':
        return { label: 'Collector Assigned', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: UserCheck };
      case 'IN_TRANSIT':
        return { label: 'In Transit', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck };
      case 'COLLECTED':
        return { label: 'Collected & Verified', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recycling & Collector Marketplace
            </h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              mode === 'DEMO' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {mode === 'DEMO' ? 'Demo Sandbox' : 'AWS DynamoDB'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect households directly with certified and informal local recycling co-ops for transparent pickups and fair compensation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Book Doorstep Pickup
          </button>
        </div>
      </div>

      {/* Role Notice & Instructions */}
      <div className="p-4 rounded-xl bg-forest-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Recycle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Current Logged Persona: {user?.name} ({user?.role?.toUpperCase()})</span>
            <p className="text-slate-300 text-[11px]">
              {user?.role === 'collector'
                ? 'As a collector, you can assign yourself to pending requests and mark completed pickups.'
                : user?.role === 'admin'
                ? 'As a municipal admin, you have full audit control across all requests and verification stamps.'
                : 'As a resident, you can schedule dry waste collections and earn eco points upon verification.'}
            </p>
          </div>
        </div>
        <button
          onClick={loadRequests}
          className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-slate-200 font-semibold text-xs flex items-center gap-1 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COLLECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading collection requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Recycle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No requests found</h3>
          <p className="text-xs text-slate-500">Book a pickup or select a different filter status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const badge = getStatusBadge(req.status);
            const StatusIcon = badge.icon;
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                      <span className="font-bold text-sm text-slate-900">{req.wasteType}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      <StatusIcon className="w-3 h-3" /> {badge.label}
                    </span>
                  </div>

                  {/* Weight & User info */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimated Weight</span>
                      <strong className="text-slate-800 font-mono text-sm">{req.estimatedKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Resident</span>
                      <strong className="text-slate-800 truncate block">{req.userName}</strong>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{req.address}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.scheduledDate} ({req.pickupTimeSlot})</span>
                    </p>
                    {req.collectorName && (
                      <p className="flex items-center gap-2 text-emerald-800 font-medium">
                        <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Assigned: {req.collectorName}</span>
                      </p>
                    )}
                    {req.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        Note: "{req.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Collector & Admin Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    Created: {new Date(req.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'ASSIGNED')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                      >
                        Accept Pickup
                      </button>
                    )}
                    {req.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'IN_TRANSIT')}
                        className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition"
                      >
                        Start Transit
                      </button>
                    )}
                    {req.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'COLLECTED')}
                        className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition"
                      >
                        Confirm Collected
                      </button>
                    )}
                    {req.status === 'COLLECTED' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +{req.pointsAwarded || 30} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Pickup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Recycle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Book Recycling Pickup</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Material Stream</label>
                  <select
                    value={formData.wasteType}
                    onChange={(e) => setFormData({ ...formData, wasteType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Paper & Cardboard">Paper & Cardboard</option>
                    <option value="Rigid Plastics">Rigid Plastics (PET / HDPE)</option>
                    <option value="Metals & Cans">Metals & Aluminum Cans</option>
                    <option value="Glass">Clean Glass Bottles</option>
                    <option value="Multi-Material">Multi-Material Sorted Batch</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Weight (kg)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={formData.estimatedKg}
                    onChange={(e) => setFormData({ ...formData, estimatedKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={formData.pickupTimeSlot}
                    onChange={(e) => setFormData({ ...formData, pickupTimeSlot: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                    <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                    <option value="Evening (4PM - 7PM)">Evening (4PM - 7PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pickup Notes / Gate Code</label>
                <input
                  type="text"
                  placeholder="e.g. Left in 2 green sacks outside front porch"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  {submitting ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
