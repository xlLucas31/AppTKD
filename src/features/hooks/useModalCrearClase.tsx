import { useCallback, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { addClase } from './clases/clase.repo';

export function useModalCrearClase() {
  const { visible, open, close } = useModal();

  const onSubmit = useCallback((turnoId: number, name: string, date: Date) => {
    addClase(turnoId, name, date.toISOString().slice(0, 10));
    close();
  }, []);

  return { visible, open, close, onSubmit };
}
