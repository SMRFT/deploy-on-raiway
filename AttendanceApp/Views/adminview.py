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
from rest_framework import status
    

from django.http import Http404

def upload_file_to_gridfs(file, filename, **kwargs):
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
    db = client['data']
    fs = GridFS(db)

    # Store the file in GridFS
    file_id = fs.put(file, filename=filename, **kwargs)

    return str(file_id)

class EmployeeView(APIView):
    def post(self, request):
        proof_file = request.FILES.get('proof')
        file_constants1=proof_file.read()
        certificates_file = request.FILES.get('certificates')
        file_constants2=certificates_file.read()
        imgsrc_profile = request.FILES.get('imgSrc')
        file_constants3=imgsrc_profile.read()

        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        try:
            # Upload the files to GridFS
            proof_file_id = upload_file_to_gridfs(file_constants1, filename=f'{employee.name}_{employee.id}_proof.pdf',
                                                  employee_id=employee.id, employee_name=employee.name)
            certificates_file_id = upload_file_to_gridfs(file_constants2,
                                                         filename=f'{employee.name}_{employee.id}_certificate.pdf',
                                                         employee_id=employee.id, employee_name=employee.name)
            imgsrc_profile_id = upload_file_to_gridfs(file_constants3,
                                                      filename=f'{employee.name}_{employee.id}_profile.jpg',
                                                      employee_id=employee.id, employee_name=employee.name)

            employee.profile_picture_id = imgsrc_profile_id
            employee.save()

            return Response({'message': 'New Employee Has Been Added Successfully'})

        except Exception as e:
            return Response({'message': 'Error occurred while uploading the files'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
        db = client['data']
        fs = GridFS(db)
        
        # Open and store uploaded files using GridFS
        uploaded_file = request.FILES['file']
        file_contents = uploaded_file.read()
        file_id = fs.put(file_contents, filename=uploaded_file.name)

        proof_file = request.FILES['proof']
        file_contents1 = proof_file.read()
        proof_file_id = fs.put(file_contents1, filename=proof_file.name)

        certificates_file = request.FILES['certificates']
        file_contents2 = certificates_file.read()
        certificates_file_id = fs.put(file_contents2, filename=certificates_file.name)

        imgsrc_profile = request.FILES['imgSrc']
        file_contents3 = imgsrc_profile.read()
        imgsrc_profile_id = fs.put(file_contents3, filename=imgsrc_profile.name)

        # Check if the files were stored as chunks or inline
        file_info = db.fs.files.find_one({'_id': file_id})
        proof_info = db.fs.files.find_one({'_id': proof_file_id})
        certificates_info = db.fs.files.find_one({'_id': certificates_file_id})
        imgsrc_profile_info = db.fs.files.find_one({'_id': imgsrc_profile_id})

        if 'chunks' in file_info:
            # The file was stored as chunks
            return HttpResponse(f'File uploaded with ID {file_id} (stored as chunks)')
        else:
            # The file was stored inline
            return HttpResponse(f'File uploaded with ID {file_id} (stored inline)')

        # You can also handle the other files in a similar manner

    else:
        return HttpResponse('Invalid request method.')

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
