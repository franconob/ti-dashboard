import { DashboardProvider } from './context/DashboardContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageHeader } from './components/layout/PageHeader';
import { StatsRow } from './components/stats/StatsRow';
import { Toolbar } from './components/toolbar/Toolbar';
import { DataTable } from './components/table/DataTable';
import { Pagination } from './components/pagination/Pagination';

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <PageHeader />
        <StatsRow />
        <Toolbar />
        <DataTable />
        <Pagination />
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;
