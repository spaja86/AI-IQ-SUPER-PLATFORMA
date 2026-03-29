export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl animate-pulse">⏳</div>
        <p className="text-gray-400">Učitavanje...</p>
      </div>
    </div>
  );
}
