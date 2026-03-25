export default function ITProizvodiLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="status" aria-label="Učitavanje IT proizvoda">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-700/50 rounded-lg w-48 mb-4" />
        <div className="h-4 bg-gray-700/50 rounded w-80 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700/30 rounded-xl border border-gray-700/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-700/30 rounded-xl border border-gray-700/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
