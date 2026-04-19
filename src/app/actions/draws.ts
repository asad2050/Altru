'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function runDrawSimulation() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  // 1. Generate 5 random numbers (1-45)
  const winningNumbers = [];
  while (winningNumbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!winningNumbers.includes(num)) {
      winningNumbers.push(num);
    }
  }

  // 2. Fetch all active subscribers
  const { data: subscribers } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active');

  if (!subscribers) return { winningNumbers, winnersCount: 0 };

  // 3. Match each user's latest 5 scores with winning numbers
  let matches = { 3: 0, 4: 0, 5: 0 };
  const winners = [];

  for (const sub of subscribers) {
    const { data: scores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', sub.user_id)
      .order('recorded_at', { ascending: false })
      .limit(5);

    if (!scores) continue;

    const userNumbers = scores.map(s => s.score);
    const matchCount = userNumbers.filter(num => winningNumbers.includes(num)).length;

    if (matchCount >= 3) {
      matches[matchCount as 3 | 4 | 5]++;
      winners.push({
        user_id: sub.user_id,
        match_count: matchCount,
      });
    }
  }

  return {
    winningNumbers,
    matches,
    totalWinners: winners.length
  };
}

export async function publishDraw(winningNumbers: number[], totalPrizePool: number) {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  // 1. Create the draw record
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .insert([
      {
        winning_numbers: winningNumbers,
        total_prize_pool: totalPrizePool,
        status: 'published',
      },
    ])
    .select()
    .single();

  if (drawError) throw drawError;

  // 2. Calculate prizes (simplified logic based on match counts)
  // PRD: 40% (5), 35% (4), 25% (3)
  
  // This would involve another pass to identify winners and insert into 'winners' table
  // In a real app, this would be a background job or a stored procedure

  revalidatePath('/dashboard/draws');
  revalidatePath('/admin');
}
