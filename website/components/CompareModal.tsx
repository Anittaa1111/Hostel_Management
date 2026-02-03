'use client';

import { useState } from 'react';
import { X, Check, IndianRupee, Star, MapPin, Wifi, Utensils, Shield, Users, Zap } from 'lucide-react';
import hostelsData from '@/data/hostels.json';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: number[];
  onRemove: (id: number) => void;
}

export default function CompareModal({ isOpen, onClose, compareList, onRemove }: CompareModalProps) {
  const [viewMode, setViewMode] = useState<'all' | 'basic' | 'amenities'>('all');

  if (!isOpen) return null;

  const compareHostels = hostelsData.hostels.filter(h => compareList.includes(h.id));

  if (compareHostels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">No Hostels to Compare</h3>
            <p className="text-gray-400 mb-6">Add hostels to comparison to see side-by-side details</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Comprehensive comparison criteria
  const basicFeatures = [
    { label: 'Monthly Price', key: 'price', icon: IndianRupee },
    { label: 'Rating', key: 'rating', icon: Star },
    { label: 'Total Reviews', key: 'totalReviews', icon: Users },
    { label: 'Gender Type', key: 'gender', icon: Users },
    { label: 'Location', key: 'location', icon: MapPin },
    { label: 'Distance', key: 'distance', icon: MapPin },
    { label: 'Verified', key: 'verified', icon: Shield },
  ];

  const amenitiesFeatures = [
    { label: 'WiFi', key: 'amenities', subkey: 'WiFi', icon: Wifi },
    { label: 'Food/Meals', key: 'amenities', subkey: 'Meal', icon: Utensils },
    { label: 'AC Rooms', key: 'amenities', subkey: 'AC', icon: Zap },
    { label: 'Hot Water', key: 'amenities', subkey: 'Hot Water', icon: Zap },
    { label: 'Laundry', key: 'amenities', subkey: 'Laundry', icon: Check },
    { label: 'Parking', key: 'amenities', subkey: 'Parking', icon: Check },
    { label: 'Security/CCTV', key: 'amenities', subkey: 'Security', icon: Shield },
    { label: 'Power Backup', key: 'amenities', subkey: 'Backup', icon: Zap },
  ];

  const getFeaturesToShow = () => {
    switch (viewMode) {
      case 'basic': return basicFeatures;
      case 'amenities': return amenitiesFeatures;
      default: return [...basicFeatures, ...amenitiesFeatures];
    }
  };

  const renderFeatureValue = (hostel: any, feature: any) => {
    const key = feature.key;
    
    switch (key) {
      case 'price':
        const prices = compareHostels.map(h => h.price);
        const minPrice = Math.min(...prices);
        const isCheapest = hostel.price === minPrice;
        return (
          <div className="flex items-center gap-2 justify-center">
            <IndianRupee className="w-5 h-5 text-slate-400" />
            <span className={`text-xl font-bold ${isCheapest ? 'text-green-400' : 'text-white'}`}>
              {hostel.price.toLocaleString()}
            </span>
            {isCheapest && <span className="text-xs text-green-400 font-semibold">(Lowest)</span>}
          </div>
        );
      case 'rating':
        const ratings = compareHostels.map(h => h.rating);
        const maxRating = Math.max(...ratings);
        const isHighest = hostel.rating === maxRating;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className={`text-xl font-bold ${isHighest ? 'text-yellow-400' : 'text-white'}`}>
              {hostel.rating}
            </span>
            {isHighest && <span className="text-xs text-yellow-400 font-semibold">(Best)</span>}
          </div>
        );
      case 'totalReviews':
        return (
          <div className="flex items-center gap-2 justify-center">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-white font-semibold">
              {hostel.totalReviews || hostel.reviews || 0}
            </span>
          </div>
        );
      case 'gender':
        return (
          <div className="px-3 py-2 bg-slate-700/50 rounded-lg inline-block">
            <span className="text-slate-300 font-medium">{hostel.gender}</span>
          </div>
        );
      case 'location':
        return (
          <div className="flex items-start gap-2 text-gray-300 text-sm justify-center">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
            <span className="line-clamp-2 text-center">{hostel.location}</span>
          </div>
        );
      case 'distance':
        return (
          <span className="text-gray-300">{hostel.distance || 'N/A'}</span>
        );
      case 'verified':
        return hostel.verified ? (
          <div className="flex items-center gap-2 text-green-400 justify-center">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 justify-center">
            <X className="w-5 h-5" />
            <span>Not Verified</span>
          </div>
        );
      case 'amenities':
        if (feature.subkey) {
          const hasAmenity = hasAmenityMatch(hostel, feature.subkey);
          return (
            <div className="flex justify-center">
              {hasAmenity ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <X className="w-6 h-6 text-red-500" />
              )}
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  const hasAmenityMatch = (hostel: any, keyword: string): boolean => {
    return hostel.amenities?.some((a: string) => 
      a.toLowerCase().includes(keyword.toLowerCase())
    ) || false;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl max-w-7xl w-full border border-gray-700 my-8">
        {/* Header with View Mode Toggle */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Compare Hostels Side by Side</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setViewMode('basic')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'basic'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setViewMode('amenities')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'amenities'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              Amenities Only
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mt-3">
            Comparing {compareHostels.length} hostel{compareHostels.length > 1 ? 's' : ''} • 
            Click on hostel cards to view full details
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hostel Cards Header */}
            <div className="flex border-b border-gray-700 bg-gray-900/50">
              <div className="w-56 flex-shrink-0 p-4 sticky left-0 bg-gray-900/50 z-10">
                <div className="h-full flex items-center">
                  <span className="text-gray-400 font-semibold text-sm uppercase tracking-wide">Features</span>
                </div>
              </div>
              {compareHostels.map((hostel) => (
                <div key={hostel.id} className="flex-1 min-w-[280px] p-4 border-l border-gray-700">
                  <div className="relative group">
                    <button
                      onClick={() => onRemove(hostel.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full z-10 shadow-lg transition-all"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <img
                      src={hostel.images[0]}
                      alt={hostel.name}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-80 transition-opacity"
                    />
                    <h3 className="font-bold text-white mb-1 text-lg">{hostel.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{hostel.location}</span>
                    </div>
                    <a
                      href={`/hostel/${hostel.slug}`}
                      className="text-sm text-slate-400 hover:text-slate-300 underline"
                    >
                      View Full Details →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Best Value Indicator */}
            {viewMode !== 'amenities' && (
              <div className="flex bg-green-900/20 border-b border-gray-700">
                <div className="w-56 flex-shrink-0 p-4 sticky left-0 bg-green-900/20 z-10">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold text-sm">Best Value</span>
                  </div>
                </div>
                {compareHostels.map((hostel) => {
                  const priceRating = hostel.rating / (hostel.price / 1000);
                  const bestValue = compareHostels.reduce((best, h) => {
                    const currentValue = h.rating / (h.price / 1000);
                    const bestCurrentValue = best.rating / (best.price / 1000);
                    return currentValue > bestCurrentValue ? h : best;
                  }, compareHostels[0]);
                  const isBest = bestValue.id === hostel.id;
                  
                  return (
                    <div key={hostel.id} className="flex-1 min-w-[280px] p-4 border-l border-gray-700">
                      {isBest ? (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold text-sm">Best Price-Quality Ratio</span>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-2">-</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Feature Rows */}
            {getFeaturesToShow().map((feature, index) => (
              <div key={index} className="flex hover:bg-gray-700/30 transition-colors border-b border-gray-700">
                <div className="w-56 flex-shrink-0 p-4 sticky left-0 bg-gray-800/90 z-10">
                  <div className="flex items-center gap-2">
                    {feature.icon && <feature.icon className="w-4 h-4 text-slate-400" />}
                    <span className="text-gray-300 font-medium text-sm">{feature.label}</span>
                  </div>
                </div>
                {compareHostels.map((hostel) => (
                  <div key={hostel.id} className="flex-1 min-w-[280px] p-4 border-l border-gray-700 flex items-center justify-center">
                    {renderFeatureValue(hostel, feature)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-400">
              💡 Tip: Green highlights show best value. Click "View Full Details" to explore each hostel
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => compareList.forEach(id => onRemove(id))}
                className="px-6 py-2 bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 font-semibold rounded-lg transition-all"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
              >
                Done Comparing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
