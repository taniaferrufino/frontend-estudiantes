import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:3000';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ modelId: string }> },
) {
    const { modelId } = await params;
    const res = await fetch(`${GATEWAY}/files/avatar/${modelId}`);
    const data = await res.json();
    return NextResponse.json(data);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ modelId: string }> },
) {
    try {
        const { modelId } = await params;
        const formData = await request.formData();
        const file = formData.get('avatar') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No se envio ninguna imagen' }, { status: 400 });
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${modelId}-${Date.now()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const filePath = join(process.cwd(), 'public', 'avatars', fileName);
        await writeFile(filePath, buffer);

        const url = `/avatars/${fileName}`;

        await fetch(`${GATEWAY}/files/avatar/${modelId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        return NextResponse.json({ url });
    } catch {
        return NextResponse.json({ error: 'Error al subir avatar' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ modelId: string }> },
) {
    try {
        const { modelId } = await params;

        const res = await fetch(`${GATEWAY}/files/avatar/${modelId}`);
        const data = await res.json();

        if (data.url) {
            const filePath = join(process.cwd(), 'public', data.url);
            await unlink(filePath).catch(() => {});
        }

        await fetch(`${GATEWAY}/files/avatar/${modelId}`, { method: 'DELETE' });

        return NextResponse.json({ message: 'Avatar eliminado' });
    } catch {
        return NextResponse.json({ error: 'Error al eliminar avatar' }, { status: 500 });
    }
}
