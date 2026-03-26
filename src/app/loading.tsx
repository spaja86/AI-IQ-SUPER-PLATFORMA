export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-[#7c3aed]" />
      <p className="mt-4 text-sm text-zinc-400">Učitavanje...</p>
    </div>
  );
}
