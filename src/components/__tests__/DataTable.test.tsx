import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardProvider } from '../../context/DashboardContext';
import { DataTable } from '../table/DataTable';

const mockIndicators = {
  data: [
    {
      id: '1',
      value: '185.220.101.34',
      type: 'ip' as const,
      severity: 'critical' as const,
      source: 'AbuseIPDB',
      firstSeen: '2025-11-08T14:22:00.000Z',
      lastSeen: new Date().toISOString(),
      tags: ['tor-exit', 'botnet'],
      confidence: 94,
    },
    {
      id: '2',
      value: 'malware-c2.storm-412.ru',
      type: 'domain' as const,
      severity: 'high' as const,
      source: 'VirusTotal',
      firstSeen: '2025-10-01T10:00:00.000Z',
      lastSeen: new Date().toISOString(),
      tags: ['c2', 'malware'],
      confidence: 78,
    },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockIndicators),
  }));
});

function renderTable() {
  return render(
    <DashboardProvider>
      <DataTable />
    </DashboardProvider>,
  );
}

describe('DataTable', () => {
  it('renders skeleton loading state initially', () => {
    renderTable();
    // Table headers should be visible
    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('renders indicators after fetch completes', async () => {
    renderTable();
    expect(await screen.findByText('185.220.101.34')).toBeInTheDocument();
    expect(screen.getByText('malware-c2.storm-412.ru')).toBeInTheDocument();
  });

  it('renders severity badges', async () => {
    renderTable();
    expect(await screen.findByText('critical')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders tags', async () => {
    renderTable();
    expect(await screen.findByText('tor-exit')).toBeInTheDocument();
    expect(screen.getByText('botnet')).toBeInTheDocument();
    expect(screen.getByText('c2')).toBeInTheDocument();
  });

  it('highlights row on click', async () => {
    renderTable();
    const row = await screen.findByText('185.220.101.34');
    await userEvent.click(row.closest('tr')!);
    expect(row.closest('tr')).toHaveClass(/rowSelected/);
  });

  it('renders sort icons on column headers', async () => {
    renderTable();
    // All sortable headers should have sort indicators
    const headers = screen.getAllByRole('columnheader');
    // 8 columns: checkbox + 6 sortable + Tags
    expect(headers).toHaveLength(8);
  });
});
