import DetectionCard from "../components/Detectioncard";
import { mockDetections } from "../data/mockDetections";

export default function DetectionFeed() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Wildlife Detections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockDetections.map(item => (
          <DetectionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
