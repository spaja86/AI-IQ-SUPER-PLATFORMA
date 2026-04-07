export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-300" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-sm font-medium text-gray-400">Učitavanje...</p>
        <p className="mt-1 text-xs text-gray-600">Dimenzije • AI IQ SUPER PLATFORMA</p>
      </div>
    </div>
  );
}
