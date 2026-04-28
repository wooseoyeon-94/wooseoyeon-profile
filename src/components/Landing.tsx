import { motion } from 'motion/react';
import { Profile } from '../types';

export default function Landing({ profile }: { profile: Profile | null }) {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src={profile?.mainImageUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1920'} 
          alt="Main Profile" 
          className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
          id="main_hero_img"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center text-white px-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs md:text-sm font-light tracking-[0.6em] mb-4 uppercase opacity-80"
        >
          {profile?.tagline || 'Actor / Performer'}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-9xl font-serif mb-6 leading-none"
        >
          {profile?.nameKo || '이름 없음'}
          <span className="block text-xl md:text-3xl mt-4 tracking-[0.3em] font-light uppercase opacity-70">
            {profile?.nameEn || 'Name Unknown'}
          </span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          <a href="#works" className="text-xs uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-all">
            Works
          </a>
          <a href="#about" className="text-xs uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-all">
            Profile
          </a>
          <a href="#about" className="text-xs uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-all">
            Contact
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30" />
      </motion.div>
    </section>
  );
}
