// features/alumnos/useAlumnos.ts
import { useEffect, useState, useCallback } from 'react';
import { getAlumnos, type Alumno } from './alumno.repo';

export function useAlumnos() {
  const [data, setData] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await getAlumnos()); }
    catch (e) { setError(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}
