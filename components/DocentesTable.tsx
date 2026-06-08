"use client";

import { useMemo, useState, useCallback, useEffect } from 'react';
import type { Docente } from '@/types';
import { getAvatarUrl, uploadAvatar, deleteAvatar } from '@/actions/files';

const hiddenFields = new Set([
    'etnia',
    'etnia_id',
    'cargo',
    'cargo_id',
    'sexo',
    'sexo_id',
    'created_at',
    'updated_at',
    'createdAt',
    'updatedAt',
]);

type Props = {
    docentes: Docente[];
    onCreate: (formData: FormData) => void | Promise<void>;
    onUpdate: (formData: FormData) => void | Promise<void>;
    onDelete: (id: number) => void | Promise<void>;
};

const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

const getRowId = (row: Docente) => {
    const candidates = ['id', 'docente_id', 'cod_docente', 'codigo', 'cod'];
    for (const key of candidates) {
        const value = row[key];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return Number(value);
        }
    }
    return NaN;
};

const getRowLabel = (row: Docente) => {
    const label = row['nombres'] || row['nombre'] || row['apellidos'] || row['id'];
    return label ? String(label)[0].toUpperCase() : '?';
};

export default function DocentesTable({ docentes, onCreate, onUpdate, onDelete }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Docente | null>(null);
    const [profileRow, setProfileRow] = useState<Docente | null>(null);
    const [createForm, setCreateForm] = useState<Record<string, string>>({});
    const [updateForm, setUpdateForm] = useState<Record<string, string>>({});
    const [avatarKey, setAvatarKey] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [avatarUrls, setAvatarUrls] = useState<Record<number, string | null>>({});
    const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvatars = async () => {
            const urls: Record<number, string | null> = {};
            await Promise.allSettled(
                docentes.map(async (d) => {
                    const id = getRowId(d);
                    if (isNaN(id)) return;
                    const url = await getAvatarUrl(id);
                    urls[id] = url;
                }),
            );
            setAvatarUrls(urls);
        };
        if (docentes.length > 0) fetchAvatars();
    }, [docentes]);

    const columns = useMemo(() => {
        if (docentes.length === 0) return [] as string[];
        const keys = Object.keys(docentes[0]).filter((key) => !hiddenFields.has(key));
        if (keys.includes('id')) {
            return ['id', ...keys.filter((key) => key !== 'id')];
        }
        return keys;
    }, [docentes]);

    const editableColumns = useMemo(() => columns.filter((key) => key !== 'id'), [columns]);

    const handleOpenCreate = () => {
        const initial: Record<string, string> = {};
        editableColumns.forEach((key) => {
            initial[key] = '';
        });
        setCreateForm(initial);
        setShowCreateModal(true);
    };

    const handleOpenUpdate = (row: Docente) => {
        const initial: Record<string, string> = {};
        editableColumns.forEach((key) => {
            initial[key] = row[key] !== undefined && row[key] !== null ? String(row[key]) : '';
        });
        setSelectedRow(row);
        setUpdateForm(initial);
        setShowUpdateModal(true);
    };

    const handleOpenProfile = async (row: Docente) => {
        setProfileRow(row);
        setShowProfileModal(true);
        const id = getRowId(row);
        if (!isNaN(id)) {
            const url = await getAvatarUrl(id);
            setProfileAvatarUrl(url);
        }
    };

    const handleUploadAvatar = useCallback(async (file: File) => {
        if (!profileRow) return;
        setUploading(true);
        const id = getRowId(profileRow);
        if (!isNaN(id)) {
            const url = await uploadAvatar(id, file);
            if (url) setProfileAvatarUrl(url);
            setAvatarKey((k) => k + 1);
        }
        setUploading(false);
    }, [profileRow]);

    const handleDeleteAvatar = useCallback(async () => {
        if (!profileRow) return;
        const id = getRowId(profileRow);
        if (!isNaN(id)) {
            await deleteAvatar(id);
            setProfileAvatarUrl(null);
            setAvatarKey((k) => k + 1);
        }
    }, [profileRow]);

    const handleCreateChange = (key: string, value: string) => {
        setCreateForm({ ...createForm, [key]: value });
    };

    const handleUpdateChange = (key: string, value: string) => {
        setUpdateForm({ ...updateForm, [key]: value });
    };

    return (
        <div className='mx-auto max-w-6xl px-6 py-10'>
            <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Registro academico</p>
                    <h1 className='text-3xl font-semibold text-slate-900'>Docentes</h1>
                    <p className='mt-1 text-sm text-slate-500'>Gestiona altas, edicion y eliminacion de docentes.</p>
                </div>
                <button
                    type='button'
                    onClick={handleOpenCreate}
                    className='rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500'
                >
                    + Crear docente
                </button>
            </div>

            {docentes.length === 0 ? (
                <div className='rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500'>
                    Sin registros de docentes.
                </div>
            ) : (
                <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse text-left text-sm'>
                            <thead className='bg-slate-900 text-white'>
                                <tr>
                                    <th className='w-12 px-2 py-4 text-center font-medium'>AV</th>
                                    {columns.map((column) => (
                                        <th key={column} className='px-5 py-4 font-medium'>
                                            {column === 'id' ? 'COD' : column}
                                        </th>
                                    ))}
                                    <th className='px-5 py-4 text-center font-medium'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100'>
                                {docentes.map((docente, index) => {
                                    const id = getRowId(docente);
                                    const avatarUrl = !isNaN(id) ? avatarUrls[id] : null;
                                    return (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className='px-2 py-4 text-center'>
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt='avatar'
                                                    className='mx-auto h-8 w-8 rounded-full object-cover'
                                                />
                                            ) : (
                                                <div className='mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500'>
                                                    {getRowLabel(docente)}
                                                </div>
                                            )}
                                        </td>
                                        {columns.map((column) => (
                                            <td key={column} className='px-5 py-4 text-slate-600'>
                                                {formatValue(docente[column])}
                                            </td>
                                        ))}
                                        <td className='px-5 py-4 text-center'>
                                            <div className='flex items-center justify-center gap-3'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleOpenProfile(docente)}
                                                    className='rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50'
                                                >
                                                    Perfil
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => handleOpenUpdate(docente)}
                                                    className='rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400'
                                                >
                                                    Actualizar
                                                </button>
                                                <form action={onDelete.bind(null, id)}>
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Crear Docente</h2>
                        <p className='mb-4 text-sm text-slate-500'>Completa los datos para registrar un nuevo docente.</p>
                        <form action={onCreate} className='flex flex-col gap-3'>
                            {editableColumns.map((column) => (
                                <input
                                    key={column}
                                    name={column}
                                    value={createForm[column] ?? ''}
                                    onChange={(event) => handleCreateChange(column, event.target.value)}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    placeholder={column}
                                    required
                                />
                            ))}
                            <div className='mt-4 flex justify-end gap-2'>
                                <button
                                    type='button'
                                    onClick={() => setShowCreateModal(false)}
                                    className='rounded-full border border-slate-200 px-4 py-2 text-sm'
                                >
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

            {showUpdateModal && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Actualizar Docente</h2>
                        <p className='mb-4 text-sm text-slate-500'>Edita los datos del docente seleccionado.</p>
                        <form action={onUpdate} className='flex flex-col gap-3'>
                            <input type='hidden' name='id' value={String(getRowId(selectedRow))} />
                            {editableColumns.map((column) => (
                                <input
                                    key={column}
                                    name={column}
                                    value={updateForm[column] ?? ''}
                                    onChange={(event) => handleUpdateChange(column, event.target.value)}
                                    className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
                                    placeholder={column}
                                    required
                                />
                            ))}
                            <div className='mt-4 flex justify-end gap-2'>
                                <button
                                    type='button'
                                    onClick={() => setShowUpdateModal(false)}
                                    className='rounded-full border border-slate-200 px-4 py-2 text-sm'
                                >
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

            {showProfileModal && profileRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
                    <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl'>
                        <h2 className='text-xl font-semibold text-slate-900'>Perfil</h2>
                        <p className='mb-6 text-sm text-slate-500'>Foto de perfil del docente.</p>

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
                                    {getRowLabel(profileRow)}
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
