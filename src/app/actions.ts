'use server';

import { revalidatePath } from 'next/cache';

export async function reloadBlockListData() {
  revalidatePath('/[chain]/blocks');
  revalidatePath('/', 'layout');
}
