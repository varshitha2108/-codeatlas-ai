export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-accent-subtle-bg text-accent flex items-center justify-center text-xs font-medium"
    >
      {initials}
    </div>
  )
}