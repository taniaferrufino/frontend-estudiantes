import { revalidatePath } from 'next/cache';
import type { Sexo } from '@/types';

const URL = `${process.env.GATEWAY_URL}`;

export async function getAllSexos(): Promise<Sexo[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${URL}/sexos`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch sexos: ${errorText}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) return data;
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function revalidateSexos() {
    revalidatePath('/estudiantes');
}
