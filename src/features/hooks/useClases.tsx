import { useEffect, useState, useCallback } from 'react';
import { getClasesByTurno, type Clase } from './clases/clase.repo';

export function useClases(turnoId: number){
    const [data, setData] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await getClasesByTurno(turnoId)); }
    catch (e) { setError(e); }
    finally { setLoading(false); }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    return { data, loading, error, refresh };

}