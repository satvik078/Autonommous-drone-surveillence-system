export default function DetectionCard({ item }) {
  return (
    <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
  <img
    src={item.image_url}
    className="w-full h-64 object-cover"
  />

  <div className="p-4">
    <h2 className="text-2xl font-bold text-teal-400">{item.class}</h2>

    <p className="text-sm text-gray-400 mt-2">Sensor: {item.sensor_id}</p>
    <p className="text-sm text-gray-400">Confidence: {(item.confidence * 100).toFixed(1)}%</p>

    <p className="text-xs text-gray-500 mt-3">{item.timestamp}</p>
  </div>
</div>

  );
}
