'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import hostelsData from '@/data/hostels.json';
import { Heart, Star, Trash2, MapPin } from 'lucide-react';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('hostelWishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    setLoading(false);
  }, []);

  const removeFromWishlist = (hostelId: number) => {
    const newWishlist = wishlist.filter(id => id !== hostelId);
    setWishlist(newWishlist);
    localStorage.setItem('hostelWishlist', JSON.stringify(newWishlist));
  };

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlist([]);
      localStorage.setItem('hostelWishlist', JSON.stringify([]));
    }
  };

  const wishlistHostels = hostelsData.hostels.filter(hostel => 
    wishlist.includes(hostel.id)
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-2xl">Loading wishlist...</div>
        </div>
      </>
    );
  }

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
              <div className="flex items-center justify-center mb-6">
                <Heart className="w-16 h-16 text-red-500 fill-red-500" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                My <span className="text-slate-300 font-bold">Wishlist</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {wishlistHostels.length > 0 
                  ? `You have ${wishlistHostels.length} hostel${wishlistHostels.length > 1 ? 's' : ''} saved in your wishlist`
                  : 'Start adding hostels to your wishlist to keep track of your favorites!'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Wishlist Content */}
        <div className="container mx-auto px-4 py-12">
          {wishlistHostels.length > 0 ? (
            <>
              {/* Clear All Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All
                </button>
              </div>

              {/* Hostels Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistHostels.map((hostel, index) => (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-slate-500 transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hostel.images[0]}
                        alt={hostel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(hostel.id);
                        }}
                        className="absolute top-4 right-4 p-2 bg-red-600/90 backdrop-blur-sm rounded-full hover:bg-red-700 transition-all"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                      
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{hostel.price.toLocaleString()}/month
                      </div>
                      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
                        <MapPin className="w-4 h-4 mr-1" />
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
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-800/50 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-gray-600" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Browse hostels and click the heart icon to save your favorite ones here!
              </p>
              <a
                href="/browsehostel"
                className="inline-block px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all"
              >
                Browse Hostels
              </a>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
