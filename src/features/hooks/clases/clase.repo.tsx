import { getDB } from '../../../db/db';

export type Clase = {
  id: number;
  turnoId: number;
  label: string;
  fecha: string;
};

export async function getClasesByTurno(turnoId: number): Promise<Clase[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<Clase>(`
    SELECT
      ID_Clase AS id,
      ID_Turno AS turnoId,
      COALESCE(Descripcion, '') AS label,
      Fecha AS fecha
    FROM Clase
    WHERE ID_Turno = ?
    ORDER BY date(Fecha) DESC, id DESC
  `, [turnoId]);
  return rows;
}

/** Crea una clase en un turno. Si no pasás fecha, usa date('now') */
export async function addClase(turnoId: number, label: string, fecha?: string) {
  const db = await getDB();
  const sql = fecha
    ? `INSERT INTO Clase (ID_Turno, Descripcion, Fecha) VALUES (?, ?, ?)`
    : `INSERT INTO Clase (ID_Turno, Descripcion) VALUES (?, ?)`; // usa default de Fecha
  const params = fecha ? [turnoId, label, fecha] : [turnoId, label];

  const res = await db.runAsync(sql, params);
  console.log('Clase creada con ID:', res.lastInsertRowId);
  return {
    id: res.lastInsertRowId as number,
    turnoId,
    label,
    fecha: fecha ?? new Date().toISOString().slice(0, 10),
  } as Clase;
}

/** Borra una clase asegurando que pertenece a ese turno */
export async function deleteClase(turnoId: number, claseId: number) {
  const db = await getDB();
  await db.runAsync(
    `DELETE FROM Clase WHERE ID_Clase = ? AND ID_Turno = ?`,
    [claseId, turnoId]
  );
}