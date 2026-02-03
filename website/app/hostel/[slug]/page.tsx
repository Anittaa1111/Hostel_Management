'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Star, MapPin, IndianRupee, Check, X, Phone, Mail, MessageCircle, Heart, Users, Bed, Wifi, Utensils, Shield } from 'lucide-react';
import hostelsData from '@/data/hostels.json';
import InteractiveMap from '@/components/InteractiveMap';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RoomType {
  type: string;
  beds: number;
  price: number;
  available: number;
}

interface HostelData {
  id: number;
  name: string;
  slug: string;
  location: string;
  area?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  price: number;
  rating: number;
  totalReviews?: number;
  reviews?: number;
  images: string[];
  amenities: string[];
  facilities?: any;
  gender: string;
  roomTypes?: RoomType[];
  nearbyPlaces?: string[];
  rules?: string[];
  description: string;
  fullDescription?: string;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    website?: string;
  };
  studentReviews?: Review[];
  verified: boolean;
  featured?: boolean;
}

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
  const [hostelData, setHostelData] = useState<HostelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  useEffect(() => {
    // Load wishlist
    const savedWishlist = localStorage.getItem('hostelWishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    if (slug) {
      // First try to fetch from API
      fetchHostel();
      
      // Also get data from JSON
      const jsonHostel = hostelsData.hostels.find(h => h.slug === slug);
      if (jsonHostel) {
        setHostelData(jsonHostel);
      }
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

  const toggleWishlist = (hostelId: number) => {
    const newWishlist = wishlist.includes(hostelId)
      ? wishlist.filter(id => id !== hostelId)
      : [...wishlist, hostelId];
    
    setWishlist(newWishlist);
    localStorage.setItem('hostelWishlist', JSON.stringify(newWishlist));
  };

  const handleSubmitReview = () => {
    // In a real app, this would send to the backend
    alert(`Review submitted! Rating: ${userRating} stars\nComment: ${userReview}`);
    setUserRating(0);
    setUserReview('');
  };

  const displayHostel = hostelData || hostel;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-2xl">Loading hostel details...</div>
        </div>
      </>
    );
  }

  if (error && !hostelData) {
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

  if (!displayHostel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-2xl">No hostel data available</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header with Wishlist */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {displayHostel.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>{displayHostel.location}</span>
              </div>
            </div>
            {hostelData && (
              <button
                onClick={() => toggleWishlist(hostelData.id)}
                className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-gray-700 transition-all border border-gray-600"
              >
                <Heart
                  className={`w-6 h-6 ${
                    wishlist.includes(hostelData.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-white'
                  }`}
                />
              </button>
            )}
          </div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={displayHostel.images[selectedImage] || '/placeholder.jpg'}
                  alt={displayHostel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {displayHostel.images.slice(0, 4).map((image: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-44 rounded-xl overflow-hidden cursor-pointer ${
                      selectedImage === index ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${displayHostel.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{displayHostel.rating}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-slate-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {hostelData?.totalReviews || displayHostel.reviews || 0}
                  </div>
                  <div className="text-sm text-gray-400">Reviews</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Bed className="w-8 h-8 text-slate-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{displayHostel.gender}</div>
                  <div className="text-sm text-gray-400">Type</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-lg font-bold text-white">
                    {displayHostel.verified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 mb-6">
                <div className="flex flex-wrap border-b border-gray-700">
                  {['overview', 'rooms', 'reviews', 'location', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-semibold capitalize ${
                        activeTab === tab
                          ? 'text-slate-300 border-b-2 border-slate-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-8">{getTabContent()}</div>
              </div>
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
                    <IndianRupee className="w-8 h-8 text-slate-400" />
                    <span className="text-4xl font-bold text-white">
                      {displayHostel.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400">per month</p>
                </div>

                <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl mb-4">
                  Book Now
                </button>

                <button className="w-full py-4 border-2 border-slate-600 text-slate-300 hover:bg-slate-600/10 font-semibold rounded-xl transition-all mb-6">
                  Contact Owner
                </button>

                {/* Quick Contact */}
                {hostelData?.contact && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Contact</h3>
                    <div className="space-y-3">
                      <a
                        href={`tel:${hostelData.contact.phone}`}
                        className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        <Phone className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 text-sm">{hostelData.contact.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${hostelData.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        <MessageCircle className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 text-sm">WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${hostelData.contact.email}`}
                        className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span className="text-gray-300 text-sm">{hostelData.contact.email}</span>
                      </a>
                    </div>
                  </div>
                )}

                {hostel?.owner && (
                  <div className="border-t border-gray-700 pt-6 mt-6">
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

  function getTabContent() {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">About This Hostel</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {hostelData?.fullDescription || displayHostel?.description || hostel?.description}
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Amenities & Facilities</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {displayHostel?.amenities?.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">{amenity}</span>
                </div>
              ))}
            </div>

            {hostelData?.nearbyPlaces && hostelData.nearbyPlaces.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Nearby Places</h3>
                <div className="space-y-2 mb-6">
                  {hostelData.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{place}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {hostelData?.rules && hostelData.rules.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Hostel Rules</h3>
                <ul className="space-y-2">
                  {hostelData.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );

      case 'rooms':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Available Rooms</h2>
            {hostelData?.roomTypes && hostelData.roomTypes.length > 0 ? (
              <div className="space-y-4">
                {hostelData.roomTypes.map((room, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 rounded-xl p-6 border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{room.type}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {room.beds} bed(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {room.available} available
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ₹{room.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">per month</div>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                      Book This Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Room details not available. Please contact the hostel for more information.
                </p>
              </div>
            )}

            {(hostel?.totalRooms || hostel?.availableRooms) && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Rooms</p>
                  <p className="text-2xl font-bold text-white">{hostel.totalRooms}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Available Rooms</p>
                  <p className="text-2xl font-bold text-green-500">{hostel.availableRooms}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
            
            {/* Review Stats */}
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">
                    {displayHostel?.rating}
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(displayHostel?.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">
                    {hostelData?.totalReviews || displayHostel?.reviews || 0} reviews
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-300 mb-4">
                    Based on verified student feedback
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {hostelData?.studentReviews && hostelData.studentReviews.length > 0 ? (
              <div className="space-y-4 mb-8">
                {hostelData.studentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-700/50 rounded-xl p-6 border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{review.name}</span>
                          {review.verified && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-8">
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}

            {/* Add Review Form */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-white font-semibold mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600 hover:text-yellow-400'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-white font-semibold mb-2">Your Review</label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 min-h-[120px]"
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={!userRating || !userReview.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        );

      case 'location':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Location & Interactive Map</h2>
            
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-slate-400 mt-1" />
                <div>
                  <div className="text-white font-semibold mb-1">Address</div>
                  <div className="text-gray-300">{displayHostel?.location}</div>
                  {hostelData?.area && (
                    <div className="text-gray-400 text-sm mt-1">Area: {hostelData.area}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Map Component */}
            <InteractiveMap 
              currentHostel={hostelData ? {
                name: hostelData.name,
                location: hostelData.location,
                area: hostelData.area,
                coordinates: hostelData.coordinates
              } : undefined}
            />

            {hostelData?.nearbyPlaces && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-4">Nearby Landmarks</h3>
                <div className="grid gap-3">
                  {hostelData.nearbyPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg"
                    >
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-gray-300">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            
            {hostelData?.contact && (
              <div className="space-y-4 mb-8">
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Phone className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">Phone Number</div>
                      <a
                        href={`tel:${hostelData.contact.phone}`}
                        className="text-xl font-semibold text-white hover:text-slate-300"
                      >
                        {hostelData.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">WhatsApp</div>
                      <a
                        href={`https://wa.me/${hostelData.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold text-white hover:text-slate-300"
                      >
                        {hostelData.contact.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Mail className="w-6 h-6 text-slate-400" />
                    <div>
                      <div className="text-sm text-gray-400">Email Address</div>
                      <a
                        href={`mailto:${hostelData.contact.email}`}
                        className="text-xl font-semibold text-white hover:text-slate-300 break-all"
                      >
                        {hostelData.contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                {hostelData.contact.website && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div>
                        <div className="text-sm text-gray-400">Website</div>
                        <a
                          href={`https://${hostelData.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-semibold text-white hover:text-slate-300"
                        >
                          {hostelData.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Best Time to Contact</h3>
              <p className="text-gray-300 mb-4">
                We recommend calling during business hours (9 AM - 8 PM) for the fastest response.
                For urgent inquiries, WhatsApp is usually the quickest way to get a reply.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`tel:${hostelData?.contact?.phone || ''}`}
                  className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${hostelData?.contact?.whatsapp.replace(/[^0-9]/g, '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}
