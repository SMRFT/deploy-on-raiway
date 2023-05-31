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
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
class EmployeeView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, x-api-key"
        return response

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        self.save_proof_file(request.FILES.get('proof'), employee)
        self.save_certificates_file(request.FILES.get('certificates'), employee)
        self.save_imgsrc_file(request.FILES.get('imgSrc'), employee)

        return Response({'message': 'New Employee Has Been Added Successfully'})

    def save_proof_file(self, file, employee):
        if file:
            file_contents = file.read()
            client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
            db = client["demodatabase"]
            fs = GridFS(db)
            file_id = fs.put(file_contents, filename=f"{employee.name}_{employee.id}_proof.pdf",
                            employee_id=employee.id, employee_name=employee.name)
            employee.proof_file_id = str(file_id)
            employee.save()

    def save_certificates_file(self, file, employee):
        if file:
            file_contents = file.read()
            client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
            db = client["demodatabase"]
            fs = GridFS(db)
            file_id = fs.put(file_contents, filename=f"{employee.name}_{employee.id}_certificate.pdf",
                            employee_id=employee.id, employee_name=employee.name)
            employee.certificates_file_id = str(file_id)
            employee.save()

    def save_imgsrc_file(self, file, employee):
        if file:
            file_contents = file.read()
            client = MongoClient("mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
            db = client["demodatabase"]
            fs = GridFS(db)
            file_id = fs.put(file_contents, filename=f"{employee.name}_{employee.id}_profile.jpg",
                            employee_id=employee.id, employee_name=employee.name)
            employee.imgsrc_file_id = str(file_id)
            employee.save()





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
