import { useContext } from 'react';
import { DashboardStateContext, DashboardDispatchContext } from '../context/DashboardContext';

export function useDashboardState() {
  return useContext(DashboardStateContext);
}

export function useDashboardDispatch() {
  return useContext(DashboardDispatchContext);
}
