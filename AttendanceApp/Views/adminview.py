import os.path
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed,NotFound
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from .constants import Addemployee
from AttendanceApp.models import Admin,PasswordResetRequest,Employee,UserPermission,EmployeeExitForm
from AttendanceApp.serializers import EmployeeSerializer, AdminSerializer,UserPermissionSerializer
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
# import face_recognition
import base64
from django.conf import settings
from django.http import JsonResponse
from django.http import JsonResponse, HttpResponse,HttpResponseBadRequest





    

    
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
         # Check if uploadfile file exists and read its contents
        if 'uploadFile' in request.FILES:
            uploadFile_file = request.FILES['uploadFile']
            file_contents4 = uploadFile_file.read()
            uploadFile_filename = f'{employee_name}_{employee_id}_uploadFile.pdf'
            uploadFile_id = fs.put(file_contents4, filename=uploadFile_filename)
        # Read imgSrc file contents
        imgsrc_profile = request.FILES['imgSrc']
        file_contents3 = imgsrc_profile.read()
        imgsrc_filename = f'{employee_name}_{employee_id}_profile.jpg'
        imgsrc_id = fs.put(file_contents3, filename=imgsrc_filename)
        # Save file information in the database
        db.fs.files.insert_one({
            'proof_id': str(proof_id) if 'proof' in request.FILES else None,
            'certificates_id': str(certificates_id) if 'certificates' in request.FILES else None,
            'uploadFile_id':str(uploadFile_id) if 'uploadFile' in request.FILES else None,
            'imgsrc_id': str(imgsrc_id),
            'employee_name': employee_name,
            'employee_id': employee_id,
           
        })
        return HttpResponse('Files uploaded successfully')
    return HttpResponseBadRequest('Invalid request method')

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

class AdminLogin(APIView):
    def post(self, request):
        cred = base64.b64decode(request.headers["Authorization"][6:]).decode('utf-8')
        i = cred.index(':')
        email = cred[:i]
        password = cred[i+1:]
     
        # Assuming you have an Admin model with email, password, name, role, and mobile fields
        user = Admin.objects.filter(email=email).first()
        
        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        if not user.is_active:
            raise AuthenticationFailed('User is not active!')

        # Generate a JWT token
        refresh = RefreshToken.for_user(user)
        refresh.access_token.set_exp(timezone.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'])
        access_token = str(refresh.access_token)

        # Return the JWT token in 'Bearer' format
        response_data = {
            'jwt': f'Bearer {access_token}',  # JWT token in 'Bearer' format
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'mobile': user.mobile
        }
        return Response(response_data)


from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication # Import JWT authentication


class EmployeeView(APIView):
 

    def post(self, request):
        # Your view logic goes here
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        employee.save()
        return Response({'message': 'New Employee Has Been Added Successfully'})






    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import secrets
import string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_registration(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'POST':
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.utils.http import urlsafe_base64_decode
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
User = get_user_model()  # Get the User model

from django.shortcuts import render

@api_view(['GET'])
def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
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
            from_email = 'parthipanmurugan33517@gmail.com'
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

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import TokenError

class UserDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user  # User details are obtained from the token

        user_data = {
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'mobile': user.mobile
        }

        return Response(user_data)

from django.http import FileResponse
from django.views import View
from reportlab.pdfgen import canvas
from io import BytesIO
import json

from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from django.template import Context


from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate, Paragraph
from reportlab.platypus import Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

import fitz  # PyMuPDF
from io import BytesIO
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib import colors

class GeneratePDF(View):
    def get(self, request, id):
        # Fetch employee data based on id
        employee = get_object_or_404(Employee, pk=id)

        # Load an existing PDF file
        existing_pdf_path = 'AttendanceUI\\src\\images\\Employeedetail.pdf'
        pdf_document = fitz.open(existing_pdf_path)

        # Access the first page of the PDF
        page = pdf_document.load_page(0)

        # Define the font and size for text
        font = "helvetica"
        font_size = 12

        # Customize the PDF content based on employee data
        data = {
            "Employee ID": str(employee.id),
            "Name": employee.name,
            "Email": employee.email,
            "Mobile": employee.mobile,
            "Department": employee.department,
            "Designation": employee.designation,
            "Address": employee.address,
            "Languages": employee.languages,
            "Aadhaar No": employee.Aadhaarno,
            "Pan No": employee.PanNo,
            "Identification Mark": employee.IdentificationMark,
            "Blood Group": employee.BloodGroup,
            "RNRNO": employee.RNRNO,
            "TNMC No": employee.TNMCNO,
            "Validity Date": employee.ValidlityDate,
            "Date of Joining": employee.dateofjoining,
            "Salary": employee.salary,
            "Bank Account Number": employee.bankaccnum  
        }

        # Define positions for placing the data on the PDF
        positions = {
            "Employee ID": (100, 160),
            "Name": (100, 180),
            "Email": (100, 200),
            "Mobile": (100, 220),
            "Department": (100, 420),
            "Address": (100, 400),
            "Languages": (100, 380),
            "Aadhaar No": (100, 360),
            "Pan No": (100, 340),
            "Identification Mark": (100, 320),
            "Blood Group":( 100, 300),
            "RNRNO":( 100, 280),
            "TNMC No":(100, 260),
            "Validity Date": (100, 240),
            "Date of Joining": (100, 440),
            "Salary": (100, 460),
            "Bank Account Number": (100, 480),
            "Designation":  (100, 500)
        }

        # Iterate over data and add it to the PDF
        for label, value in data.items():
            page.insert_text((positions[label][0], positions[label][1]), f"{label}: {value}", fontsize=font_size, fontname=font)

        # Save the modified PDF to a BytesIO buffer
        buffer = BytesIO()
        pdf_document.save(buffer, garbage=4, deflate=True, clean=True)
        buffer.seek(0)

        # Return the modified PDF as a FileResponse
        return FileResponse(buffer, as_attachment=True, filename=employee.name+"_"+employee.id+".pdf")



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status



@api_view(['POST', 'GET'])
@csrf_exempt
def user_permission(request):
    if request.method == 'POST':
        # Handle POST request to update permissions for a role.
        data = request.data
        # Assuming you have a model named 'YourModel' to store user permissions
        try:
            serializer = UserPermissionSerializer(data=data)
            print("User permission serializer:", serializer)  # Add this line for debugging
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print("Serializer errors:", serializer.errors)  # Add this line for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserPermission.DoesNotExist:
            return Response({'message': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'GET':
        # Handle GET request to retrieve permissions for a role.
        role = request.GET.get('role')  # Get the 'role' parameter from the query string
        if role is not None:
            try:
                user = UserPermission.objects.get(role=role)
                permissions = {
                    'employee': user.employee,
                    'add_employee': user.add_employee,
                    'dashboard': user.dashboard,
                    'pending_approval': user.pending_approval,
                    'admin_registration': user.admin_registration,
                }
                return Response(permissions, status=status.HTTP_200_OK)
            except UserPermission.DoesNotExist:
                return Response({'message': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'Role parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)




from django.http import HttpResponse
from datetime import date, datetime
@csrf_exempt
def parse_date(date_str):
    try:
        # Attempt to parse the date string as a datetime object
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        try:
            # Attempt to parse the date string with an alternative format
            return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ').date()
        except ValueError:
            # Handle parsing errors or additional date formats here
            return None
@csrf_exempt
def employee_events(request):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    today = date.today()

    employees = Employee.objects.all()
    print(employees)
    joining_anniversaries = []
    birthdays = []
    print(birthdays)
    for employee in employees:
        # Parse the 'dob' date string
        dob = parse_date(str(employee.dob))
        
        # Parse the 'dateofjoining' date string
        dateofjoining = parse_date(str(employee.dateofjoining))

        # Check if parsing was successful for both 'dob' and 'dateofjoining'
        if dob and dateofjoining:
            if today.month == dob.month and today.day == dob.day:
                birthdays.append(employee.name)
                print(f"Today is the birthday of: {employee.name}")

            # Calculate work anniversary
            work_anniversary = today.year - dateofjoining.year
            if today.month < dateofjoining.month or (today.month == dateofjoining.month and today.day < dateofjoining.day):
                work_anniversary -= 1

            # Check if it's a work anniversary
            if work_anniversary > 0 and today.month == dateofjoining.month and today.day == dateofjoining.day:
                joining_anniversaries.append((employee.name, work_anniversary))
                print(f"{employee.name} is celebrating {work_anniversary} years of joining")

    response_text = ""
    if birthdays:
        response_text += f"Today's birthday celebration employees are: {', '.join(birthdays)}\n"

    if joining_anniversaries:
        response_text += "Work Anniversaries:\n"
        for name, anniversary in joining_anniversaries:
            response_text += f"{name}: {anniversary} years\n"

    return HttpResponse(response_text, content_type="text/plain")



@csrf_exempt
def submit_employee_exit_form(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            employee_exit_form = EmployeeExitForm(
                name=data.get('name'),
                id=data.get('id'),
                department=data.get('department'),
                exitStatus=data.get('exitStatus'),
                lastWorkingDate=data.get('lastWorkingDate')
            )
            employee_exit_form.save()
            return JsonResponse({'message': 'Form submitted successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        

@csrf_exempt
def get_employee_exit_form(request):
    if request.method == 'GET':
        try:
            # Retrieve all the employee exit forms
            exit_forms = EmployeeExitForm.objects.all()
            # Serialize the data if needed
            serialized_exit_forms = []
            for form in exit_forms:
                serialized_exit_forms.append({
                    'name': form.name,
                    'id': form.id,
                    'department': form.department,
                    'exitStatus': form.exitStatus,
                    'lastWorkingDate': form.lastWorkingDate,
                })
            return JsonResponse({'data': serialized_exit_forms})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)