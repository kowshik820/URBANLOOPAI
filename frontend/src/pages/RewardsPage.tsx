import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RewardItem, RedeemedVoucher, RewardCategory } from '../types';
import {
  Gift,
  Award,
  ShoppingBag,
  Train,
  Zap,
  Leaf,
  Store,
  CheckCircle2,
  Copy,
  ExternalLink,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RewardsPage: React.FC = () => {
  const { user, deductPoints } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [vouchers, setVouchers] = useState<RedeemedVoucher[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_vouchers'>('catalog');

  // Modal State
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [claimedVoucher, setClaimedVoucher] = useState<RedeemedVoucher | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await api.getRewards();
      setRewards(data);
      const userVouchers = api.getRedeemedVouchers();
      setVouchers(userVouchers);
    };
    loadData();
  }, []);

  const categories: (string | RewardCategory)[] = [
    'All',
    'Amazon Vouchers',
    'Public Transit',
    'Utility Credits',
    'Eco Store',
    'Green Planting'
  ];

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const handleClaim = async (reward: RewardItem) => {
    if (!user) {
      alert('Please sign in or select a persona to redeem rewards.');
      return;
    }

    if (user.points < reward.pointsRequired) {
      alert(`Insufficient points! You have ${user.points} pts, but this reward requires ${reward.pointsRequired} pts.`);
      return;
    }

    setIsRedeeming(true);
    try {
      // Deduct points from context
      const success = deductPoints(reward.pointsRequired);
      if (!success) {
        alert('Could not deduct points. Please verify balance.');
        return;
      }

      // Generate voucher via API service
      const voucher = await api.redeemReward(reward, { id: user.id, name: user.name });
      setClaimedVoucher(voucher);
      setVouchers(api.getRedeemedVouchers());
      setSelectedReward(null);
    } catch (err: any) {
      alert(`Redemption error: ${err.message}`);
    } finally {
      setIsRedeeming(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getCategoryIcon = (cat: RewardCategory) => {
    switch (cat) {
      case 'Amazon Vouchers': return ShoppingBag;
      case 'Public Transit': return Train;
      case 'Utility Credits': return Zap;
      case 'Eco Store': return Store;
      case 'Green Planting': return Leaf;
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header & User Points Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Gift className="w-3.5 h-3.5" />
              <span>Eco Rewards & Voucher Store</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Redeem Points for Real-World Rewards
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Convert your verified recycling, clean commutes, and solar simulations into **Amazon Gift Vouchers**, public transit passes, municipal utility discounts, and tree planting sponsorships.
            </p>
          </div>

          {/* User Points Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Your Eco Balance</span>
              <span className="font-semibold text-emerald-400 capitalize">{user?.role || 'Guest'}</span>
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white flex items-center gap-1.5">
                <Award className="w-7 h-7 text-emerald-400" />
                {user?.points || 0} <span className="text-sm font-sans font-normal text-slate-300">pts</span>
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-300">
              <span>Claimed Vouchers: <strong>{vouchers.length}</strong></span>
              <Link to="/activity" className="text-emerald-300 hover:text-white font-semibold underline">
                Earn More →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Catalog vs My Claimed Vouchers */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'catalog'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rewards Catalog ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_vouchers')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'my_vouchers'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>My Claimed Vouchers ({vouchers.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Instant digital delivery upon claim
        </span>
      </div>

      {/* CATALOG VIEW */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRewards.map((reward) => {
              const Icon = getCategoryIcon(reward.category);
              const userPoints = user?.points || 0;
              const canAfford = userPoints >= reward.pointsRequired;
              const pointsNeeded = reward.pointsRequired - userPoints;

              const isAmazon = reward.category === 'Amazon Vouchers';

              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all duration-200 ${
                    reward.highlight
                      ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-sm'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Provider & Value */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-xl text-white shadow-xs ${
                          isAmazon ? 'bg-gradient-to-tr from-amber-600 to-orange-500' : 'bg-forest-800'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                            {reward.provider}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm">{reward.title}</h3>
                        </div>
                      </div>

                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                        {reward.discountValue}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {reward.description}
                    </p>

                    {/* Stock & Terms Snippet */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Available: <strong className="text-slate-700">{reward.availableStock} vouchers</strong></span>
                      <span className="truncate max-w-[140px] text-right" title={reward.terms}>
                        {reward.category}
                      </span>
                    </div>
                  </div>

                  {/* Claim Button Area */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Required</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {reward.pointsRequired} pts
                      </span>
                    </div>

                    {canAfford ? (
                      <button
                        onClick={() => setSelectedReward(reward)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                          isAmazon
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Gift className="w-3.5 h-3.5" /> Claim Reward
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        Need {pointsNeeded} more pts
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MY CLAIMED VOUCHERS VIEW */}
      {activeTab === 'my_vouchers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Your Active Vouchers & Claim Codes</h2>
            <span className="text-xs text-slate-400">{vouchers.length} redeemed item(s)</span>
          </div>

          {vouchers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Gift className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No vouchers claimed yet</h3>
              <p className="text-xs text-slate-500">
                You have {user?.points || 0} points available. Check the catalog to claim Amazon gift cards or transit passes!
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Rewards Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">{v.provider}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {v.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">{v.title}</h3>
                      <span className="text-sm font-black font-mono text-emerald-700">{v.discountValue}</span>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Voucher / Claim Code</span>
                        <code className="text-sm sm:text-base font-black font-mono text-slate-900 tracking-wider">
                          {v.voucherCode}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(v.voucherCode)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Copy code to clipboard"
                      >
                        {copiedCode === v.voucherCode ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Claimed: {new Date(v.redeemedAt).toLocaleDateString()}</span>
                      <span>Expires: {v.expiresAt}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Points Spent: <strong>{v.pointsSpent} pts</strong></span>
                    {v.title.includes('Amazon') ? (
                      <a
                        href="https://www.amazon.com/gc/redeem"
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        Redeem on Amazon.com <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Present at checkout / validator</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Confirm Reward Claim</h3>
              </div>
              <button onClick={() => setSelectedReward(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{selectedReward.provider}</span>
                <h4 className="font-extrabold text-slate-900 text-base">{selectedReward.title}</h4>
                <p className="text-xs text-slate-500">{selectedReward.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Face Value:</span>
                  <strong className="text-emerald-700 font-mono text-sm">{selectedReward.discountValue}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p>
                    <strong>{selectedReward.pointsRequired} points</strong> will be deducted from your current balance of <strong>{user?.points} points</strong>.
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1">Remaining balance after claim: {((user?.points || 0) - selectedReward.pointsRequired)} points.</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                Terms: {selectedReward.terms}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRedeeming}
                onClick={() => handleClaim(selectedReward)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {isRedeeming ? 'Generating Code...' : 'Confirm & Claim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM SUCCESS CELEBRATION MODAL */}
      {claimedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-emerald-300 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Voucher Successfully Claimed!</h3>
              <p className="text-xs text-slate-500">
                Congratulations! Your reward for {claimedVoucher.title} is ready.
              </p>
            </div>

            {/* Generated Voucher Code Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-left relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                <span>{claimedVoucher.provider}</span>
                <span>{claimedVoucher.discountValue}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Digital Claim Code</span>
                <code className="text-lg sm:text-xl font-black font-mono tracking-widest text-emerald-300 select-all block py-1">
                  {claimedVoucher.voucherCode}
                </code>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Valid until: {claimedVoucher.expiresAt}</span>
                <span className="text-emerald-400 font-medium">Verified Active</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => copyToClipboard(claimedVoucher.voucherCode)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copiedCode === claimedVoucher.voucherCode ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Code Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Voucher Code
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setClaimedVoucher(null);
                  setActiveTab('my_vouchers');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                View in My Claimed Vouchers
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
