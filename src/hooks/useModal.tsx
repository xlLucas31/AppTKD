import { useCallback, useState } from 'react';

export function useModal(initial = false) {
  const [visible, setVisible] = useState<boolean>(initial);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  //const toggle = useCallback(() => setVisible(v => !v), []);
  return { visible, open, close };
}

