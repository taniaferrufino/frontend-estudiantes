import { createStudentAction, deleteStudentAction, getAllStudents, updateStudentAction } from '@/actions/estudiantes';
import { getAllEtnias } from '@/actions/etnias';
import { getAllSexos } from '@/actions/sexos';
import EstudiantesTable from '@/components/EstudiantesTable';

export default async function ObtenerEstdiante() {
    const estudiantes = await getAllStudents();
    const [sexos, etnias] = await Promise.all([getAllSexos(), getAllEtnias()]);

    return (
        <EstudiantesTable
            estudiantes={estudiantes}
            onDelete={deleteStudentAction}
            onUpdate={updateStudentAction}
            onCreate={createStudentAction}
            sexos={sexos}
            etnias={etnias}
        />
    );
}