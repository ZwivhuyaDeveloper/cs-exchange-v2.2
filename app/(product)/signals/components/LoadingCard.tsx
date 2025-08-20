export function LoadingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-pulse">
          {/* Header */}
          <div className="p-4 flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full" />
              <div>
                <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
              </div>
            </div>
            <div className="w-24 h-8 bg-gray-200 dark:bg-zinc-800 rounded-md" />
          </div>

          {/* Price Section */}
          <div className="px-4 pb-4">
            <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded w-32 mb-1" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
          </div>

          {/* Details Grid */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-12" />
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-14" />
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-12" />
              <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-16" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}