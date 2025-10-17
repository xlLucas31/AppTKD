import { useCallback } from 'react';
import * as repo from '../turnos/turno.repo';

export function useTurnosDetalle(id: number) {
  const eliminar = useCallback(async () => {
    await repo.deleteTurno(id);
  }, [id]);

  return { eliminar /*, data, loading, error */ };
}
