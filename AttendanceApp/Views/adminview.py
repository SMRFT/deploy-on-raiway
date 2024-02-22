import os.path
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed,NotFound
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from .constants import Addemployee
from AttendanceApp.models import Admin,PasswordResetRequest,Employee,UserPermission,EmployeeExitForm,AWSCredentials
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


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
 # Import your AWSCredentials model here

# Use the @csrf_exempt decorator to exempt the view from CSRF protection
@csrf_exempt
def get_aws_credentials(request):
    try:
        # Retrieve the first AWS credentials object from the database
        aws_credentials = AWSCredentials.objects.first()

        # Check if AWS credentials were found
        if aws_credentials:
            # If credentials are found, create a dictionary with the relevant information
            credentials = {
                'access_key_id': aws_credentials.access_key_id,
                'secret_access_key': aws_credentials.secret_access_key,
                'bucket_name': aws_credentials.bucket_name,
                's3_region': aws_credentials.s3_region,
            }
            # Return the AWS credentials as a JSON response
            return JsonResponse(credentials)
        else:
            # If no AWS credentials are found, return a JSON response with a 404 status code
            return JsonResponse({'error': 'AWS credentials not found'}, status=404)
    except Exception as e:
        # Handle exceptions that may occur (e.g., database connection issues)
        print(f"Error retrieving AWS credentials: {e}")

        # Return a JSON response indicating an internal server error with a 500 status code
        return JsonResponse({'error': 'Internal server error'}, status=500)

import requests
import boto3

@csrf_exempt
def get_aws_credentials1(request):
    try:
        aws_credentials = AWSCredentials.objects.first()
        if aws_credentials:
            credentials = {
                'access_key_id': aws_credentials.access_key_id,
                'secret_access_key': aws_credentials.secret_access_key,
                'bucket_name': aws_credentials.bucket_name,
                's3_region': aws_credentials.s3_region,
            }
            return credentials  # Return the dictionary directly
        else:
            return {'error': 'AWS credentials not found'}  # Return a default dictionary
    except Exception as e:
        # Handle exceptions (e.g., database connection issues)
        print(f"Error retrieving AWS credentials: {e}")
        return {'error': 'Internal server error'}
    

import boto3
from django.http import HttpResponseServerError
from io import BytesIO
from boto3.s3.transfer import S3Transfer
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
        db = client['data']
        fs = GridFS(db)
        # Connect to AWS S3
        aws_credentials = get_aws_credentials1(request)
        
        if 'error' in aws_credentials:
            return JsonResponse(aws_credentials, status=500)  # Return error response if there's an issue
        # print("DDDDDD",aws_credentials)
        aws_access_key_id = aws_credentials.get('access_key_id')
        aws_secret_access_key = aws_credentials.get('secret_access_key')
        aws_bucket_name = aws_credentials.get('bucket_name')
        aws_s3_region = aws_credentials.get('s3_region')
        s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key, region_name=aws_s3_region)
        transfer = S3Transfer(s3_client)
        # Retrieve employee information
        employee_name = request.POST.get('employee_name')
        employee_id = request.POST.get('employee_id')
        # Upload imgSrc file to AWS S3

        # Check if proof file exists and read its contents
        if 'proof' in request.FILES:
            proof_file = request.FILES['proof']
            file_contents1 = proof_file.read()
            proof_filename = f'{employee_name}_{employee_id}_proof.pdf'
            proof_id = fs.put(file_contents1, filename=proof_filename)
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

        imgsrc_key = f'{imgsrc_filename}'
        # s3_client.upload_fileobj(file_contents3, aws_bucket_name, imgsrc_key)
        # Retrieve employee information
        file_contents3_io = BytesIO(file_contents3)
        # Upload to AWS S3
        s3_client.upload_fileobj(file_contents3_io, aws_bucket_name, imgsrc_key)
        # Save file information in the database
        db.fs.files.insert_one({
            'proof_id': str(proof_id) if 'proof' in request.FILES else None,
            'uploadFile_id': str(uploadFile_id) if 'uploadFile' in request.FILES else None,
            'imgsrc_id': str(imgsrc_id),
            'employee_name': employee_name,
            'employee_id': employee_id,
        })
        # Extract regular certificates information
        degrees = []
        for index in range(len(request.FILES)):
            certificates_key = f'certificates-{index}'
            if certificates_key in request.FILES:
                degree = request.POST.get(f'degree-{index}')
                degrees.append(degree)
        # Check and handle regular certificates files
        for index, degree in enumerate(degrees):
            certificates_key = f'certificates-{index}'
            if certificates_key in request.FILES:
                certificates_file = request.FILES[certificates_key]
                file_contents2 = certificates_file.read()
                certificates_filename = f'{employee_name}_{employee_id}_{degree}_certificates.pdf'
                certificates_id = fs.put(file_contents2, filename=certificates_filename)
                # Save regular certificates file information in the database
                db.fs.files.insert_one({
                    'certificates_id': str(certificates_id),
                    'employee_name': employee_name,
                    'employee_id': employee_id,
                    'degree': degree,
                })
        # Extract experience certificates information
        experience_certificates = []
        for index in range(len(request.FILES)):
            exp_certificates_key = f'expCertificate-{index}'
            if exp_certificates_key in request.FILES:
                experience_certificate_file = request.FILES[exp_certificates_key]
                exp_file_contents = experience_certificate_file.read()
                exp_certificates_filename = f'{employee_name}_{employee_id}_exp_certificate_{index}.pdf'
                exp_certificates_id = fs.put(exp_file_contents, filename=exp_certificates_filename)
                # Save experience certificates file information in the database
                db.fs.files.insert_one({
                    'experience_certificates_id': str(exp_certificates_id),
                    'employee_name': employee_name,
                    'employee_id': employee_id,
                    'exp_certificate_index': index,
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
    """
    View for handling the registration of admin users.

    This view supports the POST method for creating a new admin user.
    Requires authentication for access.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        Response: JSON response containing the result of the registration attempt.
    """
    if request.method == 'POST':
        # Deserialize the incoming data using the AdminSerializer
        serializer = AdminSerializer(data=request.data)
        
        # Check if the data is valid
        if serializer.is_valid():
            # Save the new admin user
            serializer.save()
            
            # Return a success response with the serialized data and a 201 status code
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return an error response with the validation errors and a 400 status code
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
    """
    View for activating a user account based on a provided UID and token.

    Args:
        request (HttpRequest): The HTTP request object.
        uidb64 (str): The base64-encoded user ID.
        token (str): The token for account activation.

    Returns:
        HttpResponse: A rendered HTML response with a message indicating the result of the activation attempt.
    """
    try:
        # Decode the base64-encoded user ID to obtain the actual user ID
        uid = force_str(urlsafe_base64_decode(uidb64))

        # Retrieve the user based on the decoded user ID
        user = User.objects.get(pk=uid)

        # Check if the provided token is valid for the user
        if default_token_generator.check_token(user, token):
            # Activate the user's account
            user.is_active = True
            user.save()
            message = 'Account activated successfully!'
        else:
            # Invalid activation link
            message = 'Activation link is invalid.'
    except User.DoesNotExist:
        # User not found
        message = 'User not found.'
    except Exception as e:
        # Handle other exceptions (e.g., decoding errors)
        message = str(e)

    # Render the activation result message in the 'activation.html' template
    return render(request, 'AttendanceApp/activation.html', {'message': message})


from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
@api_view(['POST'])
def send_reset_code(request):
    """
    View for sending a password reset code to the user's email address.

    This view supports the POST method and requires an email address in the request data.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        Response: JSON response containing a success or error message.
    """
    if request.method == 'POST':
        # Get the user's email address from the request data
        user_email = request.data.get('email')

        if user_email:
            # Generate a reset code using a utility function
            reset_code = generate_reset_code() 
            
            # Create a PasswordResetRequest object and save it to the database
            reset_request = PasswordResetRequest(email=user_email, reset_code=reset_code)
            reset_request.save()

            # Send an email with a customized HTML message
            subject = 'Password Reset'
            html_message = render_to_string('AttendanceApp/password_reset_email.html', {'reset_code': reset_code})
            plain_message = strip_tags(html_message)
            from_email = 'parthipanmurugan33517@gmail.com'
            recipient_list = [user_email]

            try:
                # Attempt to send the email
                send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
                return Response({'message': 'Reset code sent successfully'})
            except Exception as e:
                # Return an error response if email sending fails
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Return an error response if email address is not provided
            return Response({'error': 'Email address not provided'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Return an error response for invalid request method
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
    # Uncomment the line below to require authentication for accessing this view
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        API view for retrieving details of the authenticated user.

        This view returns information such as email, name, role, and mobile number of the authenticated user.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: JSON response containing user details.
        """
        # Obtain user details from the request's user object (authenticated user)
        user = request.user  

        # Create a dictionary with relevant user information
        user_data = {
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'mobile': user.mobile
        }

        # Return a JSON response containing the user details
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
            "Blood Group": employee.BloodGroup,
            "RNRNO": employee.RNRNO,
            "TNMC No": employee.TNMCNO,
            "Validity Date": employee.ValidlityDate,
            "Date of Joining": employee.dateofjoining,
            "Salary": employee.salary,
            "Bank Account Number": employee.bankaccnum  ,
            "Medical Claim Policy No": employee.medicalClaimPolicyNo,
            "Validity Date From": str(employee.validityDateFrom),
            "Validity Date To": str(employee.validityDateTo),
            "Bank Name": employee.bankName,
            "IFSC Code": employee.ifscCode,
            "Company Email": employee.companyEmail,
            # "Asset Details": employee.assetDetails,
            # "Reported By": employee.reportedBy,
        }

        # Define positions for placing the data on the PDF
        positions = {
            "Employee ID": (100, 160),
            "Name": (100, 180),
            "Email": (100, 200),
            "Mobile": (100, 220),
            "Department": (100, 240),
            "Address": (100, 260),
            "Languages": (100, 280),
            "Aadhaar No": (100, 300),
            "Pan No": (100, 320),
            "Blood Group":( 100, 340),
            "RNRNO":( 100, 360),
            "TNMC No":(100, 380),
            "Validity Date": (100, 400),
            "Date of Joining": (100, 420),
            "Salary": (100, 440),
            "Bank Account Number": (100, 460),
            "Designation":  (100, 480),
            "Medical Claim Policy No": (100, 500),
            "Validity Date From": (100, 520),
            "Validity Date To": (100, 540),
            "Bank Name": (100, 560),
            "IFSC Code": (100, 580),
            "Company Email": (100, 600),
            "Asset Details": (100, 620),
            "Reported By": (100, 640),
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
            # print("Serializer errors:", serializer.errors)  # Add this line for debugging
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
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
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
                # print(f"Today is the birthday of: {employee.name}")

            # Calculate work anniversary
            work_anniversary = today.year - dateofjoining.year
            if today.month < dateofjoining.month or (today.month == dateofjoining.month and today.day < dateofjoining.day):
                work_anniversary -= 1

            # Check if it's a work anniversary
            if work_anniversary > 0 and today.month == dateofjoining.month and today.day == dateofjoining.day:
                joining_anniversaries.append((employee.name, work_anniversary))
                # print(f"{employee.name} is celebrating {work_anniversary} years of joining")

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
    """
    View for submitting an employee exit form.

    This view supports the POST method and expects JSON data containing employee exit information.
    The data is then used to create a new EmployeeExitForm object and save it to the database.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response indicating the success or failure of the form submission.
    """
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body.decode('utf-8'))

            # Create an EmployeeExitForm object with data from the request
            employee_exit_form = EmployeeExitForm(
                name=data.get('name'),
                id=data.get('id'),
                department=data.get('department'),
                exitStatus=data.get('exitStatus'),
                lastWorkingDate=data.get('lastWorkingDate')
            )

            # Save the form to the database
            employee_exit_form.save()

            # Return a success message in a JSON response
            return JsonResponse({'message': 'Form submitted successfully'})
        except Exception as e:
            # Return an error message in a JSON response if an exception occurs
            return JsonResponse({'error': str(e)}, status=400)
    else:
        # Return an error response for invalid request method
        return JsonResponse({'error': 'Invalid request method'}, status=405)
        

@csrf_exempt
def get_employee_exit_form(request):
    """
    View for retrieving all employee exit forms.

    This view supports the GET method and retrieves all employee exit forms from the database.
    The retrieved data is serialized if needed and returned in a JSON response.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing employee exit form data or an error message.
    """
    if request.method == 'GET':
        try:
            # Retrieve all employee exit forms from the database
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

            # Return a JSON response with the serialized exit form data
            return JsonResponse({'data': serialized_exit_forms})
        except Exception as e:
            # Return an error message in a JSON response with a status code of 400 if an exception occurs
            return JsonResponse({'error': str(e)}, status=400)
    else:
        # Return an error response with a status code of 400 for invalid request methods
        return JsonResponse({'error': 'Invalid request method'}, status=400)




from django.http import JsonResponse
from datetime import date
from dateutil.parser import parse as parse_date, ParserError


def parse_date_with_flexibility(date_str):
    """
    Parse a date string with flexibility, handling ParserError.

    Args:
        date_str (str): The date string to parse.

    Returns:
        date: The parsed date or None if parsing fails.
    """
    try:
        return parse_date(str(date_str)).date()
    except ParserError:
        # Handle cases where parsing fails
        print(f"Error parsing date: {date_str}")
        return None

def employee_events(request):
    """
    View for retrieving employee events such as birthdays and joining anniversaries.

    This view calculates and identifies employees with birthdays and work anniversaries for the current date.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: JSON response containing employee event data.
    """
    today = date.today()
    employees = Employee.objects.all()
    joining_anniversaries = []
    birthdays = []

    for employee in employees:
        try:
            # Parse date of birth and date of joining with flexibility
            dob = parse_date_with_flexibility(employee.dob)
            dateofjoining = parse_date_with_flexibility(employee.dateofjoining)

            # Check for birthdays
            if dob is not None and today.month == dob.month and today.day == dob.day:
                birthdays.append(employee.name + '_' + str(employee.id))

            # Calculate work anniversary
            work_anniversary = today.year - dateofjoining.year
            if today.month < dateofjoining.month or (today.month == dateofjoining.month and today.day < dateofjoining.day):
                work_anniversary -= 1

            # Check for joining anniversaries
            if work_anniversary > 0 and today.month == dateofjoining.month and today.day == dateofjoining.day:
                joining_anniversaries.append({"name": employee.name, "anniversary": work_anniversary})
                # print(f"{employee.name} is celebrating {work_anniversary} years of joining")

        except Exception as e:
            # Handle other exceptions
            # print(f"Error processing employee {employee.name}: {e}")
            # print(f"Today: {today}")
            print(f"Employee: {employee.name}, DOB: {dob}")

    # Prepare response data
    response_data = {
        "birthdays": birthdays,
        "joining_anniversaries": joining_anniversaries,
    }

    # Return a JSON response with employee event data
    return JsonResponse(response_data)





