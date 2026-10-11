import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAppMode } from '../context/AppModeContext';
import { EWasteItem, EWasteFacility, EWasteRequest } from '../types';
import {
  Truck,
  PlusCircle,
  ShieldCheck,
  BatteryCharging,
  HardDrive,
  Building,
  Trash2,
  FileCheck
} from 'lucide-react';

export const EWastePage: React.FC = () => {
  const { user, addPoints } = useAuth();
  const { mode } = useAppMode();
  const [requests, setRequests] = useState<EWasteRequest[]>([]);
  const [facilities, setFacilities] = useState<EWasteFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form State
  const [itemsToRegister, setItemsToRegister] = useState<EWasteItem[]>([
    {
      id: 'i-1',
      deviceType: 'Smartphone / Tablet',
      brandModel: '',
      condition: 'Repairable',
      batteryIncluded: true,
      dataWiped: true
    }
  ]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [address, setAddress] = useState(user?.address || '128 Green Valley Blvd, Eco District');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [reqs, facs] = await Promise.all([
          api.getEWasteRequests(),
          api.getEWasteFacilities()
        ]);
        setRequests(reqs);
        setFacilities(facs);
        if (facs.length > 0) setSelectedFacilityId(facs[0].id);
      } catch (err) {
        console.error('Error fetching e-waste data:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [mode]);

  const handleAddItemRow = () => {
    setItemsToRegister([
      ...itemsToRegister,
      {
        id: `i-${Date.now()}`,
        deviceType: 'Laptop / Desktop',
        brandModel: '',
        condition: 'Dead/Damaged',
        batteryIncluded: false,
        dataWiped: true
      }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (itemsToRegister.length === 1) return;
    setItemsToRegister(itemsToRegister.filter((_, i) => i !== index));
  };

  const handleSubmitEWaste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsToRegister.some(item => !item.brandModel.trim())) {
      alert('Please specify brand and model description for all devices.');
      return;
    }

    const facility = facilities.find(f => f.id === selectedFacilityId);
    if (!facility) return;

    try {
      setSubmitting(true);
      await api.createEWasteRequest({
        userId: user?.id || 'user-01',
        userName: user?.name || 'Resident',
        address,
        contactNumber: phone,
        items: itemsToRegister,
        facilityId: facility.id,
        facilityName: facility.name,
        scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
      });

      addPoints(50);
      setShowRegisterModal(false);
      const updatedReqs = await api.getEWasteRequests();
      setRequests(updatedReqs);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Certified E-Waste Stewardship
            </h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              mode === 'DEMO' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {mode === 'DEMO' ? 'Demo Sandbox' : 'AWS DynamoDB'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Safely dispose of electronics, recover heavy precious metals, and track chain-of-custody verification certificates.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" /> Register Electronic Items
        </button>
      </div>

      {/* Safety Notice & Standards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <BatteryCharging className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-amber-900 block font-bold">Lithium Battery Handling</strong>
            <p className="text-amber-800 mt-0.5">
              Swollen or damaged batteries must have terminals taped with non-conductive electrical tape prior to handover.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
          <HardDrive className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-blue-900 block font-bold">Data Privacy & Sanitization</strong>
            <p className="text-blue-800 mt-0.5">
              Confirm factory resets or NIST 800-88 sanitization. Facilities destroy physical storage drives upon request.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-emerald-900 block font-bold">Evidence-Backed Verification</strong>
            <p className="text-emerald-800 mt-0.5">
              Items are marked recycled only upon facility inbound scan with a verifiable certificate hash.
            </p>
          </div>
        </div>
      </div>

      {/* Active E-Waste Disposal Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your E-Waste Chain of Custody</h2>
          <span className="text-xs text-slate-400 font-medium">{requests.length} registered batch(es)</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading electronic waste records...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Truck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No e-waste items registered yet</p>
            <p className="text-[11px] text-slate-400">Safely divert phones, computers, and batteries away from landfills.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      req.status === 'PROCESSED_VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      {req.status === 'PROCESSED_VERIFIED' ? 'Verified Recycled' : req.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Registered Devices */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Registered Devices ({req.items.length})
                    </span>
                    <div className="space-y-1">
                      {req.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800">{it.deviceType}: </span>
                            <span className="text-slate-600">{it.brandModel}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">({it.condition})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>Facility: <strong>{req.facilityName}</strong></span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Scheduled Date: {req.scheduledDate}
                    </p>
                  </div>
                </div>

                {/* Evidence Certificate Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {req.certificateId ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Certificate: {req.certificateId}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Verification certificate issued upon plant weigh-in
                    </span>
                  )}
                  {req.isDemo && (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Demo Audit
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certified Partner Facilities Showcase */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Certified Recycling Facilities & Kiosks</h2>
          <p className="text-xs text-slate-500">
            Certified partner processing centers adhering to international e-Stewards and R2 standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilities.map((fac) => (
            <div key={fac.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-xs text-slate-900">{fac.name}</h3>
                {fac.isDemoFacility && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Demo Hub
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{fac.address}</p>
              <div className="flex flex-wrap gap-1">
                {fac.certifications.map((c, i) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Distance: ~{fac.distanceKm} km</span>
                <span className={fac.acceptsBatteries ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                  {fac.acceptsBatteries ? '✓ Batteries Accepted' : 'No Batteries'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register E-Waste Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Register Electronic Equipment</h3>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEWaste} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Electronic Devices</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Device
                  </button>
                </div>

                {itemsToRegister.map((item, index) => (
                  <div key={item.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Device #{index + 1}</span>
                      {itemsToRegister.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(index)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={item.deviceType}
                        onChange={(e) => {
                          const updated = [...itemsToRegister];
                          updated[index].deviceType = e.target.value as any;
                          setItemsToRegister(updated);
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Smartphone / Tablet">Smartphone / Tablet</option>
                        <option value="Laptop / Desktop">Laptop / Desktop</option>
                        <option value="Battery / Powerbank">Battery / Powerbank</option>
                        <option value="Large Appliance">Large Appliance</option>
                        <option value="Cables & Accessories">Cables & Accessories</option>
                      </select>

                      <input
                        type="text"
                        required
                        placeholder="Model e.g. iPhone 11 (Cracked)"
                        value={item.brandModel}
                        onChange={(e) => {
                          const updated = [...itemsToRegister];
                          updated[index].brandModel = e.target.value;
                          setItemsToRegister(updated);
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-600">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.batteryIncluded}
                          onChange={(e) => {
                            const updated = [...itemsToRegister];
                            updated[index].batteryIncluded = e.target.checked;
                            setItemsToRegister(updated);
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Battery enclosed</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.dataWiped}
                          onChange={(e) => {
                            const updated = [...itemsToRegister];
                            updated[index].dataWiped = e.target.checked;
                            setItemsToRegister(updated);
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Personal data wiped</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination Facility */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Selected Certified Facility
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (~{f.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pickup Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  {submitting ? 'Registering...' : 'Register E-Waste (+50 pts)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
