import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as repo from './turno.repo';

export function useTurnos() {
  const [turnos, setTurnos] = useState<repo.Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const didFocusOnceRef = useRef(false);

  // Carga inicial
  useEffect(() => {
    (async () => {
      const data = await repo.getTurnos();
      setTurnos(data);
      setLoading(false);
    })();
  }, []);

  // Actualiza al volver a enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (!didFocusOnceRef.current) {
        didFocusOnceRef.current = true;
        return;
      }
      let cancel = false;
      (async () => {
        const data = await repo.getTurnos();
        if (!cancel) setTurnos(data);
      })();
      return () => { cancel = true; };
    }, [])
  );

  const add = useCallback(async (nombre: string) => {
    if (!nombre.trim()) return;
    const nuevo = await repo.addTurno(nombre.trim());
    setTurnos(prev => [nuevo, ...prev]);
  }, []);

  return { turnos, loading, add };
}
