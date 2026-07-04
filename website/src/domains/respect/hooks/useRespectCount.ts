'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRespectCount(techId: string | null) {
  const [data, setData] = useState<{ success: boolean; count: number | null }>({ success: false, count: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!techId) return;
    
    let isMounted = true;
    
    const fetchCount = async () => {
      setIsLoading(true);
      try {
        const { count, error } = await supabase
          .from('respect_tracking')
          .select('*', { count: 'exact', head: true })
          .eq('tech_id', techId);
          
        if (error) throw error;
        
        if (isMounted) {
          setData({ success: true, count: count || 0 });
        }
      } catch (err) {
        if (isMounted) {
          setData({ success: false, count: null });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCount();
    
    return () => {
      isMounted = false;
    };
  }, [techId]);

  return {
    data,
    isLoading
  };
}
