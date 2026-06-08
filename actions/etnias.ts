import { revalidatePath } from 'next/cache';
import type { Etnia } from '@/types';

const URL = `${process.env.GATEWAY_URL}`;

export async function getAllEtnias(): Promise<Etnia[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${URL}/etnias`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch etnias: ${errorText}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) return data;
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function revalidateEtnias() {
    revalidatePath('/estudiantes');
}
