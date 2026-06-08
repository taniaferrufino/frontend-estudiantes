export default function Loading() {
    return (
        <div className='mx-auto max-w-6xl px-6 py-10'>
            <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <div className='mb-2 h-3 w-24 animate-pulse rounded-full bg-slate-200' />
                    <div className='mb-2 h-8 w-40 animate-pulse rounded-lg bg-slate-200' />
                    <div className='h-4 w-64 animate-pulse rounded-full bg-slate-200' />
                </div>
                <div className='h-10 w-36 animate-pulse rounded-full bg-slate-200' />
            </div>
            <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                <div className='bg-slate-900 p-4'>
                    <div className='flex gap-8'>
                        <div className='h-4 w-16 animate-pulse rounded-full bg-slate-600' />
                        <div className='h-4 w-24 animate-pulse rounded-full bg-slate-600' />
                        <div className='h-4 w-32 animate-pulse rounded-full bg-slate-600' />
                        <div className='h-4 w-20 animate-pulse rounded-full bg-slate-600' />
                    </div>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex gap-8 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <div className='h-4 w-16 animate-pulse rounded-full bg-slate-200' />
                        <div className='h-4 w-24 animate-pulse rounded-full bg-slate-200' />
                        <div className='h-4 w-32 animate-pulse rounded-full bg-slate-200' />
                        <div className='h-4 w-20 animate-pulse rounded-full bg-slate-200' />
                    </div>
                ))}
            </div>
        </div>
    );
}
