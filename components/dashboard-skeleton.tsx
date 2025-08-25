export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-48 h-8 bg-muted animate-pulse rounded" />
        <div className="w-32 h-4 bg-muted animate-pulse rounded" />
      </div>

      {/* Overview cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-24 h-4 bg-muted animate-pulse rounded" />
              <div className="w-8 h-8 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="w-32 h-8 bg-muted animate-pulse rounded mb-2" />
            <div className="w-20 h-3 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Charts and sidebar skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-48 h-6 bg-muted animate-pulse rounded mb-4" />
            <div className="w-full h-80 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border">
                <div className="w-32 h-6 bg-muted animate-pulse rounded mb-4" />
                <div className="w-full h-64 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border border-border">
              <div className="w-32 h-6 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-muted animate-pulse rounded" />
                        <div className="w-16 h-3 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                    <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
