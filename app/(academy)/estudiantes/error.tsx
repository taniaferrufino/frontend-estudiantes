'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className='mx-auto max-w-6xl px-6 py-10'>
            <div className='rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center'>
                <h2 className='mb-2 text-lg font-semibold text-rose-800'>Error al cargar estudiantes</h2>
                <p className='mb-4 text-sm text-rose-600'>
                    {error.message || 'No se pudieron obtener los datos. Intenta de nuevo.'}
                </p>
                <button
                    onClick={reset}
                    className='rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-500'
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}
