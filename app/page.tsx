import Link from 'next/link';
import { getAllStudents } from '@/actions/estudiantes';
import { getAllDocentes } from '@/actions/docentes';
import { getAllSexos } from '@/actions/sexos';
import { getAllEtnias } from '@/actions/etnias';

export default async function Home() {
  const [estudiantes, docentes, sexos, etnias] = await Promise.all([
    getAllStudents().catch(() => []),
    getAllDocentes().catch(() => []),
    getAllSexos().catch(() => []),
    getAllEtnias().catch(() => []),
  ]);

  const stats = [
    {
      label: 'Estudiantes',
      value: estudiantes.length,
      href: '/estudiantes',
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5' />
        </svg>
      ),
      gradient: 'from-sky-500 to-blue-600',
      ring: 'ring-sky-100',
    },
    {
      label: 'Docentes',
      value: docentes.length,
      href: '/docentes',
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      ring: 'ring-emerald-100',
    },
    {
      label: 'Sexos',
      value: sexos.length,
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z' />
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 6h.008v.008H6V6Z' />
        </svg>
      ),
      gradient: 'from-violet-500 to-purple-600',
      ring: 'ring-violet-100',
    },
    {
      label: 'Etnias',
      value: etnias.length,
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418' />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-100',
    },
  ] as const;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12 text-slate-900'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-10'>
          <div className='mb-2 inline-block rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm'>
            Panel de control
          </div>
          <h1 className='text-4xl font-bold tracking-tight text-slate-900'>
            Dashboard Académico
          </h1>
          <p className='mt-2 text-base text-slate-500'>
            Resumen general del sistema de gestión académica.
          </p>
        </div>

        <div className='mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => {
            const isLink = 'href' in stat && stat.href;
            const content = (
              <>
                <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 text-white shadow-lg ring-4 ${stat.ring}`}>
                  {stat.icon}
                </div>
                <p className='text-3xl font-bold tracking-tight'>{stat.value}</p>
                <p className='mt-1 text-sm font-medium text-slate-500'>{stat.label}</p>
              </>
            );

            if (isLink) {
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 transition-all duration-200 group-hover:from-sky-50/50 group-hover:to-blue-50/50' />
                  <div className='relative'>{content}</div>
                </Link>
              );
            }

            return (
              <div
                key={stat.label}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                {content}
              </div>
            );
          })}
        </div>

        <h2 className='mb-5 text-xl font-semibold text-slate-900'>Módulos</h2>
        <div className='grid gap-5 md:grid-cols-2'>
          <Link
            href='/estudiantes'
            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
          >
            <div className='absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 opacity-60 transition-all duration-300 group-hover:scale-150' />
            <div className='relative flex items-start justify-between'>
              <div>
                <div className='mb-2 inline-flex rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 p-2 text-white shadow-md'>
                  <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-slate-900'>Gestión de Estudiantes</h3>
                <p className='mt-1 text-sm text-slate-500'>Administra el registro, edición y eliminación de estudiantes.</p>
              </div>
              <span className='text-2xl font-bold text-sky-600'>{estudiantes.length}</span>
            </div>
          </Link>

          <Link
            href='/docentes'
            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
          >
            <div className='absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-60 transition-all duration-300 group-hover:scale-150' />
            <div className='relative flex items-start justify-between'>
              <div>
                <div className='mb-2 inline-flex rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2 text-white shadow-md'>
                  <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-slate-900'>Gestión de Docentes</h3>
                <p className='mt-1 text-sm text-slate-500'>Administra el registro, edición y eliminación de docentes.</p>
              </div>
              <span className='text-2xl font-bold text-emerald-600'>{docentes.length}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
