import { DashboardProvider } from './context/DashboardContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageHeader } from './components/layout/PageHeader';
import { StatsRow } from './components/stats/StatsRow';

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <PageHeader />
        <StatsRow />
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;
