import { motion } from 'motion/react';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onAdminClick, onHomeClick }: { onAdminClick: () => void, onHomeClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'HOME', href: '#home', onClick: onHomeClick },
    { label: 'ABOUT', href: '#about', onClick: onHomeClick },
    { label: 'WORKS', href: '#works', onClick: onHomeClick },
    { label: 'FEEDBACK', href: '#feedback', onClick: onHomeClick },
    { label: 'ASSETS', href: '#assets', onClick: onHomeClick },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-text/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.4em] font-bold cursor-pointer"
          onClick={onHomeClick}
        >
          PORTFOLIO
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {menuItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.label === 'HOME') {
                   e.preventDefault();
                   onHomeClick();
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                   // Let default anchor behavior handle scrolling to section
                   onHomeClick();
                }
              }}
              className="text-[10px] font-bold tracking-[0.2em] text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-all pb-1 uppercase"
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-gray-300 hover:text-black transition-all"
          >
            <UserIcon size={14} />
            <span className="uppercase">Admin</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={onAdminClick}>
            <UserIcon size={18} className="text-gray-400" />
          </button>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-6 py-8 flex flex-col space-y-6"
        >
          {menuItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium tracking-[0.2em] text-gray-500"
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
