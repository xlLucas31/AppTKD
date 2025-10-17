import { getDB } from '../../db/db';

export type Alumno = { ID_Alumno: number; Nombre: string; ID_Graduacion: number | null; estado: 1 | 0 };

export async function getAlumnos(): Promise<Alumno[]> {
  const db = await getDB();
  return db.getAllAsync<Alumno>(`
    SELECT ID_Alumno, Nombre, ID_Graduacion, estado
    FROM Alumno
    ORDER BY Nombre ASC
  `);
}

export async function addAlumno(nombre: string, idGraduacion: number | null = null): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO Alumno (Nombre, ID_Graduacion) VALUES (?, ?)`,
    [nombre.trim(), idGraduacion]
  );
}