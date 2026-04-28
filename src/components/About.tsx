import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Instagram, Phone, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Profile } from '../types';
import CloudImage from './CloudImage';

export default function About({ profile }: { profile: Profile | null }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!profile) return null;

  const gallery = profile.galleryImages && profile.galleryImages.length > 0 
    ? profile.galleryImages 
    : [profile.aboutImageUrl || profile.mainImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000'];

  const nextImage = () => setCurrentIdx((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setCurrentIdx((prev) => (prev - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gallery.length]);

  const infoItems = [
    { label: 'HEIGHT', value: profile.height },
    { label: 'WEIGHT', value: profile.weight },
    { label: 'SHOES', value: profile.shoeSize },
  ];

  return (
    <section id="about" className="py-24 md:py-40 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
          {/* Profile Image Gallery */}
          <div className="flex flex-col space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[3/4] bg-gray-200 overflow-hidden relative border border-brand-text/10 group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CloudImage 
                    src={gallery[currentIdx]} 
                    alt={`Profile ${currentIdx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`aspect-[3/4] border transition-all overflow-hidden ${i === currentIdx ? 'border-brand-text' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <CloudImage src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="section-label m-0">About</h2>
              {profile.pdfUrl && (
                <a 
                  href={profile.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase border px-2 py-1 border-brand-text hover:bg-brand-text hover:text-white transition-all tracking-widest"
                >
                  Download PDF
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 text-sm border-t border-brand-text pt-8 mb-12">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center">
                  <span className="text-[10px] uppercase tracking-widest opacity-40 italic w-24">{item.label}</span>
                  <span className="font-medium">{item.value || '-'}</span>
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-[10px] uppercase tracking-widest opacity-40 italic w-24">Social</span>
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {profile.instagram?.split('/').pop()?.startsWith('@') ? profile.instagram?.split('/').pop() : `@${profile.instagram?.split('/').pop() || 'yeon_shots'}`}
                </a>
              </div>
            </div>

            {profile.bio && (
              <div className="mb-12">
                <h3 className="section-label">Biography</h3>
                <div className="text-sm border-t border-brand-text/10 pt-4 text-gray-700 leading-loose whitespace-pre-wrap font-light italic">
                  {profile.bio}
                </div>
              </div>
            )}

            <div className="mb-12">
              <h3 className="section-label">Specialties</h3>
              <p className="text-sm border-t border-brand-text/10 pt-4 text-gray-600 leading-relaxed">
                {profile.specialties?.join(', ') || 'No specialties listed'}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="section-label">Contact</h3>
              <div className="flex flex-col space-y-2 border-t border-brand-text/10 pt-4">
                <a href={`mailto:${profile.email}`} className="text-sm font-medium hover:opacity-60 transition-opacity">
                  {profile.email || 'Email not listed'}
                </a>
                <a href={`tel:${profile.phone}`} className="text-sm font-medium hover:opacity-60 transition-opacity">
                  {profile.phone || 'Phone not listed'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
