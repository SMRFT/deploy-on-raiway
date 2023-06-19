import cv2
import numpy as np


def compare_faces(image1_path, image2_path):
    # Load the images
    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    # Convert images to grayscale
    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

    # Create the face detection classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces in the images
    faces1 = face_cascade.detectMultiScale(gray1, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    faces2 = face_cascade.detectMultiScale(gray2, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # If no faces are found in either image, return False
    if len(faces1) == 0 or len(faces2) == 0:
        return False

    # Take the first detected face from each image
    x1, y1, w1, h1 = faces1[0]
    x2, y2, w2, h2 = faces2[0]

    # Crop the faces
    face1 = gray1[y1:y1 + h1, x1:x1 + w1]
    face2 = gray2[y2:y2 + h2, x2:x2 + w2]

    # Resize the faces to a consistent size
    face1 = cv2.resize(face1, (100, 100))
    face2 = cv2.resize(face2, (100, 100))

    # Calculate the absolute difference between the faces
    diff = cv2.absdiff(face1, face2)

    # Calculate the mean value of the difference
    diff_mean = np.mean(diff)

    # Define a threshold value (you can adjust this based on your needs)
    threshold = 10

    # Compare the mean difference with the threshold
    if diff_mean < threshold:
        return True
    else:
        return False
