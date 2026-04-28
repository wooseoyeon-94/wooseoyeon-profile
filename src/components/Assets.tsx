import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Box, FileText } from 'lucide-react';
import { Asset } from '../types';
import CloudImage from './CloudImage';

export default function Assets({ assets, isPreview, onViewAll }: { assets: Asset[], isPreview?: boolean, onViewAll?: () => void }) {
  const categories = [
    { type: 'tops', label: 'TOPS (상의)' },
    { type: 'bottoms', label: 'BOTTOMS (하의)' },
    { type: 'shoes', label: 'SHOES (신발)' },
    { type: 'others', label: 'OTHERS (기타)' },
  ];

  return (
    <section id="assets" className={`py-24 md:py-40 bg-brand-bg px-6 ${!isPreview ? 'min-h-screen' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="section-label m-0">Assets</h2>
          {!isPreview && (
             <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              Back to Top
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <p className="text-xl font-serif leading-relaxed italic opacity-80">
            배역에 맞는 이미지 메이킹을 위한 개인 보유 의상 및 소품 리스트입니다. 
            현장 상황에 유연하게 대응하며 배역의 디테일을 높일 준비가 되어 있습니다.
          </p>
          <div className="flex flex-col justify-end">
            <p className="text-sm text-gray-500 italic">
              * 보유 의상 활용 시 별도의 의상 준비 시간을 단축할 수 있습니다.
            </p>
            {isPreview && (
              <button 
                onClick={onViewAll}
                className="mt-8 text-xs font-bold tracking-[0.3em] uppercase border-b-2 border-brand-text/10 pb-1 self-start hover:border-black transition-all"
              >
                + VIEW FULL ASSETS WINDOW
              </button>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ${isPreview ? '' : 'border-t border-brand-text/10 pt-12'}`}>
          {categories.map((cat) => {
            const catAssets = assets.filter(a => a.category === cat.type);
            const displayAssets = isPreview ? catAssets.slice(0, 2) : catAssets;

            return (
              <React.Fragment key={cat.type}>
                {/* Category Header (Full width on its row in the grid flow or just separate sections) */}
                <div className="col-span-full mt-8 first:mt-0">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4 pb-2 border-b border-brand-text/5">{cat.label}</h3>
                </div>
                
                {displayAssets.length === 0 ? (
                  <div className="col-span-full py-4 text-xs text-gray-300 italic">None listed</div>
                ) : (
                  displayAssets.map((asset) => (
                    <motion.div 
                      key={asset.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="group"
                    >
                      {asset.imageUrl && (
                        <div className="aspect-square bg-white/50 mb-2 overflow-hidden border border-brand-text/5 relative">
                          <CloudImage 
                            src={asset.imageUrl} 
                            alt={asset.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          {isPreview && catAssets.length > 2 && asset === displayAssets[1] && (
                            <div onClick={onViewAll} className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                              <span className="text-white text-[10px] font-bold tracking-widest uppercase">+ {catAssets.length - 2} MORE</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest truncate">{asset.name}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
