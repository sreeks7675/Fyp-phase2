import numpy as np
import cv2
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

def preprocess_signature(path):

    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (224,224))
    img = img / 255.0

    img = np.stack([img,img,img], axis=-1)
    img = np.expand_dims(img, axis=0)

    return preprocess_input(img)

def generate_embedding(path):

    img = preprocess_signature(path)

    embedding = model.predict(img)

    return embedding[0]