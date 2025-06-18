import gradio as gr
import cv2
import requests
import os
from ultralytics import YOLO
from pathlib import Path

# ✅ Step 1: Download the YOLO model from Hugging Face Model Hub
MODEL_URL = "https://huggingface.co/sureshGongali1/pothole-yolov8-model/resolve/main/best.pt"  # 🔁 Replace with your model URL
MODEL_PATH = "best.pt"

if not Path(MODEL_PATH).exists():
    print("Downloading model...")
    r = requests.get(MODEL_URL)
    with open(MODEL_PATH, "wb") as f:
        f.write(r.content)
    print("Model downloaded.")

model = YOLO(MODEL_PATH)

# ✅ Step 2: Download example media files
file_urls = [
    'https://www.dropbox.com/s/b5g97xo901zb3ds/pothole_example.jpg?dl=1',
    'https://www.dropbox.com/s/86uxlxxlm1iaexa/pothole_screenshot.png?dl=1',
    'https://www.dropbox.com/s/7sjfwncffg8xej2/video_7.mp4?dl=1'
]

def download_file(url, save_name):
    if not os.path.exists(save_name):
        r = requests.get(url)
        with open(save_name, 'wb') as f:
            f.write(r.content)

for i, url in enumerate(file_urls):
    if 'mp4' in url:
        download_file(url, "video.mp4")
    else:
        download_file(url, f"image_{i}.jpg")

path = [['image_0.jpg'], ['image_1.jpg']]
video_path = [['video.mp4']]

# ✅ Step 3: Image detection
def show_preds_image(image_path):
    image = cv2.imread(image_path)
    results = model.predict(source=image_path)[0]
    for box in results.boxes.xyxy:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

interface_image = gr.Interface(
    fn=show_preds_image,
    inputs=[gr.Image(type="filepath", label="Input Image")],
    outputs=[gr.Image(type="numpy", label="Output Image")],
    examples=path,
    title="Pothole Detector (Image)",
    cache_examples=False
)

# ✅ Step 4: Video detection (only first frame shown for demo)
def show_preds_video(video_path):
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        return None
    results = model.predict(source=frame)[0]
    for box in results.boxes.xyxy:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

interface_video = gr.Interface(
    fn=show_preds_video,
    inputs=[gr.Video(type="filepath", label="Input Video")],
    outputs=[gr.Image(type="numpy", label="Detected Frame")],
    examples=video_path,
    title="Pothole Detector (Video)",
    cache_examples=False
)

# ✅ Step 5: Launch Gradio tabbed UI
gr.TabbedInterface(
    [interface_image, interface_video],
    tab_names=["Image Inference", "Video Inference"]
).queue().launch()
