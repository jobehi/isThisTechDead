'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePayRespects() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<{ success: boolean; count: number | null; disabled?: boolean } | null>(null);

  const wrappedSubmit = async (params: { techId: string; techName: string }) => {
    setIsSubmitting(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const functionUrl = `${supabaseUrl}/functions/v1/pay_respect`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();
      
      const formattedResult = {
        success: result.success || false,
        count: result.count ?? null,
        disabled: !result.success && result.error === 'FEATURE_DISABLED',
      };
      
      setData(formattedResult);
      return formattedResult;
    } catch (err) {
      const errorResult = { success: false, count: null };
      setData(errorResult);
      return errorResult;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submit: wrappedSubmit,
    isSubmitting,
    data,
  };
}
