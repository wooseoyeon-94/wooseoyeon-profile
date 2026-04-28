import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ExternalLink } from 'lucide-react';
import { Work } from '../types';

export default function Works({ works, isPreview, onViewAll }: { works: Work[], isPreview?: boolean, onViewAll?: () => void }) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const displayWorks = isPreview ? works.slice(0, 2) : works;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section id="works" className={`py-24 md:py-40 bg-brand-bg px-6 ${!isPreview ? 'min-h-screen' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="section-label m-0">{isPreview ? 'Recent Works' : 'Selected Works'}</h2>
          {!isPreview && (
             <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              Back to Top
            </button>
          )}
        </div>

        {works.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="italic">No works recorded yet.</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-x-12 gap-y-16 ${isPreview ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {displayWorks.map((work, index) => (
                <motion.div 
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="aspect-video bg-[#DDE1E5] mb-6 overflow-hidden">
                    <img 
                      src={work.imageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800'} 
                      alt={work.title} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-gray-500 transition-colors">
                    {work.title} ({work.year})
                  </h3>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest mb-4">Dir. {work.director} / Role: {work.characterName}</p>
                  
                  <div className="border-t border-brand-text/20 pt-4">
                    <p className="text-xs italic leading-relaxed opacity-80 line-clamp-3">{work.characterDescription}</p>
                  </div>

                  {work.videoUrl && (
                    <div className="absolute top-4 right-4 bg-white/90 p-2 hover:bg-black hover:text-white transition-all scale-0 group-hover:scale-100">
                      <Play size={12} fill="currentColor" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {isPreview && works.length > 2 && (
              <div className="mt-20 text-center">
                <button 
                  onClick={onViewAll}
                  className="px-12 py-4 border border-brand-text/20 text-xs font-bold tracking-[0.3em] uppercase hover:bg-brand-text hover:text-white transition-all"
                >
                  View All Works
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg w-full max-w-5xl max-h-full overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedWork(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-2">
                <div className="bg-black aspect-video flex items-center justify-center">
                  {selectedWork.videoUrl && getYoutubeId(selectedWork.videoUrl) ? (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYoutubeId(selectedWork.videoUrl)}?autoplay=1`}
                      title={selectedWork.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-white text-xs opacity-40 italic uppercase tracking-widest text-center px-10">
                      No video available for embed.<br/>
                      {selectedWork.videoUrl && (
                        <a href={selectedWork.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 mt-4 hover:underline">
                          <span>Open External Link</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={selectedWork.imageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800'} 
                      alt={`${selectedWork.title} Main`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedWork.imageUrls && selectedWork.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 h-full">
                      {selectedWork.imageUrls.filter(url => url).map((url, i) => (
                        <div key={i} className="aspect-video bg-gray-200 overflow-hidden">
                          <img src={url} alt={`${selectedWork.title} Still ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 md:p-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 block mb-4">{selectedWork.genre || 'Film/Drama'} · {selectedWork.year}</span>
                    <h2 className="text-3xl md:text-5xl font-serif leading-tight">{selectedWork.title}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">Director</p>
                    <p className="text-sm font-medium">{selectedWork.director}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 border-t border-brand-text/10 pt-12">
                  <div>
                    <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mb-4">Character</h3>
                    <p className="text-xl font-medium">{selectedWork.characterName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mb-4">About the Role</h3>
                    <p className="text-sm md:text-base leading-relaxed opacity-80 italic">
                      {selectedWork.characterDescription}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
