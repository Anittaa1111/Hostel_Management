'use client';

import { Star, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import hostelsData from '@/data/hostels.json';

export default function PopularHostels() {
  // Get only featured hostels and limit to 6
  const featuredHostels = hostelsData.hostels
    .filter(hostel => hostel.featured)
    .slice(0, 6);

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Popular <span className="text-slate-300 font-bold">Hostels</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover the most loved and trusted hostels with excellent ratings and amenities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHostels.map((hostel, index) => (
            <div
              key={hostel.id}
              className="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hostel.images[0]}
                  alt={hostel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-slate-700 text-white text-sm font-semibold rounded-full shadow-lg">
                  {hostel.gender}
                </div>
                {hostel.verified && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <span>✓</span> Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">
                  {hostel.name}
                </h3>

                <div className="flex items-center gap-1 text-white/60 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hostel.location}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">
                      {hostel.rating}
                    </span>
                  </div>
                  <span className="text-white/60 text-sm">
                    ({hostel.id} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hostel.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hostel.amenities.length > 3 && (
                    <span className="text-white/60 text-xs py-1">
                      +{hostel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <p className="text-white/50 text-sm mb-4">{hostel.distance}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-slate-400" />
                    <span className="text-2xl font-bold text-white">
                      {hostel.price.toLocaleString()}
                    </span>
                    <span className="text-white/60 text-sm">/month</span>
                  </div>
                  <Link 
                    href={`/hostel/${hostel.slug}`}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/browsehostel"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Hostels
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
