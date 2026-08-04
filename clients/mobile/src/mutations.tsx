import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface MutationContextValue {
  busy: boolean;
  runMutation: <T>(operation: () => Promise<T>) => Promise<T>;
}

const MutationContext = createContext<MutationContextValue | null>(null);

export function MutationProvider({ children }: PropsWithChildren) {
  const [activeMutations, setActiveMutations] = useState(0);

  const runMutation = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T> => {
      setActiveMutations(value => value + 1);

      try {
        return await operation();
      } finally {
        setActiveMutations(value => value - 1);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ busy: activeMutations > 0, runMutation }),
    [activeMutations, runMutation],
  );

  return (
    <MutationContext.Provider value={value}>
      {children}
    </MutationContext.Provider>
  );
}

export function useMutationTracker(): MutationContextValue {
  const context = useContext(MutationContext);

  if (!context) {
    throw new Error('useMutationTracker must be used inside MutationProvider.');
  }

  return context;
}
