const DetectionCard = ({ detection, onSelect }) => {
  const { primaryAnimal, primaryConfidence, sensor_id, timestampLabel, image_url } = detection

  return (
    <button
      type="button"
      onClick={() => onSelect(detection)}
      className="group flex h-full flex-col rounded-3xl border border-white/5 bg-surface-raised/60 text-left shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-accent/20"
    >
      <div className="relative h-52 overflow-hidden rounded-3xl rounded-b-none">
        <img
          src={image_url}
          alt={primaryAnimal}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
          {sensor_id}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Primary Detection</p>
        <h3 className="text-xl font-semibold text-white">{primaryAnimal}</h3>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Confidence</span>
          <span className="font-semibold text-white">{primaryConfidence ?? '—'}%</span>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-slate-400">
          <span>Timestamp</span>
          <span className="font-medium text-white">{timestampLabel}</span>
        </div>
      </div>
    </button>
  )
}

export default DetectionCard

