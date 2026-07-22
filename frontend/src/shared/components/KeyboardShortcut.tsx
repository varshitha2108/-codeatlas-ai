export function KeyboardShortcut({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="px-1.5 py-0.5 rounded-sm bg-hover border border-default text-xs font-mono text-secondary"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}