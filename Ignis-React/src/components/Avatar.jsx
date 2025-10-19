export function Avatar({ name }) {
  const initials = name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  )
}

export function AvatarStack({ names = [] }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0,4).map((n, i) => (
        <div key={i} className="ring-2 ring-white dark:ring-zinc-900 rounded-full">
          <Avatar name={n} />
        </div>
      ))}
      {names.length > 4 && (
        <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center text-xs ring-2 ring-white dark:ring-zinc-900">+{names.length-4}</div>
      )}
    </div>
  )
}
