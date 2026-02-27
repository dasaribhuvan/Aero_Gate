import pickle
import numpy as np
import cv2
from insightface.app import FaceAnalysis

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

def generate_embedding(image_bytes):
    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    faces = app.get(img)
    if not faces:
        return None

    face = faces[0]
    embedding = face.normed_embedding
    return embedding