import { createDocenteAction, deleteDocenteAction, getAllDocentes, updateDocenteAction } from '@/actions/docentes';
import DocentesTable from '@/components/DocentesTable';

export default async function DocentesPage() {
    const docentes = await getAllDocentes();

    return (
        <DocentesTable
            docentes={docentes}
            onCreate={createDocenteAction}
            onUpdate={updateDocenteAction}
            onDelete={deleteDocenteAction}
        />
    );
}
