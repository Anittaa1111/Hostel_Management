import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PopularHostels from '@/components/PopularHostels';
import Stats from '@/components/Stats';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Features />
      <PopularHostels />
      <Stats />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
