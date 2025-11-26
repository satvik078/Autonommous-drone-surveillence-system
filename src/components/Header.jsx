const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Mission Control</p>
          <h1 className="text-2xl font-semibold text-white">
            Wildlife Drone Surveillance Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
          </span>
          <span className="text-sm font-medium text-emerald-100">Live Status · Online</span>
        </div>
      </div>
    </header>
  )
}

export default Header

