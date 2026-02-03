'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Heart, Award, TrendingUp, Target, Sparkles, CheckCircle2, MapPin, Clock, Headphones } from 'lucide-react';
import React from 'react';

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Hostels',
      description: 'Every hostel undergoes strict verification to ensure safety and quality standards',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your perfect hostel in seconds with our streamlined booking process',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Student Community',
      description: 'Connect with fellow students and build lasting friendships in verified hostels',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Wishlist & Compare',
      description: 'Save your favorite hostels and compare features to make the best choice',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Smart Location Search',
      description: 'Find hostels near your college with integrated maps and area filters',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock assistance via phone, email, and WhatsApp',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Verified Hostels', icon: Award },
    { number: '10K+', label: 'Happy Students', icon: Users },
    { number: '15+', label: 'Areas Covered', icon: MapPin },
    { number: '4.8/5', label: 'Average Rating', icon: Sparkles }
  ];

  const values = [
    {
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency. Every hostel listing includes verified reviews, actual photos, and honest pricing.',
      icon: Shield
    },
    {
      title: 'Student-First Approach',
      description: 'Built by students, for students. We understand your needs and deliver exactly what matters to you.',
      icon: Target
    },
    {
      title: 'Innovation & Technology',
      description: 'Cutting-edge features like AI-powered recommendations, smart filters, and instant booking make your search effortless.',
      icon: Zap
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-slate-800/30"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-6"
              >
                <span className="px-6 py-3 bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-full text-slate-300 text-sm font-semibold">
                  🚀 Revolutionizing Student Accommodation
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Your Journey to the
                <span className="block text-slate-300 font-bold">
                  Perfect Home
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                We're not just a hostel booking platform - we're your trusted companion in finding 
                safe, comfortable, and affordable accommodation in Patna.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/browsehostel"
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Explore Hostels
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                >
                  Get in Touch
                </a>
              </div>
            </motion.div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-slate-500 transition-all group"
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Our <span className="text-slate-300 font-bold">Story</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Born from the frustration of finding quality student accommodation
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12">
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    HostelWala was founded in 2025 by a group of students who experienced firsthand the challenges 
                    of finding safe, affordable, and quality hostel accommodation in Patna. We spent countless 
                    hours visiting hostels, dealing with unverified listings, and struggling with outdated booking systems.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    We knew there had to be a better way. So we built HostelWala - a platform that combines 
                    cutting-edge technology with genuine care for students' needs. Today, we're proud to serve 
                    thousands of students across Patna, helping them find their perfect home away from home.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Our mission is simple: <span className="text-slate-300 font-semibold">make hostel hunting 
                    hassle-free, transparent, and enjoyable</span>. We verify every listing, empower students 
                    with honest reviews, and provide tools that make comparison and booking effortless.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Students <span className="text-slate-300 font-bold">Choose Us</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Features designed specifically for student needs, backed by innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Core <span className="text-slate-300 font-bold">Values</span>
              </h2>
              <p className="text-xl text-gray-300">
                Principles that guide everything we do
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-slate-700 rounded-3xl p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Find Your Perfect Hostel?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Join thousands of students who trust HostelWala for their accommodation needs
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="/browsehostel"
                    className="px-8 py-4 bg-white text-slate-800 hover:bg-gray-100 font-semibold rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                  >
                    Browse Hostels Now
                  </a>
                  <a
                    href="/wishlist"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    View Wishlist
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
