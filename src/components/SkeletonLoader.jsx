const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const CardSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'stats':
        return <StatsSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
