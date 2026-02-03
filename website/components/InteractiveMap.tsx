'use client';

import { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import hostelsData from '@/data/hostels.json';

interface InteractiveMapProps {
  currentHostel?: {
    name: string;
    location: string;
    area?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export default function InteractiveMap({ currentHostel }: InteractiveMapProps) {
  const [selectedArea, setSelectedArea] = useState(currentHostel?.area || 'All Areas');
  const [mapView, setMapView] = useState<'satellite' | 'roadmap'>('roadmap');

  const filteredHostels = selectedArea === 'All Areas' 
    ? hostelsData.hostels 
    : hostelsData.hostels.filter(h => h.area === selectedArea);

  const openInGoogleMaps = () => {
    if (currentHostel?.coordinates) {
      window.open(
        `https://www.google.com/maps?q=${currentHostel.coordinates.lat},${currentHostel.coordinates.lng}`,
        '_blank'
      );
    } else if (currentHostel?.location) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(currentHostel.location)}`,
        '_blank'
      );
    }
  };

  const getDirections = () => {
    if (currentHostel?.coordinates) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${currentHostel.coordinates.lat},${currentHostel.coordinates.lng}`,
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-white font-semibold mb-2">
            Explore Nearby Areas
          </label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All Areas">All Areas in Patna</option>
            {hostelsData.patnaAreas && hostelsData.patnaAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMapView('roadmap')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              mapView === 'roadmap'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMapView('satellite')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              mapView === 'satellite'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="rounded-xl overflow-hidden border-2 border-gray-600 bg-gray-800 relative">
        {currentHostel?.coordinates ? (
          <div className="relative">
            {/* Interactive Map Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentHostel.name}
                </h3>
                <p className="text-gray-300 mb-4">{currentHostel.location}</p>
                <div className="text-sm text-gray-400 mb-6">
                  Coordinates: {currentHostel.coordinates.lat.toFixed(4)}, {currentHostel.coordinates.lng.toFixed(4)}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={openInGoogleMaps}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open in Google Maps
                  </button>
                  <button
                    onClick={getDirections}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Map Integration Notice */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-blue-600/90 backdrop-blur-sm border border-blue-400 rounded-lg p-4">
                <p className="text-white text-sm">
                  <strong>💡 Pro Tip:</strong> Click "Open in Google Maps" for full interactive map with street view, 
                  traffic info, and more!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Map coordinates not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Nearby Hostels in Selected Area */}
      {selectedArea !== currentHostel?.area && selectedArea !== 'All Areas' && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Other Hostels in {selectedArea}
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredHostels.slice(0, 5).map((hostel) => (
              <a
                key={hostel.id}
                href={`/hostel/${hostel.slug}`}
                className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all group"
              >
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white group-hover:text-blue-400 truncate">
                    {hostel.name}
                  </div>
                  <div className="text-sm text-gray-400 truncate">{hostel.location}</div>
                </div>
                <div className="text-sm font-semibold text-purple-400">
                  ₹{hostel.price.toLocaleString()}
                </div>
              </a>
            ))}
          </div>
          {filteredHostels.length > 5 && (
            <a
              href="/browsehostel"
              className="block mt-4 text-center text-blue-400 hover:text-blue-300 font-medium"
            >
              View all {filteredHostels.length} hostels in {selectedArea} →
            </a>
          )}
        </div>
      )}

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Areas</div>
              <div className="text-xl font-bold text-white">
                {hostelsData.patnaAreas?.length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-600/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-600/30 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Coverage</div>
              <div className="text-xl font-bold text-white">
                City-wide
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-600/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-600/30 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">View Mode</div>
              <div className="text-xl font-bold text-white capitalize">
                {mapView}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
