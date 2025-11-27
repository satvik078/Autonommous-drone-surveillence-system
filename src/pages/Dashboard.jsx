import { useCallback, useEffect, useMemo, useState } from 'react'
import Stats from '../components/Stats'
import DetectionCard from '../components/DetectionCard'
import DetectionModal from '../components/DetectionModal'
import AnimalSummary from '../components/AnimalSummary'
import { fetchDetections } from '../api'

const formatTimestamp = (raw) => {
  if (!raw) return { readable: 'Unknown', date: null }

  const sanitized = raw.trim()
  const isoCandidate = sanitized.includes('-')
    ? sanitized.replace('_', 'T')
    : (() => {
        const [datePart, timePart = '000000'] = sanitized.split('_')
        if (!datePart || datePart.length !== 8) return sanitized
        const yyyy = datePart.slice(0, 4)
        const mm = datePart.slice(4, 6)
        const dd = datePart.slice(6, 8)
        const hh = timePart.slice(0, 2) || '00'
        const min = timePart.slice(2, 4) || '00'
        const ss = timePart.slice(4, 6) || '00'
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`
      })()

  const date = new Date(isoCandidate)
  if (Number.isNaN(date.getTime())) return { readable: 'Unknown', date: null }

  const readable = date.toLocaleString('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return { readable, date }
}

const enhanceDetections = (items = []) =>
  items.map((item) => {
    const primaryDetection = item?.detections?.[0] ?? {}
    const formattedTimestamp = formatTimestamp(item.timestamp)

    return {
      ...item,
      primaryAnimal: primaryDetection.class || 'Unknown',
      primaryConfidence:
        typeof primaryDetection.confidence === 'number'
          ? Math.round(primaryDetection.confidence * 100)
          : null,
      timestampLabel: formattedTimestamp.readable,
      timestampDate: formattedTimestamp.date,
      annotatedImage: primaryDetection.crop || item.crop || item.image_url,
    }
  })

const deriveStats = (items = []) => {
  const sensors = new Set()
  const animalCounter = {}
  let latestDate = null

  items.forEach((item) => {
    if (item.sensor_id) sensors.add(item.sensor_id)
    if (item.primaryAnimal) {
      animalCounter[item.primaryAnimal] = (animalCounter[item.primaryAnimal] || 0) + 1
    }
    if (item.timestampDate && (!latestDate || item.timestampDate > latestDate)) {
      latestDate = item.timestampDate
    }
  })

  const sortedAnimals = Object.entries(animalCounter)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    totalDetections: items.length,
    mostSeenAnimal: sortedAnimals[0]?.name || '—',
    sensorsReporting: sensors.size,
    lastDetection: latestDate
      ? latestDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '—',
    animalSummary: sortedAnimals,
  }
}

const Dashboard = () => {
  const [detections, setDetections] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedDetection, setSelectedDetection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const pollDetections = useCallback(async () => {
    try {
      const payload = await fetchDetections()
      const hydrated = enhanceDetections(payload || [])
      setDetections(hydrated)
      setStats(deriveStats(hydrated))
      setError('')
    } catch (err) {
      setError('Unable to reach detection service. Retrying...')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    pollDetections()
    const interval = setInterval(() => pollDetections(), 2000)
    return () => clearInterval(interval)
  }, [pollDetections])

  const animalSummary = useMemo(() => stats?.animalSummary || [], [stats])

  return (
    <div className="space-y-8">
      <Stats stats={stats} loading={loading} />
      <AnimalSummary animals={animalSummary} />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live Intelligence</p>
            <h2 className="text-2xl font-semibold text-white">Detection Feed</h2>
          </div>
          <p className="text-sm text-slate-400">
            Updating automatically every{' '}
            <span className="font-semibold text-white">2 seconds</span>
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {detections.map((detection) => (
            <DetectionCard
              key={`${detection.sensor_id}-${detection.timestamp}`}
              detection={detection}
              onSelect={setSelectedDetection}
            />
          ))}
        </div>

        {!loading && detections.length === 0 && (
          <p className="text-sm text-slate-500">Awaiting telemetry from field units...</p>
        )}
      </section>

      <DetectionModal detection={selectedDetection} onClose={() => setSelectedDetection(null)} />
    </div>
  )
}

export default Dashboard

