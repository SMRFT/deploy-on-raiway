import os.path
import os
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed,NotFound
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from .constants import Addemployee
from AttendanceApp.models import Admin
from AttendanceApp.serializers import EmployeeSerializer, AdminSerializer
# from Attendance_Management.settings import SIMPLE_JWT,REST_FRAMEWORK
from PIL import Image
import io
# django file storage
from gridfs import GridFS
from pymongo import MongoClient
from django.core.files.storage import default_storage
from django.http import HttpResponse
from bson import ObjectId
import boto3
from botocore.exceptions import NoCredentialsError
from rest_framework import status
from djongo import models
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
import cv2
import numpy as np
import face_recognition
import base64
from django.conf import settings
from django.http import JsonResponse

@csrf_exempt
def facial_recognition_view(request):
    if request.method == 'POST':
        # Get the uploaded image from the request
        image = request.FILES['image']

        # Load the known faces from a directory or database
        # For simplicity, let's assume we have a directory named 'known_faces' with images of known people
        known_faces_dir = 'images'
        known_faces = []
        known_names = []
        for filename in os.listdir(known_faces_dir):
            if filename.endswith('.jpg') or filename.endswith('.png'):
                known_image = face_recognition.load_image_file(os.path.join(known_faces_dir, filename))
                known_face_encoding = face_recognition.face_encodings(known_image)[0]
                known_faces.append(known_face_encoding)
                known_names.append(filename.split('.')[0])  # Extract the name from the file name

        # Load the unknown image
        unknown_image = face_recognition.load_image_file(image)
        unknown_face_encodings = face_recognition.face_encodings(unknown_image)

        # Check if any faces are found in the unknown image
        if len(unknown_face_encodings) > 0:
            face_distances = face_recognition.face_distance(known_faces, unknown_face_encodings[0])
            min_distance_index = face_distances.argmin()
            min_distance = face_distances[min_distance_index]
            recognized_name = known_names[min_distance_index]

            # Compare the distance to a threshold value to determine if it's a match
            if min_distance < 0.6:
                # Face recognized
                response_data = {'recognized': True, 'name': recognized_name}
            else:
                # Face not recognized
                response_data = {'recognized': False}
        else:
            # No faces found in the unknown image
            response_data = {'recognized': False}

        return JsonResponse(response_data)

    return JsonResponse({'recognized': False})


# @csrf_exempt
# def face_recognition_view(request):
#     face_cascade_path = str(settings.BASE_DIR / 'AttendanceApp\haarcascade_frontalface_default.xml')
#     face_cascade = cv2.CascadeClassifier(face_cascade_path)
    
#     video_capture = cv2.VideoCapture(0)
    
#     frame_count = 0
#     output_dir = os.path.join(settings.BASE_DIR, 'face_recognition', 'output')
#     os.makedirs(output_dir, exist_ok=True)
    
#     exit_flag = False
    
#     while not exit_flag:
#         ret, frame = video_capture.read()
        
#         if not ret:
#             print("Failed to capture frame from the video source.")
#             break
        
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
#         faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
#         for (x, y, w, h) in faces:
#             cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
#         cv2.imwrite(os.path.join(output_dir, f"frame_{frame_count}.jpg"), frame)
        
#         frame_count += 1
        
#         cv2.imshow('Face Recognition', frame)
        
#         key = cv2.waitKey(1)
        
#         if key == ord('q'):  # Press 'q' key to exit
#             exit_flag = True
    
#     video_capture.release()
#     cv2.destroyAllWindows()
    
#     return render(request, 'face_recognition.html')

def compare_images(image1, image2):
    # Load the pre-trained face detection model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    print("ffff",face_cascade)

    # Read the input images
    img1 = cv2.imread(image1)
    img2 = cv2.imread(image2)

    # Convert the images to grayscale
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # Detect faces in the images
    faces1 = face_cascade.detectMultiScale(gray1, 1.3, 5)
    faces2 = face_cascade.detectMultiScale(gray2, 1.3, 5)
    print ("face1",faces1,"faces2",faces2)

    # Compare the number of detected faces
    if len(faces1) == len(faces2):
        return True
    else:
        return False

@csrf_exempt
def face_comparison_view(request):
    if request.method == 'POST':
        # Load the uploaded images
        image1 = request.FILES['image1']
        image2 = request.FILES['image2']

        # Read the image data from memory using OpenCV
        nparr1 = np.frombuffer(image1.read(), np.uint8)
        nparr2 = np.frombuffer(image2.read(), np.uint8)
        image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
        image2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

        # Convert the images to grayscale for face detection
        gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

        # Load the pre-trained face detection classifier (e.g., Haar Cascade)
        face_cascade = cv2.CascadeClassifier('AttendanceApp\haarcascade\haarcascade_frontalface_default.xml')

        # Detect faces in the images
        faces1 = face_cascade.detectMultiScale(gray1, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        faces2 = face_cascade.detectMultiScale(gray2, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Compare the number of detected faces
        print("**********",faces1, faces2)
      
        if (np.array_equal(faces1, faces2)):
            # Perform face comparison or other processing
            # ...

            # Render the result template with the comparison result
            return render(request, 'face_comparison_result.html', {'result': 'Faces matched'})
        else:
            return render(request, 'face_comparison_result.html', {'result': 'Faces did not match'})

    # Render the template with the upload form if it's a GET request
    return render(request, 'face_comparison.html')



import cv2

def detect_faces(image_path):
    # Load the image using OpenCV
    image = cv2.imread(image_path)

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Create a face cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Return the coordinates of the faces
    return faces


def compare_faces(image1_path, image2_path):
    # Detect faces in both images
    faces1 = detect_faces(image1_path)
    faces2 = detect_faces(image2_path)

    # Compare the number of faces detected
    if len(faces1) == 0 or len(faces2) == 0:
        return "No faces detected in one or both images"
    elif len(faces1) > 1 or len(faces2) > 1:
        return "Multiple faces detected in one or both images"
    else:
        # Get the coordinates of the first face in each image
        (x1, y1, w1, h1) = faces1[0]
        (x2, y2, w2, h2) = faces2[0]

        # Compare the positions of the faces
        if abs(x1 - x2) <= 10 and abs(y1 - y2) <= 10 and abs(w1 - w2) <= 10 and abs(h1 - h2) <= 10:
            return "Same person"
        else:
            return "Different person"
@csrf_exempt
def face_recognition_view(request):
    # Path to the two images to be compared
    image1_path = 'images\parthiban_123456789_profile.jpg'
    image2_path = 'images\chandra B_105_profile.jpg'

    # Compare the faces in the images
    result = compare_faces(image1_path, image2_path)

    # Pass the result to the template
    context = {
        'result': result
    }

    return render(request, 'face_recognition.html', context)









































@csrf_exempt
def aws_config_view(request):
    if request.method == 'POST':
        region = request.POST.get('region')
        access_key_id = request.POST.get('accessKeyId')
        secret_access_key = request.POST.get('secretAccessKey')

        # Perform any necessary validation or processing of the received data

        # Connect to MongoDB
        client = MongoClient('<mongodb_connection_string>')
        db = client['<database_name>']
        collection = db['aws_config']

        # Create a document with the AWS configuration data
        config_doc = {
            'region': region,
            'accessKeyId': access_key_id,
            'secretAccessKey': secret_access_key
        }

        # Insert the document into the collection
        result = collection.insert_one(config_doc)

        # Check if the insertion was successful
        if result.inserted_id:
            aws_config = {
                'status': 'success',
                'message': 'AWS configuration stored successfully'
            }
        else:
            aws_config = {
                'status': 'error',
                'message': 'Failed to store AWS configuration'
            }

        return JsonResponse(aws_config)
    else:
        aws_config = {
            'status': 'error',
            'message': 'Invalid request method'
        }

        return JsonResponse(aws_config, status=400)
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
        db = client['data']
        fs = GridFS(db)

        # Retrieve employee information
        employee_name = request.POST.get('employee_name')
        employee_id = request.POST.get('employee_id')

        # Check if proof file exists and read its contents
        if 'proof' in request.FILES:
            proof_file = request.FILES['proof']
            file_contents1 = proof_file.read()
            proof_filename = f'{employee_name}_{employee_id}_proof.pdf'
            proof_id = fs.put(file_contents1, filename=proof_filename)

        # Check if certificates file exists and read its contents
        if 'certificates' in request.FILES:
            certificates_file = request.FILES['certificates']
            file_contents2 = certificates_file.read()
            certificates_filename = f'{employee_name}_{employee_id}_certificates.pdf'
            certificates_id = fs.put(file_contents2, filename=certificates_filename)

        # Read imgSrc file contents
        imgsrc_profile = request.FILES['imgSrc']
        file_contents3 = imgsrc_profile.read()
        imgsrc_filename = f'{employee_name}_{employee_id}_profile.jpg'
        imgsrc_id = fs.put(file_contents3, filename=imgsrc_filename)

        # Save file information in the database
        db.fs.files.insert_one({
            'proof_id': str(proof_id) if 'proof' in request.FILES else None,
            'certificates_id': str(certificates_id) if 'certificates' in request.FILES else None,
            'imgsrc_id': str(imgsrc_id),
            'employee_name': employee_name,
            'employee_id': employee_id
        })
        # Save image to AWS S3 bucket
        s3 = boto3.client('s3', aws_access_key_id='AKIA2N5OVS4K7RY5MBWN',
                          aws_secret_access_key='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')
        bucket_name = 'smrft-facial-recognition'
        s3_filename = f'{employee_name}_{employee_id}_profile.jpg'
        try:
            s3.upload_fileobj(io.BytesIO(file_contents3), bucket_name, s3_filename)
        except NoCredentialsError:
            return HttpResponse('AWS credentials not found. Image upload failed.')
        # Return a response indicating successful file upload
        return HttpResponse('Files uploaded successfully')


         
class EmployeeView(APIView):
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        employee.save()
        return Response({'message': 'New Employee Has Been Added Successfully'})




class AdminLogin(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = Admin.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        # token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token,
            'email': user.email,
                    'name': user.name,
                    'role': user.role,
                    'mobile': user.mobile
        }
        return response

class AdminReg(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        return Response(serializer.data)







class UserDetails(APIView):
    def get(self, request):
        email = request.GET.get('email') # Get the email from the query parameters
        user = Admin.objects.filter(email=email).first() # Query the Admin model to get the user
        if user is None:
            raise NotFound('User not found!')
        # Create a dictionary with the user details
        user_data = {
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'mobile': user.mobile
        }
        return Response(user_data)
