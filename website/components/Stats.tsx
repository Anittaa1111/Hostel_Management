'use client';

import { TrendingUp, Award, Users, Building2 } from 'lucide-react';

const stats = [
  { icon: Building2, value: '50+', label: 'Verified Hostels' },
  { icon: Users, value: '2000+', label: 'Happy Residents' },
  { icon: Award, value: '4.8', label: 'Average Rating' },
  { icon: TrendingUp, value: '95%', label: 'Occupancy Rate' },
];

export default function Stats() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all">
                  <Icon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
