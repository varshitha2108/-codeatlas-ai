export function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(100, Math.max(0, progress))
  return (
    <div className="h-1.5 w-full bg-hover rounded-full overflow-hidden">
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}