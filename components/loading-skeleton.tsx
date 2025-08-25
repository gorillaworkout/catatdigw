export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
            <div className="w-32 h-6 bg-muted animate-pulse rounded" />
          </div>
          <div className="w-40 h-9 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-48 h-8 bg-muted animate-pulse rounded mx-auto mb-8" />
          <div className="w-full max-w-4xl h-16 bg-muted animate-pulse rounded mx-auto mb-6" />
          <div className="w-full max-w-2xl h-6 bg-muted animate-pulse rounded mx-auto mb-8" />
          <div className="flex justify-center space-x-4 mb-12">
            <div className="w-48 h-12 bg-muted animate-pulse rounded" />
            <div className="w-32 h-12 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Features skeleton */}
      <div className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg">
                <div className="w-12 h-12 bg-muted animate-pulse rounded-lg mb-4" />
                <div className="w-32 h-6 bg-muted animate-pulse rounded mb-2" />
                <div className="w-full h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
