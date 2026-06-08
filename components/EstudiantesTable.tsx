"use client";

import { useState, useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { Estudiante, Sexo, Etnia } from '@/types';
import { getAvatarUrl, uploadAvatar, deleteAvatar } from '@/actions/files';

type Props = {
    estudiantes: Estudiante[];
    onDelete: (id: number) => void | Promise<void>;
    onUpdate: (formData: FormData) => void | Promise<void>;
    onCreate: (formData: FormData) => void | Promise<void>;
    sexos: Sexo[];
    etnias: Etnia[];
};

export default function EstudiantesTable({ estudiantes, onDelete, onUpdate, onCreate, sexos, etnias }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedEst, setSelectedEst] = useState<Estudiante | null>(null);
    const [profileRow, setProfileRow] = useState<Estudiante | null>(null);
    const [form, setForm] = useState({ nombres: '', paterno: '', materno: '', direccion: '', sexo_id: '', etnia_id: '' });
    const [createForm, setCreateForm] = useState({ nombres: '', paterno: '', materno: '', direccion: '', sexo_id: '', etnia_id: '' });
    const [avatarKey, setAvatarKey] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [avatarUrls, setAvatarUrls] = useState<Record<number, string | null>>({});
    const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvatars = async () => {
            const urls: Record<number, string | null> = {};
            await Promise.allSettled(
                estudiantes.map(async (est) => {
                    const url = await getAvatarUrl(est.id);
                    urls[est.id] = url;
                }),
            );
            setAvatarUrls(urls);
        };
        if (estudiantes.length > 0) fetchAvatars();
    }, [estudiantes]);

    const handleEdit = (est: Estudiante) => {
        setSelectedEst(est);
        setForm({
            nombres: est.nombres,
            paterno: est.paterno,
            materno: est.materno || '',
            direccion: est.direccion,
            sexo_id: String(est.sexo_id),
            etnia_id: String(est.etnia_id),
        });
        setShowModal(true);
    };

    const handleOpenProfile = async (est: Estudiante) => {
        setProfileRow(est);
        setShowProfileModal(true);
        const url = await getAvatarUrl(est.id);
        setProfileAvatarUrl(url);
    };

    const handleUploadAvatar = useCallback(async (file: File) => {
        if (!profileRow?.id) return;
        setUploading(true);
        const url = await uploadAvatar(profileRow.id, file);
        if (url) setProfileAvatarUrl(url);
        setAvatarKey((k) => k + 1);
        setUploading(false);
    }, [profileRow]);

    const handleDeleteAvatar = useCallback(async () => {
        if (!profileRow?.id) return;
        await deleteAvatar(profileRow.id);
        setProfileAvatarUrl(null);
        setAvatarKey((k) => k + 1);
    }, [profileRow]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCreateForm({ ...createForm, [e.target.name]: e.target.value });
    };

    const openCreateModal = () => {
        setCreateForm({
            nombres: '',
            paterno: '',
            materno: '',
            direccion: '',
            sexo_id: sexos[0] ? String(sexos[0].id) : '',
            etnia_id: etnias[0] ? String(etnias[0].id) : '',
        });
        setShowCreateModal(true);
    };

    const getLabel = (item: { sexo?: string; etnia?: string; nombre?: string; descripcion?: string; name?: string; id: number }) => {
        return item.sexo || item.etnia || item.nombre || item.descripcion || item.name || `ID ${item.id}`;
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className='mx-auto max-w-6xl px-6 py-10'>
            <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Registro academico</p>
                    <h1 className='text-3xl font-semibold text-slate-900'>Estudiantes</h1>
                    <p className='mt-1 text-sm text-slate-500'>Gestiona altas, edicion y eliminacion de estudiantes.</p>
                </div>
                <button
                    type='button'
                    onClick={openCreateModal}
                    className='rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500'
                >
                    + Crear estudiante
                </button>
            </div>

            <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                <table className='w-full border-collapse text-left text-sm'>
                    <thead className='bg-slate-900 text-white'>
                        <tr>
                            <th className='w-12 px-2 py-4 text-center font-medium'>AV</th>
                            <th className='px-5 py-4 font-medium'>Nombre</th>
                            <th className='px-5 py-4 font-medium'>Paterno</th>
                            <th className='px-5 py-4 font-medium'>Materno</th>
                            <th className='px-5 py-4 font-medium'>Direccion</th>
                            <th className='px-5 py-4 text-center font-medium'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {estudiantes.map((est, index) => (
                            <tr key={est.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className='px-2 py-4 text-center'>
                                    {avatarUrls[est.id] ? (
                                        <img
                                            src={avatarUrls[est.id]!}
                                            alt='avatar'
                                            className='mx-auto h-8 w-8 rounded-full object-cover'
                                        />
                                    ) : (
                                        <div className='mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500'>
                                            {est.nombres ? est.nombres[0].toUpperCase() : '?'}
                                        </div>
                                    )}
                                </td>
                                <td className='px-5 py-4 font-medium text-slate-900'>{est.nombres}</td>
                                <td className='px-5 py-4 text-slate-600'>{est.paterno}</td>
                                <td className='px-5 py-4 text-slate-600'>{est.materno}</td>
                                <td className='px-5 py-4 text-slate-600'>{est.direccion}</td>
                                <td className='px-5 py-4 text-center'>
                                    <div className='flex items-center justify-center gap-3'>
                                        <button
                                            type='button'
                                            onClick={() => handleOpenProfile(est)}
                                            className='rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50'
                                        >
                                            Perfil
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleEdit(est)}
                                            className='rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400'
                                        >
                                            Actualizar
                                        </button>
                                        <form action={onDelete.bind(null, est.id)}>
                                            <button
                                                type='submit'
                                                className='rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50'
                                            >
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Actualizar Estudiante</h2>
                        <p className='mb-4 text-sm text-slate-500'>Edita los datos principales del estudiante.</p>
                        <form action={onUpdate} className='flex flex-col gap-3'>
                            <input type='hidden' name='id' value={selectedEst?.id ?? ''} />
                            <input
                                name='nombres'
                                value={form.nombres}
                                onChange={handleChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Nombres'
                                required
                            />
                            <input
                                name='paterno'
                                value={form.paterno}
                                onChange={handleChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Paterno'
                                required
                            />
                            <input
                                name='materno'
                                value={form.materno}
                                onChange={handleChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Materno'
                            />
                            <input
                                name='direccion'
                                value={form.direccion}
                                onChange={handleChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Direccion'
                                required
                            />
                            <div className='grid grid-cols-2 gap-3'>
                                <select
                                    name='sexo_id'
                                    value={form.sexo_id}
                                    onChange={handleChange}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    required
                                >
                                    {sexos.map((sexo) => (
                                        <option key={sexo.id} value={sexo.id}>
                                            {getLabel(sexo)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name='etnia_id'
                                    value={form.etnia_id}
                                    onChange={handleChange}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    required
                                >
                                    {etnias.map((etnia) => (
                                        <option key={etnia.id} value={etnia.id}>
                                            {getLabel(etnia)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button type='button' onClick={handleClose} className='rounded-full border border-slate-200 px-4 py-2 text-sm'>
                                    Cancelar
                                </button>
                                <button type='submit' className='rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white'>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Crear Estudiante</h2>
                        <p className='mb-4 text-sm text-slate-500'>Completa los datos para registrar un nuevo estudiante.</p>
                        <form action={onCreate} className='flex flex-col gap-3'>
                            <input
                                name='nombres'
                                value={createForm.nombres}
                                onChange={handleCreateChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Nombres'
                                required
                            />
                            <input
                                name='paterno'
                                value={createForm.paterno}
                                onChange={handleCreateChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Paterno'
                                required
                            />
                            <input
                                name='materno'
                                value={createForm.materno}
                                onChange={handleCreateChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Materno'
                            />
                            <input
                                name='direccion'
                                value={createForm.direccion}
                                onChange={handleCreateChange}
                                className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Direccion'
                                required
                            />
                            <div className='grid grid-cols-2 gap-3'>
                                <select
                                    name='sexo_id'
                                    value={createForm.sexo_id}
                                    onChange={handleCreateChange}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    required
                                >
                                    {sexos.map((sexo) => (
                                        <option key={sexo.id} value={sexo.id}>
                                            {getLabel(sexo)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name='etnia_id'
                                    value={createForm.etnia_id}
                                    onChange={handleCreateChange}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    required
                                >
                                    {etnias.map((etnia) => (
                                        <option key={etnia.id} value={etnia.id}>
                                            {getLabel(etnia)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button type='button' onClick={() => setShowCreateModal(false)} className='rounded-full border border-slate-200 px-4 py-2 text-sm'>
                                    Cancelar
                                </button>
                                <button type='submit' className='rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white'>
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showProfileModal && profileRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Perfil</h2>
                        <p className='mb-6 text-sm text-slate-500'>Foto de perfil del estudiante.</p>

                        <div className='mb-6 flex flex-col items-center gap-4'>
                            {profileAvatarUrl ? (
                                <img
                                    key={avatarKey}
                                    src={profileAvatarUrl}
                                    alt='avatar'
                                    className='h-28 w-28 rounded-full object-cover ring-4 ring-slate-100'
                                />
                            ) : (
                                <div className='flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 ring-4 ring-slate-100 text-3xl font-semibold text-slate-400'>
                                    {profileRow.nombres ? profileRow.nombres[0].toUpperCase() : '?'}
                                </div>
                            )}
                        </div>

                        <label className='flex cursor-pointer items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500'>
                            {uploading ? 'Subiendo...' : 'Subir imagen'}
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                disabled={uploading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadAvatar(file);
                                }}
                            />
                        </label>

                        <div className='mt-4 flex justify-between'>
                            <button
                                type='button'
                                onClick={handleDeleteAvatar}
                                className='rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50'
                            >
                                Eliminar foto
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowProfileModal(false)}
                                className='rounded-full border border-slate-200 px-4 py-2 text-sm'
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
