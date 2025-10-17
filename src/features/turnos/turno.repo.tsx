import { getDB } from '../../db/db';

export type Turno = { id: number; nombre: string; descripcion?: string | null };

export async function getTurnos(): Promise<Turno[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Turno>(`
    SELECT ID_Turno AS id, Nombre AS nombre, Descripcion AS descripcion
    FROM Turno
    ORDER BY id ASC
  `);
  return rows;
}

export async function addTurno(nombre: string, descripcion?: string | null) {
  const db = await getDB();
  const res = await db.runAsync(
    `INSERT INTO Turno (Nombre, Descripcion) VALUES (?, ?)`,
    [nombre, descripcion ?? null]
  );
  return { id: res.lastInsertRowId as number, nombre, descripcion: descripcion ?? null } as Turno;
}

export async function deleteTurno(turnoId: number) {
  const db = await getDB();
  await db.runAsync(`DELETE FROM Turno WHERE ID_Turno = ?`, [turnoId]);
}

