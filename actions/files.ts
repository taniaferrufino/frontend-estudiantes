const API_URL = '/api/avatar';

export async function getAvatarUrl(modelId: number): Promise<string | null> {
    try {
        const res = await fetch(`${API_URL}/${modelId}`);
        const data = await res.json();
        return data.url || null;
    } catch {
        return null;
    }
}

export async function uploadAvatar(modelId: number, file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const res = await fetch(`${API_URL}/${modelId}`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        return data.url || null;
    } catch {
        return null;
    }
}

export async function deleteAvatar(modelId: number): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/${modelId}`, { method: 'DELETE' });
        return res.ok;
    } catch {
        return false;
    }
}
