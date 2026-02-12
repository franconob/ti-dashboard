import { DashboardProvider } from './context/DashboardContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageHeader } from './components/layout/PageHeader';
import { StatsRow } from './components/stats/StatsRow';
import { DataTable } from './components/table/DataTable';

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <PageHeader />
        <StatsRow />
        <DataTable />
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;
