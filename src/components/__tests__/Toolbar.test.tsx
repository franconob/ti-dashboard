import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardProvider } from '../../context/DashboardContext';
import { Toolbar } from '../toolbar/Toolbar';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 }),
  }));
});

function renderToolbar() {
  return render(
    <DashboardProvider>
      <Toolbar />
    </DashboardProvider>,
  );
}

describe('Toolbar', () => {
  it('renders search input', () => {
    renderToolbar();
    expect(screen.getByPlaceholderText('Search indicators...')).toBeInTheDocument();
  });

  it('renders filter dropdowns', () => {
    renderToolbar();
    expect(screen.getByDisplayValue('All Severities')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Sources')).toBeInTheDocument();
  });

  it('does not show clear filters button initially', () => {
    renderToolbar();
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('shows clear filters when a filter is active', async () => {
    renderToolbar();
    const severitySelect = screen.getByDisplayValue('All Severities');
    await userEvent.selectOptions(severitySelect, 'critical');
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('clears filters when clear button clicked', async () => {
    renderToolbar();
    const severitySelect = screen.getByDisplayValue('All Severities');
    await userEvent.selectOptions(severitySelect, 'critical');
    await userEvent.click(screen.getByText('Clear filters'));
    expect(screen.getByDisplayValue('All Severities')).toBeInTheDocument();
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });
});
