const DetectionModal = ({ detection, onClose }) => {
  if (!detection) return null

  const {
    primaryAnimal,
    sensor_id,
    timestampLabel,
    annotatedImage,
    image_url,
    detections = [],
  } = detection

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/10 bg-surface-raised/95 shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200 hover:text-white"
        >
          Close
        </button>
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-black/40 p-3">
            <img
              src={annotatedImage || image_url}
              alt={primaryAnimal}
              className="h-full w-full rounded-2xl object-cover"
            />
            <p className="mt-3 text-xs text-slate-400">
              Annotated feed · Click anywhere outside to close
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Frame Details</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{primaryAnimal}</h3>
              <p className="text-sm text-slate-400">Sensor {sensor_id}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
              <p className="flex items-center justify-between">
                <span>Timestamp</span>
                <span className="font-semibold text-white">{timestampLabel}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Detections</p>
              <div className="mt-3 space-y-3">
                {detections.map((item, index) => (
                  <div
                    key={`${item.class}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-surface p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.class || 'Unknown'}</p>
                      {item.crop && (
                        <p className="text-xs text-slate-500">Crop: {item.crop.split('/').pop()}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-accent">
                      {Math.round((item.confidence || 0) * 100)}%
                    </span>
                  </div>
                ))}
                {detections.length === 0 && (
                  <p className="text-sm text-slate-500">No detections reported for this frame.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="absolute inset-0" onClick={onClose} />
    </div>
  )
}

export default DetectionModal

