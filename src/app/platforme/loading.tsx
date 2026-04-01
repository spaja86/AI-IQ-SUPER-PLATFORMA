export default function PlatformeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="status" aria-label="Učitavanje platformi">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-700/50 rounded-lg w-48 mb-4" />
        <div className="h-4 bg-gray-700/50 rounded w-80 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-700/30 rounded-xl border border-gray-700/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
