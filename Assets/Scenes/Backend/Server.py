from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import numpy as np
import cv2
from datetime import datetime
import os
from PIL import Image, ImageDraw, ImageFont
import io

app = FastAPI()

# -------------------------
# GLOBAL CORS FIX (FOR NGROK + VERCEL)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (vercel + ngrok)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response

# Handle preflight OPTIONS requests (critical for Vercel → Ngrok)
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    response = JSONResponse({"status": "OK"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response



# -------------------------
#   IMAGE STORAGE FOLDER
# -------------------------
SAVE_DIR = "saved_images"
os.makedirs(SAVE_DIR, exist_ok=True)

app.mount("/images", StaticFiles(directory=SAVE_DIR), name="images")

# -------------------------
# LOAD YOLO
# -------------------------
model = YOLO("yolov8x.pt")

# Store detections in RAM
detections_log = []


# ----------------------------------------------------------
# Helper — Save annotated image + crops
# ----------------------------------------------------------
def save_annotated_and_crops(img_pil, results, base_name, BASE_URL):
    annotated = img_pil.copy()
    draw = ImageDraw.Draw(annotated)

    try:
        font = ImageFont.truetype("arial.ttf", 18)
    except:
        font = ImageFont.load_default()

    crops_info = []

    for i, box in enumerate(results.boxes):
        conf = float(box.conf[0])
        if conf < 0.65:
            continue  # only confident detections

        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        cls = int(box.cls[0])
        name = results.names[cls]

        # Draw bounding boxes + labels
        draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
        draw.text((x1, y1 - 25), f"{name} {conf:.2f}", fill="yellow", font=font)

        # Save crop
        crop = img_pil.crop((x1, y1, x2, y2))
        crop_filename = f"{base_name}_crop_{i}_{name}.jpg"
        crop.save(os.path.join(SAVE_DIR, crop_filename))

        crops_info.append({
            "class": name,
            "confidence": round(conf, 2),
            "crop_url": f"{BASE_URL}/images/{crop_filename}",
            "box": [x1, y1, x2, y2],
        })

    # Save annotated full image
    ann_filename = f"{base_name}_annotated.jpg"
    annotated.save(os.path.join(SAVE_DIR, ann_filename))

    return ann_filename, crops_info


# ======================================================
# UNITY SENDS IMAGE HERE
# ======================================================
@app.post("/analyze")
async def analyze(
    request: Request,
    file: UploadFile = File(...),
    sensor_id: str = Form(...)
):

    BASE_URL = str(request.base_url).rstrip("/")

    # Read image bytes
    img_bytes = await file.read()
    np_img = np.frombuffer(img_bytes, np.uint8)
    cv_img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    try:
        img_pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except:
        return {"error": "Invalid image data"}

    # Timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    base_name = f"{sensor_id}_{timestamp}"

    # YOLO detection
    results = model(cv_img, imgsz=1280, conf=0.15, iou=0.45)[0]

    detections = []
    for box in results.boxes:
        conf = float(box.conf[0])
        if conf < 0.65:
            continue

        cls = int(box.cls[0])
        detections.append({
            "class": model.names[cls],
            "confidence": round(conf, 2)
        })

    # If no confident detections → do NOT save
    if len(detections) == 0:
        return {
            "sensor_id": sensor_id,
            "timestamp": timestamp,
            "detected": False,
            "image_url": None,
            "annotated_url": None,
            "detections": [],
            "crops": []
        }

    # Save original
    orig_filename = f"{base_name}.jpg"
    cv2.imwrite(os.path.join(SAVE_DIR, orig_filename), cv_img)

    # Annotated + crops
    annotated_filename, crops_info = save_annotated_and_crops(
        img_pil, results, base_name, BASE_URL
    )

    # Create log entry
    item = {
        "sensor_id": sensor_id,
        "timestamp": timestamp,

        "detected": True,
        "detections": detections,
        "crops": crops_info,

        "image_url": f"{BASE_URL}/images/{orig_filename}",
        "annotated_url": f"{BASE_URL}/images/{annotated_filename}",
    }

    detections_log.append(item)
    return item


# ======================================================
# FRONTEND → GET ALL DETECTIONS
# ======================================================
@app.get("/detections")
async def get_detections():
    return detections_log   # return pure array

@app.get("/")
async def root():
    return {"message": "Backend Running with YOLOv8 + Ngrok + Full CORS Fix!"}
