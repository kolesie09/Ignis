export const Card = ({ className = "", children }) => (
  <div
    className={`self-start rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, right }) => (
  <div className="grid grid-cols-[1fr_auto_1fr] items-center  mb-5 border-b border-zinc-200 dark:border-zinc-800">
    <div />

    <div className="text-center">
      <h5 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg leading-tight mb-5">
        {title}
      </h5>
      {subtitle && (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-snug mt-0.5">
          {subtitle}
        </p>
      )}
    </div>

    {right ? <div className="justify-self-end">{right}</div> : <div />}
  </div>
);

export const CardBody = ({ className = "", children }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);
