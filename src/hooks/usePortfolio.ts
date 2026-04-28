import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Profile, Work, Testimonial, Asset, PortfolioData } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    works: [],
    testimonials: [],
    assets: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Hardcoded admin email from user metadata / request
      setIsAdmin(u?.email === 'jm01hyj@gmail.com');
    });

    // Profile listener
    const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), 
      (docSnap) => {
        if (docSnap.exists()) {
          setData(prev => ({ ...prev, profile: docSnap.data() as Profile }));
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'profile/main')
    );

    // Works listener
    const unsubWorks = onSnapshot(
      query(collection(db, 'works'), orderBy('order', 'asc')),
      (snap) => {
        const works = snap.docs.map(d => ({ id: d.id, ...d.data() } as Work));
        setData(prev => ({ ...prev, works }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'works')
    );

    // Testimonials listener
    const unsubTestimonials = onSnapshot(
      query(collection(db, 'testimonials'), orderBy('order', 'asc')),
      (snap) => {
        const testimonials = snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
        setData(prev => ({ ...prev, testimonials }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'testimonials')
    );

    // Assets listener
    const unsubAssets = onSnapshot(
      query(collection(db, 'assets'), orderBy('order', 'asc')),
      (snap) => {
        const assets = snap.docs.map(d => ({ id: d.id, ...d.data() } as Asset));
        setData(prev => ({ ...prev, assets }));
        setLoading(false);
        
        // Seed initial data if everything is empty
        getDoc(doc(db, 'profile', 'main')).then(async (profileSnap) => {
          if (!profileSnap.exists()) {
            await setDoc(doc(db, 'profile', 'main'), {
              nameKo: '김배우',
              nameEn: 'KIM ACTOR',
              tagline: '몰입하는 배우, 진심을 전하는 연기',
              height: '180cm',
              weight: '75kg',
              shoeSize: '270mm',
              specialties: ['사투리', '액션', '승마'],
              email: 'actor@example.com',
              phone: '010-1234-5678',
              instagram: 'https://instagram.com',
              mainImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1920',
              aboutImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000'
            });

            // Initial Work
            await addDoc(collection(db, 'works'), {
              title: '심야의 도시',
              year: '2023',
              genre: '느와르 / 액션',
              director: '홍길동',
              characterName: '강철민',
              characterDescription: '뒷골목을 전전하면서도 정의를 위해 싸우는 거친 매력의 형사 역할.',
              imageUrl: 'https://images.unsplash.com/photo-1485095329183-d279b86e69bb?auto=format&fit=crop&q=80&w=800',
              order: 0
            });

            // Initial Testimonial
            await addDoc(collection(db, 'testimonials'), {
              quote: '함께 작업할 때 몰입도가 뛰어난 배우입니다. 끊임없이 연구하고 캐릭터를 완성해나가는 모습이 인상적이었습니다.',
              author: '홍길동',
              role: '영화 감독',
              order: 0
            });

            // Initial Assets
            await addDoc(collection(db, 'assets'), {
              category: 'tops',
              name: 'White Oversized Shirt',
              description: '캐주얼하고 깨끗한 무드의 기본 화이트 셔츠.',
              imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
              order: 0
            });
            await addDoc(collection(db, 'assets'), {
              category: 'others',
              name: 'Vintage Camera',
              description: '소품용 수동 필름 카메라 (작동 가능).',
              imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
              order: 1
            });
          }
        });
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'assets')
    );

    return () => {
      unsubAuth();
      unsubProfile();
      unsubWorks();
      unsubTestimonials();
      unsubAssets();
    };
  }, []);

  return { data, loading, user, isAdmin };
}
