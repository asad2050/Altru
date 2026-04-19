'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addScore(formData: FormData) {
  const score = parseInt(formData.get('score') as string);
  const recordedAt = formData.get('recorded_at') as string;

  if (isNaN(score) || score < 1 || score > 45) {
    throw new Error('Score must be between 1 and 45');
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Get current scores
  const { data: currentScores, error: fetchError } = await supabase
    .from('scores')
    .select('id, recorded_at')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: true });

  if (fetchError) throw fetchError;

  // 2. If 5 or more, delete the oldest
  if (currentScores && currentScores.length >= 5) {
    const oldest = currentScores[0];
    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .eq('id', oldest.id);
    
    if (deleteError) throw deleteError;
  }

  // 3. Insert new score
  const { error: insertError } = await supabase
    .from('scores')
    .insert([
      {
        user_id: user.id,
        score,
        recorded_at: recordedAt,
      },
    ]);

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error('A score already exists for this date');
    }
    throw insertError;
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/scores');
}
