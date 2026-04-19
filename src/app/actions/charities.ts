'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addCharity(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const website_url = formData.get('website_url') as string;
  const image_url = formData.get('image_url') as string;
  const is_featured = formData.get('is_featured') === 'true';

  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  const { error } = await supabase
    .from('charities')
    .insert([{ name, description, website_url, image_url, is_featured }]);

  if (error) throw error;

  revalidatePath('/charities');
  revalidatePath('/admin');
  revalidatePath('/dashboard/charity');
}

export async function deleteCharity(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/charities');
  revalidatePath('/admin');
}
