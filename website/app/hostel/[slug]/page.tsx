'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Star, MapPin, IndianRupee, Check, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface HostelOwner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Hostel {
  _id: string;
  name: string;
  slug: string;
  location: string;
  address: string;
  gender: string;
  price: number;
  description: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviews: number;
  distance?: string;
  totalRooms?: number;
  availableRooms?: number;
  verified: boolean;
  owner?: HostelOwner;
}

export default function HostelDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchHostel();
    }
  }, [slug]);

  const fetchHostel = async () => {
    try {
      const response = await fetch(`${API_URL}/hostels/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error('Hostel not found');
      }

      const data = await response.json();
      setHostel(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !hostel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Hostel Not Found</h1>
            <p className="text-gray-400 mb-8">{error || 'The hostel you are looking for does not exist.'}</p>
            <a href="/browsehostel" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Hostels
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={hostel.images[selectedImage] || '/placeholder.jpg'}
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {hostel.images.slice(0, 4).map((image: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-44 rounded-xl overflow-hidden cursor-pointer ${
                      selectedImage === index ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${hostel.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{hostel.name}</h1>
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>{hostel.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {hostel.verified && (
                      <span className="px-3 py-1 bg-green-500/90 text-white text-sm rounded-full">
                        ✓ Verified
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-full">
                      {hostel.gender}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{hostel.rating}</span>
                    <span className="text-gray-400">({hostel.reviews} reviews)</span>
                  </div>
                  {hostel.distance && (
                    <span className="text-gray-400">• {hostel.distance}</span>
                  )}
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                  <p className="text-gray-300 leading-relaxed">{hostel.description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Address</h2>
                  <p className="text-gray-300">{hostel.address}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {hostel.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {((hostel.totalRooms ?? 0) > 0 || (hostel.availableRooms ?? 0) > 0) && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Room Availability</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Rooms</p>
                        <p className="text-2xl font-bold text-white">{hostel.totalRooms}</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Available Rooms</p>
                        <p className="text-2xl font-bold text-green-500">{hostel.availableRooms}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 sticky top-24"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <IndianRupee className="w-8 h-8 text-purple-400" />
                    <span className="text-4xl font-bold text-white">
                      {hostel.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400">per month</p>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl mb-4">
                  Book Now
                </button>

                <button className="w-full py-4 border-2 border-purple-600 text-purple-400 hover:bg-purple-600/10 font-semibold rounded-xl transition-all mb-6">
                  Contact Owner
                </button>

                {hostel.owner && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-white mb-3">Owner Details</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <strong>Name:</strong> {hostel.owner.name}
                      </p>
                      <p className="text-gray-300">
                        <strong>Email:</strong> {hostel.owner.email}
                      </p>
                      {hostel.owner.phone && (
                        <p className="text-gray-300">
                          <strong>Phone:</strong> {hostel.owner.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
