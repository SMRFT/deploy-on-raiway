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

import boto3
from botocore.exceptions import NoCredentialsError

import io

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

        # Open the uploaded files and read their contents
        proof_file = request.FILES['proof']
        file_contents1 = proof_file.read()
        certificates_file = request.FILES['certificates']
        file_contents2 = certificates_file.read()
        imgsrc_profile = request.FILES['imgSrc']
        file_contents3 = imgsrc_profile.read()

        # Store the files in the GridFS
        proof_filename = f'{employee_name}_{employee_id}_proof.pdf'
        certificates_filename = f'{employee_name}_{employee_id}_certificates.pdf'
        imgsrc_filename = f'{employee_name}_{employee_id}_profile.jpg'

        proof_id = fs.put(file_contents1, filename=proof_filename)
        certificates_id = fs.put(file_contents2, filename=certificates_filename)
        imgsrc_id = fs.put(file_contents3, filename=imgsrc_filename)

        # Save file information in the database
        db.fs.files.insert_one({
            'proof_id': str(proof_id),
            'certificates_id': str(certificates_id),
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
        proof_file = request.FILES['proof']
        file_contents1 = proof_file.read()
        certificates_file = request.FILES['certificates']
        file_contents = certificates_file.read()
        imgsrc_profile = request.FILES['imgSrc']
        file_contents3 = imgsrc_profile.read()
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        # Store the files in GridFS
        client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
        db = client["data"]
        fs = GridFS(db)
        # certificates_filename =employee.name+".pdf"
        proof_file_id = fs.put(file_contents1, filename=employee.name + "_" + employee.id + "_proof.pdf", employee_id=employee.id,employee_name=employee.name)
        certificates_file_id = fs.put(file_contents, filename=employee.name + "_" + employee.id + "_certificate.pdf", employee_id=employee.id,employee_name=employee.name)
        imgsrc_profile_id = fs.put(file_contents3, filename=employee.name + "_" + employee.id + "_profile.jpg", employee_id=employee.id,employee_name=employee.name)
        employee.profile_picture_id = str(imgsrc_profile_id)
        employee.save()
        # imgsrc_profile_id = fs.put(file_contents3, filename = employee.name + "-" + str(employee.id) + ".pdf", employee_id=employee.id)
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
