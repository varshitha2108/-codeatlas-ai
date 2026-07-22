export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-hover rounded-md ${className}`} />
}