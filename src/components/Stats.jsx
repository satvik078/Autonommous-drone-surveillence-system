const StatCard = ({ label, value, caption, loading }) => (
  <div className="rounded-3xl border border-white/5 bg-surface-raised/60 p-5 shadow-lg shadow-black/20 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">
      {loading ? <span className="animate-pulse text-slate-500">—</span> : value ?? '—'}
    </p>
    <p className="mt-1 text-sm text-slate-400">{caption}</p>
  </div>
)

const Stats = ({ stats, loading }) => {
  const statItems = [
    {
      label: 'Total Detections',
      value: stats?.totalDetections || 0,
      caption: 'All live sensors',
    },
    {
      label: 'Most Seen Animal',
      value: stats?.mostSeenAnimal || '—',
      caption: 'Rolling window',
    },
    {
      label: 'Sensors Reporting',
      value: stats?.sensorsReporting || 0,
      caption: 'Active links',
    },
    {
      label: 'Last Detection',
      value: stats?.lastDetection || '—',
      caption: 'Local time',
    },
  ]

  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>
    </section>
  )
}

export default Stats

