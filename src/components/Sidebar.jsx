import {
  Squares2X2Icon,
  VideoCameraIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { label: 'Dashboard', icon: Squares2X2Icon, active: true },
  { label: 'Live Feed', icon: VideoCameraIcon },
  { label: 'Detection Log', icon: ClockIcon },
  { label: 'Summaries', icon: ChartBarIcon },
  { label: 'Settings', icon: Cog6ToothIcon },
]

const Sidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-surface/60 backdrop-blur xl:flex">
      <div className="flex h-[calc(100vh-72px)] w-full flex-col gap-2 px-5 py-8 sticky top-24">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-white/5 text-white shadow-lg shadow-slate-900/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
            {active && (
              <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-[0_0_12px] shadow-accent/60"></span>
            )}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar

