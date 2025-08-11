export function LoadingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <div className="w-16 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            
            <div className="flex justify-between mb-5">
              <div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 mb-1" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
              </div>
              <div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              </div>
              <div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14 mb-1" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}