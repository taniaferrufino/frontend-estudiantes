import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Docente } from '@/types';

const URL = `${process.env.GATEWAY_URL}`;

const coerceValue = (value: FormDataEntryValue) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (trimmed === '') return '';
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    return trimmed;
};

const buildPayload = (formData: FormData, exclude: string[] = []) => {
    const payload: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
        if (exclude.includes(key)) continue;
        payload[key] = coerceValue(value);
    }
    return payload;
};

export async function getAllDocentes(): Promise<Docente[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${URL}/docentes`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch docentes: ${errorText}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) return data;
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function createDocente(data: Docente): Promise<boolean> {
    const response = await fetch(`${URL}/docentes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al crear docente: ${errorText}`);
        return false;
    }
    revalidatePath('/docentes');
    return true;
}

export async function updateDocente(id: number, data: Docente): Promise<boolean> {
    const response = await fetch(`${URL}/docentes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al actualizar docente: ${errorText}`);
        return false;
    }
    revalidatePath('/docentes');
    return true;
}

export async function deleteDocente(id: number): Promise<boolean> {
    const response = await fetch(`${URL}/docentes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al eliminar docente: ${errorText}`);
        return false;
    }
    revalidatePath('/docentes');
    return true;
}

export async function createDocenteAction(formData: FormData) {
    'use server';
    const payload = buildPayload(formData, []);
    await createDocente(payload);
    redirect('/docentes');
}

export async function updateDocenteAction(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const payload = buildPayload(formData, ['id']);
    await updateDocente(id, payload);
    redirect('/docentes');
}

export async function deleteDocenteAction(id: number) {
    'use server';
    await deleteDocente(id);
}
