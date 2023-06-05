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
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        # Connect to MongoDB
        client = MongoClient(
            'mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
        db = client['data']
        fs = GridFS(db)
        # Open the uploaded file and read its contents
        uploaded_file = request.FILES['file']
        file_contents = uploaded_file.read()

        # Store the file using GridFS
        file_id = fs.put(file_contents, filename=uploaded_file.name)

        # Check if the file was stored inline or as chunks
        file_info = db.fs.files.find_one({'_id': file_id})
        if 'chunks' in file_info:
            # The file was stored as chunks
            return HttpResponse(f'File uploaded with ID {file_id} (stored as chunks)')
        else:
            # The file was stored inline
            return HttpResponse(f'File uploaded with ID {file_id} (stored inline)')  
class EmployeeView(APIView):
    def post(self, request):
        client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
        db = client["data"]
        fs = GridFS(db)
        # Retrieve the proof file if present
        if 'proof' in request.FILES:
            proof_file = request.FILES['proof']
            file_contents1 = proof_file.read()
        else:
            file_contents1 = None

        # Retrieve the certificates file if present
        if 'certificates' in request.FILES:
            certificates_file = request.FILES['certificates']
            file_contents = certificates_file.read()
        else:
            file_contents = None

        # Retrieve the imgSrc file if present
        if 'imgSrc' in request.FILES:
            imgsrc_profile = request.FILES['imgSrc']
            file_contents3 = imgsrc_profile.read()
        else:
            file_contents3 = None

        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        # Store the files in GridFS if they are present


        if file_contents1 is not None:
            proof_file_id = fs.put(file_contents1, filename=employee.name + "_" + employee.id + "_proof.pdf", employee_id=employee.id, employee_name=employee.name)

        if file_contents is not None:
            certificates_file_id = fs.put(file_contents, filename=employee.name + "_" + employee.id + "_certificate.pdf", employee_id=employee.id, employee_name=employee.name)

        if file_contents3 is not None:
            imgsrc_profile_id = fs.put(file_contents3, filename=employee.name + "_" + employee.id + "_profile.jpg", employee_id=employee.id, employee_name=employee.name)
            employee.profile_picture_id = str(imgsrc_profile_id)
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
