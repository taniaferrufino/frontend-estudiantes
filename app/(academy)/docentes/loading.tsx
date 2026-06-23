export default function Loading() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10'>
            <div className='mx-auto max-w-6xl'>
                <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
                    <div>
                        <div className='mb-2 h-5 w-32 animate-pulse rounded-full bg-slate-200' />
                        <div className='mb-1 h-9 w-44 animate-pulse rounded-lg bg-slate-200' />
                        <div className='h-4 w-64 animate-pulse rounded-full bg-slate-200' />
                    </div>
                    <div className='h-10 w-40 animate-pulse rounded-full bg-slate-200' />
                </div>
                <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                    <div className='bg-gradient-to-r from-slate-900 to-slate-800 p-4'>
                        <div className='flex gap-8'>
                            <div className='h-4 w-12 animate-pulse rounded-full bg-slate-600' />
                            <div className='h-4 w-20 animate-pulse rounded-full bg-slate-600' />
                            <div className='h-4 w-20 animate-pulse rounded-full bg-slate-600' />
                            <div className='h-4 w-28 animate-pulse rounded-full bg-slate-600' />
                            <div className='h-4 w-20 animate-pulse rounded-full bg-slate-600' />
                        </div>
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`flex gap-8 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <div className='h-8 w-8 animate-pulse rounded-full bg-slate-200' />
                            <div className='h-4 w-20 animate-pulse rounded-full bg-slate-200' />
                            <div className='h-4 w-20 animate-pulse rounded-full bg-slate-200' />
                            <div className='h-4 w-28 animate-pulse rounded-full bg-slate-200' />
                            <div className='h-4 w-24 animate-pulse rounded-full bg-slate-200' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
