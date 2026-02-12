import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReducer, type ReactNode } from 'react';
import { DashboardStateContext, DashboardDispatchContext } from '../../context/DashboardContext';
import { dashboardReducer, initialState, type DashboardState } from '../../context/dashboardReducer';
import { Pagination } from '../pagination/Pagination';

function Wrapper({ stateOverrides, children }: { stateOverrides: Partial<DashboardState>; children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, { ...initialState, ...stateOverrides });
  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <Wrapper stateOverrides={{ totalPages: 1, total: 10 }}>
        <Pagination />
      </Wrapper>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page info and controls', () => {
    render(
      <Wrapper stateOverrides={{ page: 1, totalPages: 5, total: 100 }}>
        <Pagination />
      </Wrapper>,
    );
    expect(screen.getByText(/Showing 1-20 of 100/)).toBeInTheDocument();
  });

  it('renders correct page numbers', () => {
    render(
      <Wrapper stateOverrides={{ page: 1, totalPages: 5, total: 100 }}>
        <Pagination />
      </Wrapper>,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Wrapper stateOverrides={{ page: 1, totalPages: 5, total: 100 }}>
        <Pagination />
      </Wrapper>,
    );
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Wrapper stateOverrides={{ page: 5, totalPages: 5, total: 100 }}>
        <Pagination />
      </Wrapper>,
    );
    const nextBtn = screen.getByLabelText('Next page');
    expect(nextBtn).toBeDisabled();
  });

  it('navigates to clicked page', async () => {
    render(
      <Wrapper stateOverrides={{ page: 1, totalPages: 5, total: 100 }}>
        <Pagination />
      </Wrapper>,
    );
    await userEvent.click(screen.getByText('3'));
    // After clicking page 3, the info should update
    expect(screen.getByText(/Showing 41-60 of 100/)).toBeInTheDocument();
  });
});
