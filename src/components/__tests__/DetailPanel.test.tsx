import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReducer, type ReactNode } from 'react';
import { DashboardStateContext, DashboardDispatchContext } from '../../context/DashboardContext';
import { dashboardReducer, initialState, type DashboardState } from '../../context/dashboardReducer';
import { DetailPanel } from '../detail/DetailPanel';

const mockIndicator = {
  id: 'test-1',
  value: '185.220.101.34',
  type: 'ip' as const,
  severity: 'critical' as const,
  source: 'AbuseIPDB',
  firstSeen: '2025-11-08T14:22:00.000Z',
  lastSeen: '2026-02-03T19:45:00.000Z',
  tags: ['tor-exit', 'botnet'],
  confidence: 94,
};

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
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockIndicator),
  }));
});

describe('DetailPanel', () => {
  it('is hidden when no indicator selected', () => {
    render(
      <Wrapper stateOverrides={{}}>
        <DetailPanel />
      </Wrapper>,
    );
    const panel = screen.getByRole('dialog', { hidden: true });
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows indicator details when selected', async () => {
    render(
      <Wrapper stateOverrides={{ selectedId: 'test-1', selectedIndicator: mockIndicator }}>
        <DetailPanel />
      </Wrapper>,
    );
    expect(screen.getByText('185.220.101.34')).toBeInTheDocument();
    expect(screen.getByText('critical')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('tor-exit')).toBeInTheDocument();
    expect(screen.getByText('AbuseIPDB')).toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    render(
      <Wrapper stateOverrides={{ selectedId: 'test-1', selectedIndicator: mockIndicator }}>
        <DetailPanel />
      </Wrapper>,
    );
    await userEvent.click(screen.getByLabelText('Close panel'));
    const panel = screen.getByRole('dialog', { hidden: true });
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes on Escape key', async () => {
    render(
      <Wrapper stateOverrides={{ selectedId: 'test-1', selectedIndicator: mockIndicator }}>
        <DetailPanel />
      </Wrapper>,
    );
    await userEvent.keyboard('{Escape}');
    const panel = screen.getByRole('dialog', { hidden: true });
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders action buttons', () => {
    render(
      <Wrapper stateOverrides={{ selectedId: 'test-1', selectedIndicator: mockIndicator }}>
        <DetailPanel />
      </Wrapper>,
    );
    expect(screen.getByText('Investigate')).toBeInTheDocument();
    expect(screen.getByText('Block')).toBeInTheDocument();
  });
});
