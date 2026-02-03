'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles, GraduationCap, Building2, BookOpen, Landmark } from 'lucide-react';
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

// Popular areas in Patna
const popularAreas = [
  { name: 'Boring Road', type: 'area', icon: MapPin },
  { name: 'Kankarbagh', type: 'area', icon: MapPin },
  { name: 'Patliputra Colony', type: 'area', icon: MapPin },
  { name: 'Rajendra Nagar', type: 'area', icon: MapPin },
  { name: 'Bailey Road', type: 'area', icon: MapPin },
  { name: 'Anisabad', type: 'area', icon: MapPin },
  { name: 'Danapur', type: 'area', icon: MapPin },
  { name: 'Rukanpura', type: 'area', icon: MapPin },
];

// Popular colleges and coaching centers
const popularLandmarks = [
  { name: 'Patna University', type: 'college', icon: GraduationCap },
  { name: 'NIT Patna', type: 'college', icon: GraduationCap },
  { name: 'IIT Patna', type: 'college', icon: GraduationCap },
  { name: 'AIIMS Patna', type: 'college', icon: GraduationCap },
  { name: 'Patna Medical College', type: 'college', icon: GraduationCap },
  { name: 'Patna College', type: 'college', icon: GraduationCap },
  { name: 'AN College', type: 'college', icon: GraduationCap },
  { name: 'Patna Women\'s College', type: 'college', icon: GraduationCap },
  { name: 'Super 30 (Ramanujan School)', type: 'coaching', icon: BookOpen },
  { name: 'Career Point', type: 'coaching', icon: BookOpen },
  { name: 'Brilliant Tutorial', type: 'coaching', icon: BookOpen },
  { name: 'Aakash Institute', type: 'coaching', icon: BookOpen },
  { name: 'FIITJEE Patna', type: 'coaching', icon: BookOpen },
  { name: 'Khan GS Research Centre (UPSC)', type: 'coaching', icon: BookOpen },
  { name: 'Samarpan IAS Academy', type: 'coaching', icon: BookOpen },
  { name: 'Chanakya IAS Academy', type: 'coaching', icon: BookOpen },
  { name: 'Gandhi Maidan', type: 'landmark', icon: Landmark },
  { name: 'Patna Junction', type: 'landmark', icon: Building2 },
  { name: 'Patna Airport', type: 'landmark', icon: Building2 },
];

const allLocations = [...popularAreas, ...popularLandmarks];

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(allLocations);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Filter locations based on input
    if (location) {
      const filtered = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(allLocations);
    }
  }, [location]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('location', location);
    router.push(`/browsehostel?${params.toString()}`);
  };

  const handleLocationSelect = (locationName: string) => {
    setLocation(locationName);
    setShowLocationSuggestions(false);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'college': return '🎓';
      case 'coaching': return '📚';
      case 'landmark': return '🏛️';
      default: return '📍';
    }
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

        {/* Enhanced Search Box with Autocomplete */}
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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-slate-400/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex-1 relative" ref={locationInputRef}>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Area, College, or Coaching Center..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-slate-400/50 backdrop-blur-sm"
              />
              
              {/* Autocomplete Dropdown */}
              {showLocationSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl max-h-96 overflow-y-auto z-50">
                  {/* Popular Areas Section */}
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">Popular Areas</p>
                    <div className="grid grid-cols-2 gap-2">
                      {popularAreas.slice(0, 6).map((area) => (
                        <button
                          key={area.name}
                          onClick={() => handleLocationSelect(area.name)}
                          className="text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                        >
                          <span className="mr-2">📍</span>{area.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colleges Section */}
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">🎓 Colleges & Universities</p>
                    <div className="space-y-1">
                      {popularLandmarks.filter(l => l.type === 'college').slice(0, 5).map((college) => (
                        <button
                          key={college.name}
                          onClick={() => handleLocationSelect(college.name)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4 text-slate-300" />
                          {college.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coaching Centers Section */}
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">📚 Coaching Centers</p>
                    <div className="space-y-1">
                      {popularLandmarks.filter(l => l.type === 'coaching').slice(0, 5).map((coaching) => (
                        <button
                          key={coaching.name}
                          onClick={() => handleLocationSelect(coaching.name)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4 text-slate-300" />
                          {coaching.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* All Matching Results */}
                  {location && filteredLocations.length > 0 && (
                    <div className="p-3">
                      <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">All Results</p>
                      <div className="space-y-1">
                        {filteredLocations.slice(0, 10).map((loc) => (
                          <button
                            key={loc.name}
                            onClick={() => handleLocationSelect(loc.name)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all flex items-center gap-2"
                          >
                            <span>{getCategoryIcon(loc.type)}</span>
                            <span>{loc.name}</span>
                            <span className="text-xs text-white/50 ml-auto capitalize">{loc.type}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              onClick={handleSearch}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Search
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <button 
              onClick={() => router.push('/browsehostel')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
            >
              🎓 For Students
            </button>
            <button 
              onClick={() => router.push('/browsehostel')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
            >
              💼 For Professionals
            </button>
            <button 
              onClick={() => router.push('/browsehostel?gender=Girls')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
            >
              👩 Girls Only
            </button>
            <button 
              onClick={() => router.push('/browsehostel?gender=Boys')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
            >
              👨 Boys Only
            </button>
          </div>

          {/* Popular Landmarks Quick Access */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-xs mb-2 text-center">🔥 Popular Near:</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {['NIT Patna', 'IIT Patna', 'AIIMS Patna', 'Super 30', 'Boring Road', 'Kankarbagh'].map((place) => (
                <button
                  key={place}
                  onClick={() => {
                    setLocation(place);
                    handleSearch();
                  }}
                  className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 text-white text-xs rounded-full transition-all hover:scale-105"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
