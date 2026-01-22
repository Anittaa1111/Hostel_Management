'use client';

import { Wifi, Utensils, Shirt, Shield, Car, Users, Zap, Clock } from 'lucide-react';

const features = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Stay connected with reliable high-speed internet 24/7',
  },
  {
    icon: Utensils,
    title: 'Meals Included',
    description: 'Healthy and delicious meals served three times a day',
  },
  {
    icon: Shirt,
    title: 'Laundry Service',
    description: 'Convenient laundry facilities at affordable rates',
  },
  {
    icon: Shield,
    title: '24/7 Security',
    description: 'Round-the-clock security with CCTV surveillance',
  },
  {
    icon: Car,
    title: 'Parking Available',
    description: 'Secure parking space for bikes and cars',
  },
  {
    icon: Users,
    title: 'Community Areas',
    description: 'Spacious common rooms for socializing and studying',
  },
  {
    icon: Zap,
    title: 'Power Backup',
    description: 'Uninterrupted power supply with backup generators',
  },
  {
    icon: Clock,
    title: 'Flexible Timings',
    description: 'Convenient check-in/out times and flexible policies',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Amenities</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Experience comfortable living with modern facilities designed for your convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all group-hover:scale-110">
                  <Icon className="w-7 h-7 text-purple-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
