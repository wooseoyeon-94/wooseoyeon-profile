import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface CloudImageProps {
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  [key: string]: any;
}

const cache: Record<string, string> = {};

export default function CloudImage(props: CloudImageProps) {
  const { src, className, style, ...rest } = props;
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src) {
      setResolvedSrc(undefined);
      return;
    }

    if (!src.startsWith('storage://')) {
      setResolvedSrc(src);
      return;
    }

    const docId = src.replace('storage://', '');

    if (cache[docId]) {
      setResolvedSrc(cache[docId]);
      return;
    }

    setLoading(true);
    const fetchImage = async () => {
      try {
        const docRef = doc(db, 'uploads', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().data;
          cache[docId] = data;
          setResolvedSrc(data);
        } else {
          console.error('Image not found in cloud storage');
        }
      } catch (error) {
        console.error('Error fetching cloud image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [src]);

  if (loading) {
    return <div className={`animate-pulse bg-gray-200 ${className || ''}`} style={style} />;
  }

  if (!resolvedSrc) return null;

  return <img src={resolvedSrc} className={className} style={style} {...rest} />;
}
