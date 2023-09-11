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
from AttendanceApp.models import Admin,PasswordResetRequest
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

        # Save image to local storage
        # with open(f'images{imgsrc_filename}', 'wb') as f:
        #     f.write(file_contents3)

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
        
        if not user.is_active:
            raise AuthenticationFailed('User is not active!')
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
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
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import secrets
import string

@csrf_exempt
@api_view(['POST'])
def admin_registration(request):
    if request.method == 'POST':
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model

User = get_user_model()  # Get the User model

from django.shortcuts import render

@api_view(['GET'])
def activate_account(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            message = 'Account activated successfully!'
        else:
            message = 'Activation link is invalid.'
    except User.DoesNotExist:
        message = 'User not found.'
    except Exception as e:
        message = str(e)

    return render(request, 'AttendanceApp/activation.html', {'message': message})


from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
@api_view(['POST'])
def send_reset_code(request):
    if request.method == 'POST':
        # Get the user's email address from the request data
        user_email = request.data.get('email')

        if user_email:
            reset_code = generate_reset_code() 
            
            # Create a PasswordResetRequest object
            reset_request = PasswordResetRequest(email=user_email, reset_code=reset_code)
            reset_request.save()

            # Send an email with a customized HTML message
            subject = 'Password Reset'
            html_message = render_to_string('AttendanceApp/password_reset_email.html', {'reset_code': reset_code})
            plain_message = strip_tags(html_message)
            from_email = 'parthibansmrft@gmail.com'
            recipient_list = [user_email]

            try:
                send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
                return Response({'message': 'Reset code sent successfully'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Email address not provided'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
import secrets
import string

def generate_reset_code(length=6):
    # Define the character set for the reset code (you can customize this)
    characters = string.ascii_letters + string.digits  # You can add more characters if needed

    # Generate a random reset code of the specified length
    reset_code = ''.join(secrets.choice(characters) for _ in range(length))

    return reset_code


@api_view(['PUT'])  # Use PUT or PATCH as per your preference
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('newPassword')

    if not email:
        return Response({'error': 'Email address is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not new_password:
        return Response({'error': 'New password is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the user in the database by email
        user = Admin.objects.get(email=email)
        # Update the user's password with the new password
        user.password = make_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


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
