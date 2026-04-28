import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Testimonial } from '../types';

export default function Feedback({ feedback }: { feedback: Testimonial[] }) {
  const [showAll, setShowAll] = useState(false);
  if (feedback.length === 0) return null;

  const displayItems = showAll ? feedback : feedback.slice(0, 4);

  return (
    <section id="feedback" className="py-24 md:py-40 bg-brand-bg px-6 border-y border-brand-text/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-label mb-16">Feedback</h2>
        
        <div className="space-y-12">
          {displayItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}
            >
              {/* Chat Bubble */}
              <div className={`relative max-w-[80%] p-6 md:p-8 shadow-sm ${
                index % 2 === 0 
                  ? 'bg-white text-brand-text rounded-2xl rounded-tl-none' 
                  : 'bg-brand-text text-white rounded-2xl rounded-tr-none'
              }`}>
                <p className="text-sm md:text-base leading-relaxed font-medium">
                  {item.quote}
                </p>
                
                {/* Bubble Tail */}
                <div className={`absolute top-0 w-4 h-4 ${
                  index % 2 === 0 
                    ? '-left-2 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]' 
                    : '-right-2 bg-brand-text [clip-path:polygon(0_0,100%_0,0_100%)]'
                }`} />
              </div>

              {/* Sender Info */}
              <div className={`mt-4 flex items-center space-x-2 ${index % 2 === 0 ? 'ml-2' : 'mr-2'}`}>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 italic">{item.role}</span>
                <div className="w-4 h-[1px] bg-brand-text/20" />
                <span className="text-[10px] uppercase tracking-widest font-bold">From. {item.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {feedback.length > 4 && !showAll && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="text-[10px] font-bold tracking-[0.3em] uppercase border-b-2 border-brand-text/20 pb-1 hover:border-black transition-all"
            >
              View More Feedback
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
