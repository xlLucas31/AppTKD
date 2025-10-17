import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) db = await openDatabaseAsync('app.db');
  return db;
}
// INSERT INTO Alumno (Nombre, ID_Graduacion, Estado) VALUES ('Lucas Pérez', 3, 1);
export async function init() {
  const database = await getDB();
  await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS Alumno (
      ID_Alumno INTEGER PRIMARY KEY AUTOINCREMENT,
      Nombre TEXT NOT NULL,
      ID_Graduacion INTEGER,
      Estado INTEGER NOT NULL DEFAULT 1 CHECK (Estado IN (0,1))
    );

    CREATE TABLE IF NOT EXISTS Turno (
      ID_Turno INTEGER PRIMARY KEY AUTOINCREMENT,
      Nombre TEXT NOT NULL,
      Descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS AlumnoXTurno (
      ID_Alumno INTEGER NOT NULL,
      ID_Turno INTEGER NOT NULL,
      Fecha TEXT NOT NULL,
      Estado INTEGER NOT NULL DEFAULT 1 CHECK (Estado IN (0,1)),
      PRIMARY KEY (ID_Alumno, ID_Turno),
      FOREIGN KEY (ID_Alumno) REFERENCES Alumno(ID_Alumno) ON DELETE CASCADE,
      FOREIGN KEY (ID_Turno)  REFERENCES Turno(ID_Turno)  ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Clase (
      ID_Clase INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Turno INTEGER NOT NULL,
      Fecha TEXT NOT NULL DEFAULT (date('now')),
      Descripcion TEXT,
      FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS AlumnoXClase (
      ID_Alumno INTEGER NOT NULL,
      ID_Clase INTEGER NOT NULL,
      ID_Turno INTEGER NOT NULL,
      Asistio  INTEGER NOT NULL DEFAULT 0 CHECK (Asistio IN (0,1)),
      PRIMARY KEY (ID_Alumno, ID_Clase),
      FOREIGN KEY (ID_Alumno) REFERENCES Alumno(ID_Alumno) ON DELETE CASCADE,
      FOREIGN KEY (ID_Clase)  REFERENCES Clase(ID_Clase)  ON DELETE CASCADE,
      FOREIGN KEY (ID_Turno)  REFERENCES Turno(ID_Turno)  ON DELETE CASCADE
    );
  `);
}