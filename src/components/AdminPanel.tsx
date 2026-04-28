import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2, LogIn, AlertCircle, Upload } from 'lucide-react';
import { db, signInWithGoogle, auth } from '../lib/firebase';
import { doc, setDoc, addDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { PortfolioData, Work, Testimonial, Asset, Profile } from '../types';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  data, 
  user,
  isAdmin 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: PortfolioData;
  user: any;
  isAdmin: boolean;
}) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'works' | 'feedback' | 'assets'>('profile');
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '9525') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-end"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col pt-24"
        >
          <div className="px-8 pb-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-serif">Admin Management</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          {!isUnlocked ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-gray-400">Password Required</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b-2 border-black py-2 text-2xl font-serif focus:outline-none"
                    placeholder="****"
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>
                <button type="submit" className="w-full py-4 bg-black text-white text-xs font-bold tracking-widest uppercase">
                  Unlock
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex bg-gray-50 px-8 border-b">
                {(['profile', 'works', 'feedback', 'assets'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'profile' && <ProfileForm profile={data.profile} />}
                {activeTab === 'works' && <ListForm collectionName="works" items={data.works} type="Work" />}
                {activeTab === 'feedback' && <ListForm collectionName="testimonials" items={data.testimonials} type="Feedback" />}
                {activeTab === 'assets' && <ListForm collectionName="assets" items={data.assets} type="Asset" />}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ImageInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void, key?: React.Key }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension - increased to 1200 for better quality while staying safe
        const MAX_SIDE = 1200;
        if (width > height) {
          if (width > MAX_SIDE) {
            height *= MAX_SIDE / width;
            width = MAX_SIDE;
          }
        } else {
          if (height > MAX_SIDE) {
            width *= MAX_SIDE / height;
            height = MAX_SIDE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as JPEG - 0.7 is a good balance for higher resolution
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange(compressedDataUrl);
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</label>
      <div className="flex space-x-2">
        <input 
          type="text" 
          className="flex-1 border p-2 text-sm bg-gray-50" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="https://... or upload"
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <button 
          type="button"
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 bg-gray-100 hover:bg-black hover:text-white transition-colors flex items-center justify-center border disabled:opacity-50"
          title="Upload from computer"
        >
          {isProcessing ? <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" /> : <Upload size={14} />}
        </button>
      </div>
      {value && value.startsWith('data:') && (
        <p className="text-[9px] text-gray-400 italic">Optimized image stored</p>
      )}
    </div>
  );
}

function ProfileForm({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState<Partial<Profile>>(profile || {});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize galleryImages with 5 empty strings if it doesn't exist or is shorter
  const galleryImages = form.galleryImages || [];
  const normalizedGallery = [...galleryImages, ...Array(5).fill('')].slice(0, 5);

  const save = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...form,
        galleryImages: normalizedGallery.filter(url => url.trim() !== '')
      };
      await setDoc(doc(db, 'profile', 'main'), dataToSave);
      alert('Saved successfully');
    } catch (e) {
      console.error(e);
      alert('Failed to save. This usually happens if images are too large (total limit 1MB). Try using fewer images or external URLs.');
    }
    setIsSaving(false);
  };

  const fields = [
    { key: 'nameKo', label: 'Name (KR)' },
    { key: 'nameEn', label: 'Name (EN)' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' },
    { key: 'shoeSize', label: 'Shoe Size' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'mainImageUrl', label: 'Main Hero Image URL' },
    { key: 'aboutImageUrl', label: 'About Image URL' },
    { key: 'pdfUrl', label: 'PDF Profile Link' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-6">
        {fields.map(f => (
          <div key={f.key} className={f.key.toLowerCase().includes('image') ? 'col-span-2' : ''}>
            {f.key.toLowerCase().includes('image') ? (
              <ImageInput label={f.label} value={(form as any)[f.key] || ''} onChange={(v) => setForm({ ...form, [f.key]: v })} />
            ) : (
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">{f.label}</label>
                <input 
                  type="text" 
                  className="w-full border p-2 text-sm"
                  value={(form as any)[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-6 border-t">
        <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-500">Profile Gallery Photos (Max 5)</h3>
        <p className="text-[10px] text-gray-400 italic">These images will appear in the About section gallery.</p>
        <div className="grid grid-cols-1 gap-4">
          {normalizedGallery.map((url, idx) => (
            <ImageInput 
              key={idx}
              label={`Gallery Image #${idx + 1}`} 
              value={url} 
              onChange={(v) => {
                const newGallery = [...normalizedGallery];
                newGallery[idx] = v;
                setForm({ ...form, galleryImages: newGallery });
              }} 
            />
          ))}
        </div>
      </div>
      <div className="bg-amber-50 p-4 border border-amber-200 text-[10px] text-amber-700 leading-relaxed uppercase tracking-wider">
        Note: Total profile data (including all 7 images) must fit within 1MB. The app automatically optimizes your uploads, but extremely high-res source files might still hit the limit.
      </div>
      <button 
        onClick={save} 
        disabled={isSaving}
        className="w-full py-4 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2"
      >
        <Save size={14} />
        <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
      </button>
    </div>
  );
}

function ListForm({ collectionName, items, type }: { collectionName: string, items: any[], type: string }) {
  const addItem = async () => {
    try {
      await addDoc(collection(db, collectionName), { 
        title: 'New Item', 
        name: 'New Item', 
        order: items.length,
        category: 'tops',
        year: '2024'
      });
    } catch (e) { console.error(e); }
  };

  const deleteItem = async (id: string) => {
    if (confirm('Delete this item?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (e) { console.error(e); }
    }
  };

  const updateField = async (id: string, field: string, value: any) => {
    try {
      await updateDoc(doc(db, collectionName, id), { [field]: value });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <button onClick={addItem} className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase border-2 border-black p-3 hover:bg-black hover:text-white transition-all">
        <Plus size={14} />
        <span>Add New {type}</span>
      </button>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 border bg-white space-y-4 relative group">
             <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500">
               <Trash2 size={16} />
             </button>

             {type === 'Work' && (
               <div className="grid grid-cols-2 gap-4 pt-4">
                 <Input label="Title" value={item.title} onChange={(v) => updateField(item.id, 'title', v)} />
                 <Input label="Year" value={item.year} onChange={(v) => updateField(item.id, 'year', v)} />
                 <Input label="Genre" value={item.genre} onChange={(v) => updateField(item.id, 'genre', v)} />
                 <Input label="Director" value={item.director} onChange={(v) => updateField(item.id, 'director', v)} />
                 <Input label="Character Name" value={item.characterName} onChange={(v) => updateField(item.id, 'characterName', v)} />
                 <div className="col-span-2 space-y-6 bg-gray-50/50 p-4 border border-dashed rounded-lg">
                   <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Work Portfolio Images (Max 3)</h4>
                   
                   <ImageInput 
                     label="Main Poster / Thumbnail" 
                     value={item.imageUrl} 
                     onChange={(v) => updateField(item.id, 'imageUrl', v)} 
                   />

                   <div className="grid grid-cols-2 gap-4">
                     {[0, 1].map(idx => (
                       <ImageInput 
                         key={idx}
                         label={`Additional Still #${idx + 1}`} 
                         value={(item.imageUrls || [])[idx] || ''} 
                         onChange={(v) => {
                           const newUrls = [...(item.imageUrls || ['', ''])];
                           newUrls[idx] = v;
                           updateField(item.id, 'imageUrls', newUrls);
                         }} 
                       />
                     ))}
                   </div>

                   <Input label="Video Selection/Trailer URL" value={item.videoUrl} onChange={(v) => updateField(item.id, 'videoUrl', v)} />
                 </div>
                 <div className="col-span-2">
                   <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Character Description</label>
                   <textarea 
                     className="w-full border p-2 text-sm" 
                     value={item.characterDescription} 
                     onChange={(e) => updateField(item.id, 'characterDescription', e.target.value)}
                   />
                 </div>
               </div>
             )}

             {type === 'Feedback' && (
               <div className="grid gap-4 pt-4">
                 <Input label="Author" value={item.author} onChange={(v) => updateField(item.id, 'author', v)} />
                 <Input label="Role" value={item.role} onChange={(v) => updateField(item.id, 'role', v)} />
                 <div>
                   <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Quote (1,000 characters max)</label>
                   <textarea 
                     className="w-full border p-2 text-sm min-h-[120px]" 
                     value={item.quote} 
                     onChange={(e) => updateField(item.id, 'quote', e.target.value)}
                     maxLength={1000}
                   />
                 </div>
               </div>
             )}

             {type === 'Asset' && (
               <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Category</label>
                   <select 
                     className="w-full border p-2 text-sm" 
                     value={item.category} 
                     onChange={(e) => updateField(item.id, 'category', e.target.value)}
                   >
                     <option value="tops">Tops (상의)</option>
                     <option value="bottoms">Bottoms (하의)</option>
                     <option value="shoes">Shoes (신발)</option>
                     <option value="others">Others (기타)</option>
                   </select>
                 </div>
                 <Input label="Name" value={item.name} onChange={(v) => updateField(item.id, 'name', v)} />
                 <div className="col-span-2">
                   <ImageInput label="Asset Image" value={item.imageUrl} onChange={(v) => updateField(item.id, 'imageUrl', v)} />
                 </div>
                 <div className="col-span-2">
                   <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Description</label>
                   <textarea 
                     className="w-full border p-2 text-sm" 
                     value={item.description} 
                     onChange={(e) => updateField(item.id, 'description', e.target.value)}
                   />
                 </div>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">{label}</label>
      <input 
        type="text" 
        className="w-full border p-2 text-sm" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}
