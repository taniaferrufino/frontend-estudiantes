import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-white px-6 py-12 text-slate-900'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold'>Dashboard</h1>
          <p className='mt-2 text-sm text-slate-500'>Accesos rapidos para docentes y estudiantes.</p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Link
            href='/docentes'
            className='rounded-2xl border border-slate-200 p-6 transition hover:border-slate-300'
          >
            <h2 className='text-xl font-semibold'>Docentes</h2>
            <p className='mt-1 text-sm text-slate-500'>Gestion de docentes.</p>
          </Link>

          <Link
            href='/estudiantes'
            className='rounded-2xl border border-slate-200 p-6 transition hover:border-slate-300'
          >
            <h2 className='text-xl font-semibold'>Estudiantes</h2>
            <p className='mt-1 text-sm text-slate-500'>Gestion de estudiantes.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
