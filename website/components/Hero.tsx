'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=600&fit=crop',
    title: 'Find Your Perfect Hostel',
    description: 'Comfortable stays for students & professionals across Patna',
  },
  {
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop',
    title: 'Affordable & Comfortable',
    description: 'Quality accommodation that fits your budget',
  },
  {
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=600&fit=crop',
    title: 'Premium Amenities',
    description: 'WiFi, Meals, Laundry & More - Everything you need',
  },
];

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleSearch = () => {
    router.push('/browsehostel');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Carousel */}
      <div className="relative h-full w-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              {carouselImages[currentSlide].title}
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            {carouselImages[currentSlide].description}
          </p>
        </div>

        {/* Search Box with Glassmorphism */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hostels by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Location (e.g., Boring Road)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Search
            </button>
          </div>
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105">
              🎓 For Students
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105">
              💼 For Professionals
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105">
              👩 Girls Only
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105">
              👨 Boys Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
