import { Estudiante } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const URL = `${process.env.GATEWAY_URL}`;

export async function deleteStudent(id: number): Promise<boolean> {
    const response = await fetch(`${URL}/estudiantes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al eliminar estudiante: ${errorText}`);
        return false;
    }
    revalidatePath('/estudiantes');
    return true;
}

export async function deleteStudentAction(id: number) {
    'use server';
    await deleteStudent(id);
}

export async function updateStudent(id: number, data: Partial<Estudiante>): Promise<boolean> {
    const response = await fetch(`${URL}/estudiantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al actualizar estudiante: ${errorText}`);
        return false;
    }
    revalidatePath('/estudiantes');
    return true;
}

export async function updateStudentAction(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const nombres = String(formData.get('nombres') || '').trim();
    const paterno = String(formData.get('paterno') || '').trim();
    const materno = String(formData.get('materno') || '').trim();
    const direccion = String(formData.get('direccion') || '').trim();
    const sexoId = Number(formData.get('sexo_id'));
    const etniaId = Number(formData.get('etnia_id'));

    await updateStudent(id, {
        nombres,
        paterno,
        ...(materno ? { materno } : {}),
        direccion,
        sexo_id: sexoId,
        etnia_id: etniaId,
    });

    redirect('/estudiantes');
}

export async function createStudent(data: Partial<Estudiante>): Promise<boolean> {
    const response = await fetch(`${URL}/estudiantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al crear estudiante: ${errorText}`);
        return false;
    }
    revalidatePath('/estudiantes');
    return true;
}

export async function createStudentAction(formData: FormData) {
    'use server';
    const nombres = String(formData.get('nombres') || '').trim();
    const paterno = String(formData.get('paterno') || '').trim();
    const materno = String(formData.get('materno') || '').trim();
    const direccion = String(formData.get('direccion') || '').trim();
    const sexoId = Number(formData.get('sexo_id'));
    const etniaId = Number(formData.get('etnia_id'));

    await createStudent({
        nombres,
        paterno,
        ...(materno ? { materno } : {}),
        direccion,
        sexo_id: sexoId,
        etnia_id: etniaId,
    });

    redirect('/estudiantes');
}

export async function getAllStudents(): Promise<Estudiante[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${URL}/estudiantes`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch estudiantes: ${errorText}`);
        }
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('La respuesta del backend no es JSON válido');
        }
        if (Array.isArray(data)) return data;
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}

