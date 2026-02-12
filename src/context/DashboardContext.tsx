import { createContext, useReducer, type ReactNode, type Dispatch } from 'react';
import {
  dashboardReducer,
  initialState,
  type DashboardState,
  type DashboardAction,
} from './dashboardReducer';

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardStateContext = createContext<DashboardState>(initialState);
// eslint-disable-next-line react-refresh/only-export-components
export const DashboardDispatchContext = createContext<Dispatch<DashboardAction>>(() => {
  /* noop default */
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  );
}
