import DashboardLayout from '../layout/DashboardLayout';
import { DashboardProps } from '../../types/dashboard';
import { Head } from '@inertiajs/react';

function Dashboard({ user, categories, dashboard_stats, url_params }: DashboardProps) {
  return (
    <>
      <Head title="QLearn.ai" />
      <DashboardLayout 
        user={user}
        categories={categories}
        dashboard_stats={dashboard_stats}
        url_params={url_params || undefined}
      />
    </>
  );
}

export default Dashboard;