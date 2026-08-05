import { useEffect, useState } from 'react';
import type { StatusNoticeValue } from '@/components';

function createSuccessNotice(text?: string): StatusNoticeValue | null {
  return text ? { kind: 'success', text } : null;
}

export function useInitialNotice(initialNotice?: string) {
  const [notice, setNotice] = useState<StatusNoticeValue | null>(() =>
    createSuccessNotice(initialNotice),
  );

  useEffect(() => {
    setNotice(createSuccessNotice(initialNotice));
  }, [initialNotice]);

  return { notice, setNotice };
}
