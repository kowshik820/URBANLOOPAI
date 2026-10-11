import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { WasteItem, WasteCategory } from '../types';
import {
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Filter
} from 'lucide-react';

export const WasteSegregationPage: React.FC = () => {
  const [items, setItems] = useState<WasteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await api.getWasteItems();
        setItems(data);
        if (data.length > 0) {
          setSelectedItem(data[0]);
        }
      } catch (err) {
        console.error('Error loading waste items:', err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const categories = ['All', 'Dry Recyclable', 'Wet Organic', 'Hazardous', 'E-Waste', 'Residual'];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesName = item.name.toLowerCase().includes(query);
      const matchesAliases = item.aliases.some(a => a.toLowerCase().includes(query));
      const matchesInstructions = item.instructions.toLowerCase().includes(query);

      return matchesCategory && (matchesName || matchesAliases || matchesInstructions);
    });
  }, [items, searchQuery, selectedCategory]);

  const getBinBadge = (color: WasteItem['binColor']) => {
    switch (color) {
      case 'blue':
        return { label: 'Blue Bin (Dry Recyclables)', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'green':
        return { label: 'Green Bin (Wet Organics)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'red':
        return { label: 'Red Bin (Hazardous / Toxic)', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'yellow':
        return { label: 'Yellow Bin (Special E-Waste)', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'black':
      default:
        return { label: 'Black Bin (Residual Non-Recyclable)', bg: 'bg-slate-200 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Sorting Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Waste Segregation & Material Guidance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Search everyday items for scientific segregation directions, safety warnings, and disposal rules. We transparently mark verified municipal instructions versus regional guidelines.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search waste item (e.g., 'plastic bottle', 'lithium battery', 'cardboard', 'aerosol', 'blister pack')..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Stream:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Item Grid & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List of Matches */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500">
              Matching Items ({filteredItems.length})
            </span>
            <span className="text-[11px] text-slate-400">Click item to inspect instructions</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No matching waste items</p>
                <p className="text-[11px] text-slate-400">Try searching for broader terms like "can", "box", or "battery".</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const binInfo = getBinBadge(item.binColor);
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300/40 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${binInfo.bg}`}>
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.instructions}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Recyclability: <strong className="text-slate-700">{item.recyclabilityScore}%</strong></span>
                      {item.verified && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Verified Standard
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Card for Selected Item */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {selectedItem.name}
                    </h2>
                    {selectedItem.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        Illustrative Baseline
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Also known as: {selectedItem.aliases.join(', ')}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Recyclability Score</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    {selectedItem.recyclabilityScore} / 100
                  </span>
                </div>
              </div>

              {/* Designated Bin Allocation */}
              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Designated Disposal Bin
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedItem.disposalMethod}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getBinBadge(selectedItem.binColor).bg}`}>
                  {getBinBadge(selectedItem.binColor).label}
                </span>
              </div>

              {/* Preparation & Disposal Instructions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" /> Preparation & Handling Steps
                </h3>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {selectedItem.instructions}
                </div>
              </div>

              {/* Safety Warnings */}
              {selectedItem.safetyWarnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> Critical Safety Warnings
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    {selectedItem.safetyWarnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tips & Circular Insights */}
              {selectedItem.tips.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" /> Pro Tips & Resource Recovery
                  </h3>
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    {selectedItem.tips.map((tip, i) => (
                      <p key={i} className="text-xs text-amber-900 leading-relaxed">
                        • {tip}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Disclaimer */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Always check local municipal regulations for specific curbside acceptance. Contaminated materials reduce processing efficiency for entire collection batches.
                </span>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Select an item on the left to see complete details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
