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
        uploaded_file = request.FILES['proof']
        file_contents = uploaded_file.read()

        # Store the file using GridFS
        file_id = fs.put(file_contents, filename=uploaded_file.name)
        print(file_id)
        # Check if the file was stored inline or as chunks
 
from django.core.exceptions import ValidationError

class EmployeeView(APIView):
    def post(self, request):
        proof_file = request.FILES.get('proof')
        certificates_file = request.FILES.get('certificates')
        imgsrc_profile = request.FILES.get('imgSrc')

        if proof_file is None or certificates_file is None or imgsrc_profile is None:
            return Response({'message': 'Required files not provided'}, status=400)

        employee = self.save_employee(request.data)

        try:
            proof_file_id = self.store_file(proof_file, employee, "_proof.pdf")
            certificates_file_id = self.store_file(certificates_file, employee, "_certificate.pdf")
            imgsrc_profile_id = self.store_file(imgsrc_profile, employee, "_profile.jpg")
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        employee.profile_picture_id = str(imgsrc_profile_id)
        employee.save()

        return Response({'message': 'New Employee has been added successfully'})

    def save_employee(self, data):
        serializer = EmployeeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def store_file(self, file, employee, suffix):
        client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
        db = client["data"]
        fs = GridFS(db)
        file_contents = file.read()
        filename = f"{employee.name}_{employee.id}{suffix}"
        file_id = fs.put(file_contents, filename=filename, employee_id=employee.id, employee_name=employee.name)
        return file_id





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
