# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import io, os, time
import numpy as np

app = FastAPI(title="Drone Detection API")

MODEL_PATH = "best.pt"   # place best.pt here
SAVE_DIR = "detections"
os.makedirs(SAVE_DIR, exist_ok=True)

# load model once
model = YOLO(MODEL_PATH)  # ultralytics model instance

def save_annotated_and_crops(img_pil, results, base_name):
    annotated = img_pil.copy()
    draw = ImageDraw.Draw(annotated)
    w, h = img_pil.size
    detections = []
    font = None
    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()

    for i, box in enumerate(results.boxes):
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        name = results.names[cls] if hasattr(results, 'names') else str(cls)

        # draw box and label
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
        label = f"{name} {conf:.2f}"
        draw.text((x1, y1 - 12), label, fill="yellow", font=font)

        # save crop
        crop = img_pil.crop((x1, y1, x2, y2))
        crop_name = f"{base_name}_crop_{i}_{name}.jpg"
        crop.save(os.path.join(SAVE_DIR, crop_name))

        detections.append({
            "class_id": cls,
            "name": name,
            "conf": conf,
            "box": [x1, y1, x2, y2],
            "crop": os.path.join(SAVE_DIR, crop_name)
        })

    ann_name = f"{base_name}_annotated.jpg"
    annotated.save(os.path.join(SAVE_DIR, ann_name))
    return ann_name, detections

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as e:
        return JSONResponse({"status":"error","message":"Invalid image", "detail": str(e)}, status_code=400)

    # run inference
    results = model(img, imgsz=640)[0]   # returns a Results object list, take first

    # Save original + annotated + crops
    ts = int(time.time()*1000)
    base_name = f"img_{ts}"
    orig_name = f"{base_name}.jpg"
    img.save(os.path.join(SAVE_DIR, orig_name))

    annotated_name, detections = save_annotated_and_crops(img, results, os.path.join(SAVE_DIR, base_name))

    # build response
    resp = {
        "status": "success",
        "detections": detections,
        "annotated_image": os.path.join(SAVE_DIR, annotated_name),
        "original_image": os.path.join(SAVE_DIR, orig_name)
    }
    return resp

# optional: GET annotated image
@app.get("/image/{filename}")
async def get_image(filename: str):
    path = os.path.join(SAVE_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path, media_type="image/jpeg")
    return JSONResponse({"status":"error","message":"not found"}, status_code=404)
