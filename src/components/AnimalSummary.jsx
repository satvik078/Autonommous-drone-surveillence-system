const AnimalSummary = ({ animals = [] }) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-surface-raised/60 p-5 shadow-lg shadow-black/20 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Simple Analytics</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Detection Totals</h2>
      <div className="mt-4 space-y-3">
        {animals.length === 0 && (
          <p className="text-sm text-slate-500">No detections yet. Feed will populate automatically.</p>
        )}
        {animals.map((animal) => (
          <div
            key={animal.name}
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
          >
            <span className="text-sm font-medium text-white">{animal.name}</span>
            <span className="text-sm text-slate-300">{animal.count} detections</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AnimalSummary

