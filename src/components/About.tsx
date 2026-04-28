import { motion } from 'motion/react';
import { Mail, Instagram, Phone, Download } from 'lucide-react';
import { Profile } from '../types';

export default function About({ profile }: { profile: Profile | null }) {
  if (!profile) return null;

  const infoItems = [
    { label: 'HEIGHT', value: profile.height },
    { label: 'WEIGHT', value: profile.weight },
    { label: 'SHOES', value: profile.shoeSize },
  ];

  return (
    <section id="about" className="py-24 md:py-40 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
          {/* Profile Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[3/4] bg-gray-200 overflow-hidden relative border border-brand-text/10"
          >
             <img 
              src={profile.aboutImageUrl || profile.mainImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000'} 
              alt="About Profile" 
              className="w-full h-full object-cover grayscale"
            />
          </motion.div>

          {/* Info Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="section-label m-0">Profile</h2>
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
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">@instagram</a>
              </div>
            </div>

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
