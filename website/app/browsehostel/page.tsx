'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import hostelsData from '@/data/hostels.json';
import { Heart, GitCompare, CheckCircle2 } from 'lucide-react';
import CompareModal from '@/components/CompareModal';

export default function BrowseHostelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('hostelWishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage
  const toggleWishlist = (hostelId: number) => {
    const newWishlist = wishlist.includes(hostelId)
      ? wishlist.filter(id => id !== hostelId)
      : [...wishlist, hostelId];
    
    setWishlist(newWishlist);
    localStorage.setItem('hostelWishlist', JSON.stringify(newWishlist));
  };

  // Toggle compare
  const toggleCompare = (hostelId: number) => {
    if (compareList.includes(hostelId)) {
      setCompareList(compareList.filter(id => id !== hostelId));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, hostelId]);
    } else {
      alert('You can compare up to 4 hostels at a time');
    }
  };

  const removeFromCompare = (hostelId: number) => {
    setCompareList(compareList.filter(id => id !== hostelId));
  };

  const amenitiesList = ['Free WiFi', 'Meals', 'AC Rooms', 'Laundry', 'Gym', 'Parking', 'Security', 'Study Room'];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filterHostels = () => {
    return hostelsData.hostels
      .filter(hostel => {
        const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            hostel.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All' || hostel.gender === selectedType;
        const matchesArea = selectedArea === 'All' || hostel.area === selectedArea;
        const matchesPrice = hostel.price >= priceRange[0] && hostel.price <= priceRange[1];
        const matchesAmenities = selectedAmenities.length === 0 || 
          selectedAmenities.every(amenity => 
            hostel.amenities.some(ha => ha.toLowerCase().includes(amenity.toLowerCase()))
          );
        return matchesSearch && matchesType && matchesArea && matchesPrice && matchesAmenities;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'reviews') return (b.totalReviews || 0) - (a.totalReviews || 0);
        return 0;
      });
  };

  const filteredHostels = filterHostels();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
        {/* Hero Section */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-slate-800/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Explore <span className="text-slate-300 font-bold">Hostels</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Discover amazing hostels at the best prices in Patna. Filter and find your perfect stay.
              </p>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="sticky top-20 z-40 bg-slate-700 border-y border-slate-600">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold">
                    {compareList.length} hostel{compareList.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCompare(true)}
                    className="px-6 py-2 bg-white text-slate-800 hover:bg-gray-100 font-semibold rounded-lg transition-all"
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={() => setCompareList([])}
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Results */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Filters</h2>

                {/* Area Filter */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Location Area</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Areas</option>
                    {hostelsData.patnaAreas && hostelsData.patnaAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

  
                {/* Room Type Filter */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Gender Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Co-ed">Co-ed</option>
                    <option value="Boys Only">Boys Only</option>
                    <option value="Girls Only">Girls Only</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Amenities</label>
                  <div className="space-y-2">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-gray-300 text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">{filteredHostels.length}</span> hostels found
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hostels Grid */}
            <div className="flex-1">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHostels.map((hostel, index) => (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hostel.images[0]}
                        alt={hostel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(hostel.id);
                          }}
                          className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-gray-900 transition-all"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              wishlist.includes(hostel.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-white'
                            }`}
                          />
                        </button>
                        
                        {/* Compare Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCompare(hostel.id);
                          }}
                          className={`p-2 backdrop-blur-sm rounded-full transition-all ${
                            compareList.includes(hostel.id)
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-900/80 hover:bg-gray-900'
                          }`}
                        >
                          {compareList.includes(hostel.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <GitCompare className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{hostel.price.toLocaleString()}/month
                      </div>
                      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {hostel.rating}
                      </div>
                      {hostel.verified && (
                        <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <span>✓</span> Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">
                        {hostel.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {hostel.location}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <span className="bg-slate-600/40 text-slate-300 px-2 py-1 rounded">
                          {hostel.gender}
                        </span>
                        <span className="bg-slate-700/40 text-slate-300 px-2 py-1 rounded">
                          {hostel.type}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{hostel.distance}</p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hostel.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                        {hostel.amenities.length > 3 && (
                          <span className="text-xs text-gray-400">+{hostel.amenities.length - 3} more</span>
                        )}
                      </div>

                      {/* Reviews */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-400">
                          {hostel.totalReviews || 0} reviews
                        </div>
                        {hostel.studentReviews && hostel.studentReviews.length > 0 && (
                          <div className="text-xs text-slate-400">
                            {hostel.studentReviews.length} student reviews
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <a 
                        href={`/hostel/${hostel.slug}`}
                        className="block w-full py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300 transform hover:scale-[1.02] text-center"
                      >
                        View Details
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredHostels.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No hostels found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        compareList={compareList}
        onRemove={removeFromCompare}
      />
    </>
  );
}
