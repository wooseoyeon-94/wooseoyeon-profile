import { motion } from 'motion/react';
import { Profile } from '../types';
import CloudImage from './CloudImage';

export default function Landing({ profile }: { profile: Profile | null }) {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-end justify-start overflow-hidden px-8 md:px-20 pb-20">
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 z-0">
        <CloudImage 
          src={profile?.mainImageUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1920'} 
          alt="Main Profile" 
          className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
          id="main_hero_img"
        />
        <div className="absolute inset-0 bg-brand-bg/10" />
      </div>

      <div className="relative z-10 text-white mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl md:text-4xl font-serif tracking-widest mb-1">
            {profile?.nameKo || '우서연'}
          </h1>
          <p 
            className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase px-2 py-0.5 inline-block"
            style={{ backgroundColor: '#000000', color: '#2c2424' }}
          >
            {profile?.nameEn || 'WOO SEOYEON'}
          </p>
        </motion.div>
      </div>

      {/* Decorative Text */}
      <div className="absolute bottom-20 right-8 md:right-20 hidden lg:block z-10 mix-blend-difference">
        <span className="text-[9px] font-bold tracking-[0.6em] text-white/70 uppercase [writing-mode:vertical-lr]">
          ACTRESS WOO SEOYEON PROFILE
        </span>
      </div>
    </section>
  );
}
