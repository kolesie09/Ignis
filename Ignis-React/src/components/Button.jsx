export const Button = ({ children, icon: Icon, variant = 'ghost', className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition border'
  const variants = {
    primary: 'bg-zinc-900 text-white border-zinc-900 hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 border-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:border-zinc-800',
    outline: 'bg-transparent text-zinc-900 border-zinc-300 hover:bg-zinc-100 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="h-4 w-4" />} {children}
    </button>
  )
}
