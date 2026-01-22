'use client';

import { CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    'Verified and trusted hostels across Patna',
    'Transparent pricing with no hidden charges',
    'Virtual tours and detailed information',
    'Easy online booking process',
    'Dedicated customer support 24/7',
    'Regular quality checks and reviews',
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"
                alt="Students in hostel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl bg-purple-600/20 backdrop-blur-lg border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">4.8</div>
                <div className="text-white/60 text-sm">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">HostelHub</span>?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              We make finding your perfect hostel in Patna simple, safe, and stress-free.
              Our platform connects you with verified accommodations tailored to your needs.
            </p>

            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{reason}</span>
                </div>
              ))}
            </div>

            <a href="/about" className="mt-8 inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
