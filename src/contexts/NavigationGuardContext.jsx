import { createContext, useContext, useRef, useCallback } from 'react';

const NavigationGuardContext = createContext();

export function NavigationGuardProvider({ children }) {
  const guardRef = useRef(null);

  const setGuard = useCallback((fn) => {
    guardRef.current = fn;
  }, []);

  const clearGuard = useCallback(() => {
    guardRef.current = null;
  }, []);

  const canNavigate = useCallback(() => {
    if (guardRef.current) return guardRef.current();
    return true;
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ setGuard, clearGuard, canNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}
