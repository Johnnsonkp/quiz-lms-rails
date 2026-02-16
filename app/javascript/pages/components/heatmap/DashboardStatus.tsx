interface DashboardStatsProps {
  user: {
    id: number;
    email: string;
    name?: string | undefined;
} | null | undefined

  loading: boolean;
  error: string | null;
}

function DashboardStatus({user, loading, error}: DashboardStatsProps) {
  if (!user) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-gray-600">
            Please log in to view your study activity.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-gray-600">Loading your activity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default DashboardStatus