import traceback
import requests

from twilio.rest import Client
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from calendar import monthrange
from time import time
import base64
import json
from datetime import datetime

from datetime import timedelta
import calendar
from unicodedata import name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from io import StringIO
from django.shortcuts import render
from datetime import datetime, timedelta
from django.db.models import Count
from rest_framework.decorators import api_view
from .constants import Login, Logout
from django.db.models.functions import TruncDate
from AttendanceApp.models import Employee, Admincalendarlogin, Hour, Breakhours, DeletedEmployee,AWSCredentials
from AttendanceApp.serializers import AdmincalendarSerializer, EmployeeShowSerializer, CalendarSerializer,  EmployeedesignationSerializer, EmployeeShowbydesignationSerializer, HourcalendarSerializer, SummarySerializer, EmployeeexportSerializer, SummaryexportSerializer, BreakhoursSerializer, EmployeeSerializer, EmployeeHoursSerializer, DeletedEmployeeSerializer,EmployeeShowbydepartmentSerializer, EmployeedepartmentSerializer,EmployeeHoursdaySerializer,AWSCredentialsForm
from django.db.models import Q
import json
import calendar
import datetime
import pandas as pd
import numpy as np
from django.conf import settings
from django.http import HttpResponse
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
import cv2
# Retrieve Employee
# import face_recognition
import os
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated


class RetriveEmp(APIView):
    """
    API view for retrieving employee details.

    This view supports GET requests to retrieve details of a specific employee or all employees.

    Attributes:
        authentication_classes (list): List of authentication classes (commented out for now).
        permission_classes (list): List of permission classes (commented out for now).
    """

    # Uncomment the following lines if using JWTAuthentication and IsAuthenticated
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    @csrf_exempt
    def get(self, request):
        """
        Handle GET requests to retrieve employee details.

        If 'id' parameter is provided, retrieve details of the specified employee.
        If 'id' is not provided, retrieve details of all employees.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: JSON response containing employee details or an error message.
        """
        emp_id = request.query_params.get('id')

        if emp_id:
            try:
                # Check if emp_id is not an empty string before attempting to convert it to an integer
                if emp_id.isdigit():
                    emp = Employee.objects.get(id=int(emp_id))
                    serializer = EmployeeShowSerializer(emp)
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Invalid employee ID format'}, status=status.HTTP_400_BAD_REQUEST)
            except Employee.DoesNotExist:
                return Response({'error': f'Employee with ID {emp_id} does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve details of all employees
            emp_details = Employee.objects.all()
            serializer = EmployeeShowSerializer(emp_details, many=True)
            return Response(serializer.data)



# Retrieve Employee By Id

# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
class RetriveEmpById(APIView):
    """
    API view for retrieving an employee's details by ID.

    This view supports POST requests to retrieve details of a specific employee by providing the employee ID.
    The view is configured to allow any user (no authentication required).

    Attributes:
        permission_classes (list): List of permission classes allowing any user to access this view.
    """

    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request):
        """
        Handle POST requests to retrieve an employee's details by ID.

        Args:
            request (HttpRequest): The HTTP request object containing the employee ID in the request data.

        Returns:
            Response: JSON response containing the employee's details or an error message.
        """
        data = request.data

        try:
            # Attempt to retrieve the employee by ID
            emp = Employee.objects.get(id=int(data["id"]))
            serializer = EmployeeShowSerializer(emp)
            return Response(serializer.data)

        except Employee.DoesNotExist:
            # Handle the case where the employee with the provided ID does not exist
            return Response({'error': f'Employee with ID {data["id"]} does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            # Handle the case where the provided ID is not a valid integer
            return Response({'error': 'Invalid employee ID format'}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def upload_aws_credentials(request):
    """
    View for uploading AWS credentials.

    This view supports both GET and POST requests.
    - GET: Renders the form for uploading AWS credentials.
    - POST: Processes the submitted form and saves AWS credentials if the form is valid.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: HTTP response indicating the success or failure of AWS credentials upload.
    """
    if request.method == 'POST':
        # If the request method is POST, process the submitted form
        form = AWSCredentialsForm(request.POST)

        if form.is_valid():
            # If the form is valid, save the AWS credentials and provide a success response
            form.save()
            return HttpResponse('AWS credentials uploaded successfully')
    else:
        # If the request method is GET, render the form for uploading AWS credentials
        form = AWSCredentialsForm()

    # Render the HTML template with the form
    return render(request, 'upload_aws_credentials.html', {'form': form})





# Edit Employee
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
class EmployeeEditView(APIView):
    @csrf_exempt
    def put(self, request, *args, **kwargs):
        data = request.data
        employee = Employee.objects.get(id=data["id"])
        employee.name = data["name"]
        employee.mobile = data["mobile"]
        employee.email = data["email"]
        employee.address = data["address"]
        dob = data.get("dob")
        if dob is not None:
            employee.dob = dob
        age = data.get("age")
        if age is not None:
            employee.age = age
        employee.Maritalstatus = data["Maritalstatus"]
        employee.BloodGroup = data["BloodGroup"]
        employee.Aadhaarno = data["Aadhaarno"]
        employee.PanNo = data["PanNo"]
        employee.bankaccnum = data["bankaccnum"]
        employee.bankName = data["bankName"]
        employee.ifscCode = data["ifscCode"]
        # Update educationData
        education_data = data.get("educationData", [])
        employee.educationData = education_data
        employee.companyEmail = data["companyEmail"]
        employee.department = data["department"]
        if employee.department == "Nurse":
            employee.RNRNO = data.get("RNRNO")
            employee.ValidlityDate = data.get("ValidlityDate")
        if employee.department == "Doctor":
            employee.TNMCNO = data.get("TNMCNO")
        employee.designation = data["designation"]
        employee.dateofjoining = data["dateofjoining"]
        employee.medicalClaimPolicyNo = data["medicalClaimPolicyNo"]
        validityDateFrom = data.get("validityDateFrom")
        if validityDateFrom:
            employee.validityDateFrom = validityDateFrom
        validityDateTo = data.get("validityDateTo")
        if validityDateTo:
            employee.validityDateTo = validityDateTo
        employee.ESINO = data["ESINO"]
        employee.PF = data["PF"]
        employee.salary = data["salary"]
        employee.reportedBy = data["reportedBy"]
        # Get the GridFS instance
        client = MongoClient(
            "mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
        db = client["data"]
        fs = GridFS(db)
        # Delete existing image and insert the new image
        if 'profileImageFile' in request.FILES:
            profileImageFile_file = request.FILES['profileImageFile']
            file_contents = profileImageFile_file.read()
            # Generate the filename for the new profile image
            new_filename = f"{employee.name}_{employee.id}_profile.jpg"

            # Check if any existing profile images with the same filename exist
            existing_profileImageFile_files = fs.find({"filename": new_filename})
            
            # Delete all existing profile images with the same filename
            for existing_file in existing_profileImageFile_files:
                fs.delete(existing_file._id)
                print("Deleted Existing Profile Image:", existing_file._id)

            # Save the new profile image
            profileImageFile_file_id = fs.put(
                file_contents, filename=new_filename, employee_id=employee.id, employee_name=employee.name
            )

            # Print some information for debugging
            print("New Profile Image ID:", profileImageFile_file_id)
            print("New Profile Image Filename:", new_filename)
            print("Existing Profile Images:", list(existing_profileImageFile_files))

        # Delete existing proof file and insert the new proof file
        if 'proof' in request.FILES:
            proof_file = request.FILES['proof']
            file_contents1 = proof_file.read()
            existing_proof_file = fs.find_one({"employee_id": employee.id, "filename": employee.name + "_" + employee.id + "_proof.pdf"})
            if existing_proof_file:
                fs.delete(existing_proof_file._id)
            proof_file_id = fs.put(file_contents1, filename=employee.name + "_" + employee.id + "_proof.pdf", employee_id=employee.id, employee_name=employee.name)
        # Delete existing certificates file and insert the new certificates file
        # Extract degrees information
        degrees = data.get("degrees", [])
        certificates_files = request.FILES.getlist("certificates", [])
        # Iterate over degrees and corresponding certificates
        for index, degree in enumerate(degrees):
            certificates_file = certificates_files[index] if index < len(certificates_files) else None
            if certificates_file:
                file_contents2 = certificates_file.read()
                certificates_filename = f'{employee.name}_{employee.id}_{degree}_certificates.pdf'
                existing_certificates_file = fs.find_one({"employee_id": employee.id, "filename": certificates_filename})
                if existing_certificates_file:
                    fs.delete(existing_certificates_file._id)
                certificates_file_id = fs.put(file_contents2, filename=certificates_filename, employee_id=employee.id, employee_name=employee.name)
                # Save certificates file information in the database
                db.fs.files.insert_one({
                    'certificates_id': str(certificates_file_id),
                    'employee_name': employee.name,
                    'employee_id': employee.id,
                    'degree': degree,
                })
        # Delete existing form 11 file and insert the new form 11 file
        if 'uploadFile' in request.FILES:
            uploadFile_file = request.FILES['uploadFile']
            file_contents3 = uploadFile_file.read()
            existing_uploadFile_file = fs.find_one({"employee_id": employee.id, "filename": employee.name + "_" + employee.id + "_uploadFile.pdf"})
            if existing_uploadFile_file:
                fs.delete(existing_uploadFile_file._id)
            uploadFile_file_id = fs.put(file_contents3, filename=employee.name + "_" + employee.id + "_uploadFile.pdf", employee_id=employee.id, employee_name=employee.name)
        employee.save()
        return Response("Updated Successfully")


# Search Employee

# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
class EmployeeSearchView(APIView):
    """
    API view for searching employees based on various criteria.

    This view supports PUT requests to search for employees using a key, which can be an ID, name, mobile number,
    designation, or address.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's a search functionality.
    """

    @csrf_exempt
    def put(self, request):
        """
        Handle PUT requests to search for employees.

        Args:
            request (HttpRequest): The HTTP request object containing the search key in the request data.

        Returns:
            Response: JSON response containing the details of the matched employees.
        """
        data = request.data

        # Perform a search based on various criteria using the provided key
        user = Employee.objects.filter(
            Q(id=int(data["key"])) |
            Q(name=data["key"]) |
            Q(mobile=data["key"]) |
            Q(designation=data["key"]) |
            Q(address=data["key"])
        ).values()

        # Serialize the matched employee data
        serializer = EmployeeShowSerializer(user, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)

# Admincalendar data get method


class AdminCalendarView(APIView):
    """
    API view for retrieving calendar data related to admin logins.

    This view supports GET requests to retrieve calendar data associated with admin logins.
    The view is exempt from CSRF protection as it is a read-only operation.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's a read-only operation.
    """

    @csrf_exempt
    def get(self, request):
        """
        Handle GET requests to retrieve calendar data related to admin logins.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: JSON response containing the calendar data for admin logins.
        """
        # Fetch all calendar data related to admin logins
        calendar_data = Admincalendarlogin.objects.all()

        # Serialize the calendar data
        serializer = CalendarSerializer(calendar_data, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)

# Admincalendar For Login


class AdmincalendarloginView(APIView):
    """
    API view for creating calendar data related to admin logins.

    This view supports POST requests to add calendar data associated with admin logins.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's a data creation operation.
    """

    @csrf_exempt
    def post(self, request):
        """
        Handle POST requests to add calendar data related to admin logins.

        Args:
            request (HttpRequest): The HTTP request object containing the calendar data.

        Returns:
            Response: JSON response indicating the success or failure of adding calendar data.
        """
        data = request.data

        # Create a serializer instance with the provided data
        serializer = AdmincalendarSerializer(data=request.data)

        # Validate the serializer, raising an exception for any validation errors
        serializer.is_valid(raise_exception=True)

        # Save the validated data using the serializer
        serializer.save()

        # Provide a success response
        response_data = 'Calendar data has been added successfully'
        return Response(response_data, status=status.HTTP_200_OK)

# Admincalendar For Logout


class AdmincalendarlogoutView(APIView):
    """
    API view for updating calendar data related to admin logouts.

    This view supports PUT requests to update calendar data associated with admin logouts.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's an update operation.
    """

    @csrf_exempt
    def put(self, request, *args, **kwargs):
        """
        Handle PUT requests to update calendar data related to admin logouts.

        Args:
            request (HttpRequest): The HTTP request object containing the updated calendar data.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            Response: JSON response indicating the success or failure of updating calendar data.
        """
        data = request.data

        # Retrieve the corresponding Admincalendarlogin instance based on the provided ID and date
        user = Admincalendarlogin.objects.get(id=data["id"], date=data["date"])

        # Update the attributes of the Admincalendarlogin instance with the provided data
        user.name = data["name"]
        user.end = data["end"]
        user.date = data["date"]
        user.earlyLogout = data["earlyLogout"]

        # Save the updated Admincalendarlogin instance
        user.save()

        # Provide a success response
        response_data = Logout
        return Response(response_data, status=status.HTTP_200_OK)

# Retrieve Data By Designation
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
class RetriveEmpBydepartment(APIView):
    """
    API view for retrieving employees based on department.

    This view supports POST requests to retrieve employees based on the specified department.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's a read-only operation.
    """

    @csrf_exempt
    def post(self, request):
        """
        Handle POST requests to retrieve employees based on the specified department.

        Args:
            request (HttpRequest): The HTTP request object containing the department data.

        Returns:
            Response: JSON response containing the employee data based on the department.
        """
        data = request.data

        # Retrieve employees based on the specified department
        employees_by_department = Employee.objects.filter(department=data["department"]).values()

        # Serialize the retrieved employee data
        serializer = EmployeeShowbydepartmentSerializer(employees_by_department, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)
    



# Retrieve Designation Count (Donut chart get method)
# This view retrieves the count of employees for each designation and returns it in a serialized format.
class RetriveEmpdepartmentCount(APIView):
    """
    API view for retrieving the count of employees in each department.

    This view supports GET requests to retrieve the count of employees in each department.

    Attributes:
        csrf_exempt: Exempt this view from CSRF protection since it's a read-only operation.
    """

    @csrf_exempt
    def get(self, request):
        """
        Handle GET requests to retrieve the count of employees in each department.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: JSON response containing the count of employees in each department.
        """
        # Retrieve the count of employees in each department
        emp_department_count = Employee.objects.values("department").annotate(value=Count('department')).order_by()

        # To Count Designation and name it as label and dumps the data into json_object
        for department in emp_department_count:
            department["label"] = department.pop("department")
            json_object = json.dumps(department)

        # Print the result (for debugging purposes)
        # print(emp_department_count)

        # Serialize the retrieved department count data
        serializer = EmployeedepartmentSerializer(emp_department_count, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)

# Retrieve Calendar data By Id


# Retrieve Calendar data By Id (Calendar Events for working days)
# This view retrieves the calendar login details of an employee with a specific ID and month and
# calculates their work hours and overtime.
class RetrieveCalendarDataById(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        # print("data:", data)
        employeelist = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"], year=data['year']).values()
        # Adding 1 to every id (103 as 1031,1032) to avoid duplicate id error in calendar
        i = 1
        for employee in employeelist:
            emp_id = f"{employee['id']}{i}"
            i += 1
            # Calculating worked hours of an employee
            start_time = employee['start']
            end_time = employee['end']
            hour = end_time - start_time
            employee['hour'] = hour
            # Getting 8 hr default by timedelta to calculate overtime
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            # If the employee done overtime the barcolor should be red
            if hour > t2:
                employee['barColor'] = 'red'
            else:
                employee['barColor'] = 'blue'
            # Check if leavetype is null or not
            if employee['leavetype'] is None:
                employee['text'] = 'Event'
            else:
                # If leavetype is 'CL' or 'SL', set text accordingly
                if employee['leavetype'] == 'CL':
                    employee['text'] = 'CL'
                    employee['barColor'] = 'green'
                elif employee['leavetype'] == 'SL':
                    employee['text'] = 'SL'
                    employee['barColor'] = 'yellow'
            # Add 'text' key to employee dictionary if it doesn't exist
            if 'text' not in employee:
                employee['text'] = "Event"
            employee["id"] = emp_id
        serializers = HourcalendarSerializer(employeelist, many=True)
        return Response(serializers.data)

# Retrieve Summary details


class Summary(APIView):
    @ csrf_exempt
    def post(self, request):
        data = request.data
        employeedata = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"]).values()

        # Calculating working days (finding len of the employeedata query)
        def workingdays():
            return len(employeedata)

        # Calculating leave days (finding missing dates using dataframe)

        def leavedays():
            data = employeedata.values("date")
            df = pd.DataFrame(data)
            df = df.set_index("date")
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            # print(todayDate)
            start_date = todayDate.replace(day=1)
            # print("start",start_date)
            end_date = todayDate
            # print(end_date)
            xy = pd.date_range(
                start=start_date, end=end_date).difference(df.index)
            return len(xy)

        # Calculating Overtime and overtime details
        overtime = 0
        overtime_dates = []
        overtime_hours = []
        # worked_hours = 0
        for employee in employeedata:
            date = employee["date"]
            start_time = employee['start']
            end_time = employee['end']
            hour = end_time - start_time
            # print(hour)
            employee['hour'] = hour
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            if hour > t2:
                employee['barColor'] = 'red'
                overtime += 1
                overtime_dates.append(date)

                overtime_hours = hour - t2
            #    worked_hours = hour - overtime_hours
            else:
                employee['barColor'] = 'blue'
        # Calculating leave dates (finding missing dates using dataframe)
        overime_dates_string = "\n".join(
            date.strftime("%Y-%m-%d") for date in overtime_dates)

        # leavedays="0"
        def leavedates():
            data = employeedata.values("date")
            df = pd.DataFrame(data)
            df = df.set_index("date")
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            start_date = todayDate.replace(day=1)
            end_date = todayDate
            xy = pd.date_range(
                start=start_date, end=end_date).difference(df.index)
            leave_dates = " ".join(date.strftime("%Y-%m-%d") for date in xy)
            return leave_dates

        for employee in employeedata:
            employee["overtime"] = overtime
            employee["workingdays"] = workingdays()
            employee["leavedays"] = leavedays()
            employee["overtimedate"] = overime_dates_string
            employee["leavedates"] = leavedates()
            employee['overtimehours'] = overtime_hours
            employee["workedhours"] = hour
        serializers = SummarySerializer(employeedata, many=True)
        return Response(serializers.data)
# Export Calendar Details


class RetriveEmployeeexport(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp_data = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"], year=data["year"]).values()
        emp_details = []
        for employee in emp_data:
            id = employee["id"]
            name = employee["name"]
            date = employee["date"]
            month = employee["month"]
            start_time = employee["start"]
            end_time = employee["end"]
            shift = employee["shift"]
            leavetype = employee["leavetype"]
            if start_time is None or end_time is None:
                continue  # skip this employee if start_time or end_time is None
            hour = end_time - start_time
            # print(hour)
            break_hours = Breakhours.objects.filter(
                id=id, date=date).values("Breakhour")
            if break_hours:
                break_hours = break_hours[0]["Breakhour"]
            else:
                break_hours = 0
            overtime_hours = timedelta(0)
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            if hour > timedelta(hours=8):
                overtime_hours = hour - t2
                print(overtime_hours)
            worked_hours = hour - overtime_hours
            if leavetype is None or leavetype.lower() == "none":
                leavetype = "Present"  # set leavetype to "Present" if it is None or "None"
                worked_days = 1  # set worked_days to 1 if leavetype is "Present"
            else:
                worked_days = 0
            emp_details.append({
                "id": id,
                "name": name,
                "date": date,
                "start": employee["start"],
                "end": employee["end"],
                "month": employee["month"],
                "shift": employee["shift"],
                "workeddays": worked_days,
                "workedhours": str(worked_hours),
                "Breakhour": str(break_hours),
                "overtimehours": str(overtime_hours),
                "Total_hours_worked": str(hour),
                "leavetype": leavetype
            })
        # Serialize the employee details list and return the response
        serializer = EmployeeexportSerializer(emp_details, many=True)
        return Response(serializer.data)
# Export Calendar Details

# Export Calendar Details (Summary export for download outside the calendar(Employee details))
# This view is for exporting overall employee details per month
# Export Calendar Details (Summary export for download outside the calendar(Employee details))
# This view is for exporting overall employee details per month

class RetriveSummaryExport(APIView):
    def post(self, request):
        data = request.data
        month = data["month"]
        year = data["year"]
        selected_department = data.get("department", "")

        emp_data = Admincalendarlogin.objects.filter(Q(month=month) & Q(year=year)).values()
        emp_ids = emp_data.values_list("name", flat=True).distinct()

        queryset = Employee.objects.none()
        if selected_department:
            queryset = queryset.filter(department=selected_department)

        emp_details = []
        for emp_id in emp_ids:
            emp_id_split = emp_id.split("_")
            name = emp_id_split[0] if len(emp_id_split) >= 1 else None
            employee = Employee.objects.filter(name=name).first()
            id = employee.id if employee else None

            working_days = 0
            loss_of_pay = 0
            overtime_days = 0
            total_weekoff = 0
            weekoff_used = 0
            cl_taken = 0
            sl_taken = 0

            for employee in emp_data.filter(name=emp_id):
                if employee["leavetype"] == "none":
                    start_time = employee["start"]
                    end_time = employee["end"]
                    hour = end_time - start_time
                    if hour > timedelta(hours=8):
                        overtime_days += (hour - timedelta(hours=8)).total_seconds() / 3600

                    if start_time.weekday() == 6:
                        working_days += 1
                        weekoff_used += 1
                    else:
                        working_days += 1
                elif employee["leavetype"] == "CL":
                    cl_taken += 1
                elif employee["leavetype"] == "SL":
                    sl_taken += 1

            days_in_month = calendar.monthrange(year, month)[1]
            month_calendar = calendar.monthcalendar(year, month)
            total_sundays = sum(1 for week in month_calendar if week[6] != 0)
            month_days = calendar.monthrange(year, month)[1]
            today = datetime.date.today()
            if month == today.month and year == today.year:
                month_days = today.day

            total_weekoff += total_sundays
            remaining_weekoff = total_weekoff - weekoff_used
            current_date = datetime.date.today().day
            # print("current_date:",current_date )
           # Include weekoffs until the current date
            weekoff_until_current_date = min(current_date, remaining_weekoff)
            # print("@@@:",weekoff_until_current_date)
            loss_of_pay = current_date - (working_days + cl_taken + sl_taken + weekoff_until_current_date)

            # print("current_date:", current_date)
            # print("loss_of_pay:", loss_of_pay)

            if id:
                emp_det = Employee.objects.filter(id=id).values('department', 'designation')
                if emp_det:
                    department = emp_det[0]['department']
                    designation = emp_det[0]['designation']
                else:
                    department = None
                    designation = None
            else:
                department = None
                designation = None

            if not selected_department or department == selected_department:
                payable_days = working_days + cl_taken + sl_taken
                paid_leave_days = cl_taken + sl_taken

                emp_dict = {
                    "id": id,
                    "name": name,
                    "month": month,
                    "year": year,
                    "department": department,
                    "designation": designation,
                    "workingdays": working_days,
                    "overtimedays": overtime_days,
                    "CL_Taken": cl_taken,
                    "SL_Taken": sl_taken,
                    "loss_of_pay": loss_of_pay,
                    "total_weekoff": total_weekoff,
                    "weekoff_used": weekoff_used,
                    "remaining_weekoff": remaining_weekoff,
                    "Days_in_a_month": days_in_month,
                    "payable_days": payable_days,
                    "paid_leave_days": paid_leave_days
                }

                emp_details.append(emp_dict)

        serializer = SummaryexportSerializer(emp_details, many=True)
        return Response(serializer.data)

class BreakhoursView(APIView):
    """
    API view for handling Breakhours-related operations.

    This view supports POST requests to save Breakhours data.

    Attributes:
        None
    """

    @csrf_exempt
    def post(self, request):
        """
        Handle POST requests to save Breakhours data.

        Args:
            request (HttpRequest): The HTTP request object containing Breakhours data.

        Returns:
            Response: JSON response indicating the status of the operation.
        """
        data = request.data

        # Validate the Breakhours data using the serializer
        serializer = BreakhoursSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the validated Breakhours data
        serializer.save()

        # Response data (assuming Login is a placeholder, you may need to replace it with appropriate data)
        response_data = 'Login'

        # Return the response
        return Response(response_data, status=status.HTTP_200_OK)


class BreakhourslogoutView(APIView):
    """
    API view for handling Breakhours logout-related operations.

    This view supports POST requests to update Breakhours data during logout.

    Attributes:
        None
    """

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to update Breakhours data during logout.

        Args:
            request (HttpRequest): The HTTP request object containing Breakhours logout data.
            *args, **kwargs: Additional arguments and keyword arguments.

        Returns:
            Response: JSON response indicating the status of the operation.
        """
        data = request.data

        # Retrieve Breakhours object based on provided id and date
        user = Breakhours.objects.get(id=data["id"], date=data["date"])

        # Update Breakhours data with logout information
        user.name = data["name"]
        user.lunchEnd = data["lunchEnd"]
        user.date = data["date"]
        lunch_start = user.lunchstart

        # Convert lunch start and end times to datetime objects for calculating the break duration
        start_datetime = datetime.datetime.strptime(lunch_start, '%Y-%m-%d %I:%M %p')
        end_datetime = datetime.datetime.strptime(user.lunchEnd, '%Y-%m-%d %I:%M %p')
        difference = end_datetime - start_datetime

        # Update Breakhour field with the calculated break duration
        user.Breakhour = difference

        # Save the updated Breakhours data
        user.save()

        # Response data (assuming Logout is a placeholder, you may need to replace it with appropriate data)
        response_data = {'lunchStart': lunch_start, 'logout': 'Logout', 'Breakhour': str(difference)}

        # Return the response
        return Response(response_data, status=status.HTTP_200_OK)



class RetriveBreakhours(APIView):
    """
    API view for retrieving Breakhours data.

    This view supports POST requests to retrieve Breakhours data based on provided id and date.

    Attributes:
        None
    """

    @csrf_exempt
    def post(self, request):
        """
        Handle POST requests to retrieve Breakhours data.

        Args:
            request (HttpRequest): The HTTP request object containing Breakhours retrieval parameters.

        Returns:
            Response: JSON response containing Breakhours data.
        """
        data = request.data

        # Query Breakhours data based on provided id and date
        Empbreak = Breakhours.objects.filter(id=data["id"], date=data["date"]).values()

        # Serialize the retrieved Breakhours data
        serializer = BreakhoursSerializer(Empbreak, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)
# Email


@csrf_exempt
def send_email(request):
    data = json.loads(request.body)
    subject = data['subject']
    message = data['message']
    recipient = data['recipient']
    # get list of CC recipients from data or empty string if not provided
    cc_recipients = data.get('cc', 'parthipanmurugan335317@gmail.com')
    from_email = 'parthibansmrft@gmail.com'
    signature = 'Contact Us, \n Shanmuga Hospital, \n 24, Saradha College Road,\n Salem-636007 Tamil Nadu,\n 8754033833,\n info@shanmugahospital.com,\n https://shanmugahospital.com/'

    recipient_list = [recipient]  # start with primary recipient
    if cc_recipients:
        # add CC recipients to the list
        recipient_list += cc_recipients.split(',')

    send_mail(subject, message + '\n\n\n\n\n' + signature,
              from_email, recipient_list, fail_silently=False)
    return JsonResponse({'message': 'Email sent successfully'})

# Whatsapp using Twilio


@csrf_exempt
def send_whatsapp(request):
    """
    View to send a WhatsApp message using the Twilio API.

    This view handles a POST request to send a WhatsApp message using the Twilio API.

    Args:
        request (HttpRequest): The HTTP request object containing the message content and recipient.

    Returns:
        HttpResponse: An HTTP response indicating the status of the WhatsApp message sending process.
    """
    # Twilio account SID and auth token
    account_sid = 'ACe1d37f2342c44648499add958166abe2'
    auth_token = 'c6ff1b2f81b4fcac652d4d71fce766a2'

    # Parse the request body to get message content and recipient
    data = json.loads(request.body)
    message = data['message']
    to = data['to']

    # Signature for the WhatsApp message
    signature = 'Contact Us, \n Shanmuga Hospital, \n 24, Saradha College Road,\n Salem-636007 Tamil Nadu,\n 8754033833,\n info@shanmugahospital.com,\n https://shanmugahospital.com/'

    # Initialize Twilio client
    client = Client(account_sid, auth_token)

    # Send the WhatsApp message
    client.messages.create(
        to=to,
        from_='whatsapp:+14155238886',
        body=message + "\n\n" + signature
    )

    return HttpResponse("WhatsApp message sent successfully")


...
@csrf_exempt
def get_file(request):
    """
    View to retrieve a file from MongoDB GridFS.

    This view handles GET requests to retrieve a file from MongoDB GridFS based on the provided filename.

    Args:
        request (HttpRequest): The HTTP request object containing the filename to retrieve.

    Returns:
        HttpResponse: An HTTP response containing the file contents or a 404 error if the file is not found.
    """
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
    db = client['data']
    fs = GridFS(db)

    # Get the filename from the request parameters
    filename = request.GET.get('filename')

    # Find the file in MongoDB GridFS
    file = fs.find_one({"filename": filename})

    if file is not None:
        # Return the file contents as an HTTP response
        response = HttpResponse(file.read())
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment; filename=%s' % file.filename
        return response
    else:
        # Return a 404 error if the file is not found
        return HttpResponse(status=404)





from datetime import timedelta
class RetrieveEmployeehours(APIView):
    def post(self, request):
        data = request.data
        day = data.get("day")
        month = data.get("month")
        year = data.get("year")
        emp_id = data.get("id")
        if emp_id and month and year and not day:  # Check if only emp_id, month, and year are provided
            emp_data = Admincalendarlogin.objects.filter(Q(id=emp_id) & Q(month=month) & Q(year=year)).values()
            emp_totlatelogin = timedelta()  # initialize the total late login time for this employee to zero
            emp_Totalearlylogouttime = timedelta()  # initialize the total early logout time for this employee to zero
            for record in emp_data:
                # extract the time from the "latelogin" field and add it to the employee's total
                if record['latelogin']:
                    latelogin_time = timedelta(hours=record['latelogin'].hour, minutes=record['latelogin'].minute, seconds=record['latelogin'].second)
                    emp_totlatelogin += latelogin_time
                # extract the time from the "earlyLogout" field and add it to the employee's total
                if record['earlyLogout']:
                    earlylogout_time = timedelta(hours=record['earlyLogout'].hour, minutes=record['earlyLogout'].minute, seconds=record['earlyLogout'].second)
                    emp_Totalearlylogouttime += earlylogout_time
                # calculate the sum of total late login and early logout time and store in a new field
                record['totallatelogin'] = str(emp_totlatelogin)
                record['Totalearlylogouttime'] = str(emp_Totalearlylogouttime)
                record['totlateearlyhours'] = str(emp_totlatelogin + emp_Totalearlylogouttime)
                # get the department and designation fields from the Employee model and add them to the record
                employee = Employee.objects.get(id=emp_id)
                record['department'] = employee.department
                record['designation'] = employee.designation
            serializer = EmployeeHoursSerializer(emp_data, many=True)
        elif emp_id and day and month and year:  # Check if emp_id, day, month, and year are provided
            emp_data = Admincalendarlogin.objects.filter(Q(id=emp_id) & Q(day=day) & Q(month=month) & Q(year=year)).values(
                'id', 'name', 'month', 'year', 'date', 'day', 'latelogin', 'earlyLogout'
            )
            for record in emp_data:
                emp_totlatelogin = timedelta()
                emp_Totalearlylogouttime = timedelta()
                if record['latelogin']:
                    latelogin_time = timedelta(hours=record['latelogin'].hour, minutes=record['latelogin'].minute, seconds=record['latelogin'].second)
                    emp_totlatelogin += latelogin_time
                if record['earlyLogout']:
                    earlylogout_time = timedelta(hours=record['earlyLogout'].hour, minutes=record['earlyLogout'].minute, seconds=record['earlyLogout'].second)
                    emp_Totalearlylogouttime += earlylogout_time
                record['totallatelogin'] = str(emp_totlatelogin)
                record['Totalearlylogouttime'] = str(emp_Totalearlylogouttime)
                record['totlateearlyhours'] = str(emp_totlatelogin + emp_Totalearlylogouttime)
                employee = Employee.objects.get(id=emp_id)
                record['department'] = employee.department  # Fetch 'department' from Employee model
                record['designation'] = employee.designation  # Fetch 'designation' from Employee model
            serializer = EmployeeHoursdaySerializer(emp_data, many=True)
        else:
            return Response("Insufficient or incorrect data provided")
        return Response(serializer.data)

    # Retrieve Break Hours
# This view retrieves the break login and logout time for break details


class RetrieveBreak(APIView):
    @csrf_exempt
    def get(self, request):
        current_date = datetime.date.today()
        # get the department parameter from the request query params
        department = request.GET.get('department')
        employees = Employee.objects.all()
        if department:  # check if department is present in the query params
            # filter employees based on the selected department
            employees = employees.filter(department=department)
        emp_breaks = Breakhours.objects.filter(date=current_date)
        # Get the list of employee IDs that are currently on break
        emp_ids_on_break = [emp.id for emp in emp_breaks]
        # Remove employees whose break duration has ended
        for emp in emp_breaks:
            if emp.Breakhour != "0":
                emp_ids_on_break.remove(emp.id)
        # Filter the employees based on whether they are on break or not
        employees_on_break = Employee.objects.filter(id__in=emp_ids_on_break)
        # Get the list of employee IDs that have logged in today
        employee_logins = Admincalendarlogin.objects.filter(
            date=current_date).values()
        emp_ids_logged_in = [emp['id'] for emp in employee_logins]
        # Filter the employees based on whether they are on break or not
        employees_on_break = employees.filter(id__in=emp_ids_on_break)
        # Filter the employees based on whether they have logged in today or not
        employees_not_on_break = employees.exclude(id__in=emp_ids_on_break)
        employees_not_on_break = employees_not_on_break.exclude(
            id__in=emp_ids_logged_in)
        # Filter the employees based on whether they are active or not
        employees_active = employees.filter(id__in=emp_ids_logged_in)
        # Create a dictionary to store employee IDs and their corresponding lunch start times
        emp_lunch_starts = {}
        for emp in emp_breaks:
            if emp.id in emp_ids_on_break:
                emp_lunch_starts[emp.id] = emp.lunchstart
        # Create a list of dictionaries to store employee details along with their lunch start times
        emp_details_on_break = []
        for emp in employees_on_break:
            emp_dict = EmployeeShowSerializer(emp).data
            lunch_start = emp_lunch_starts.get(emp.id)
            break_start_time = datetime.datetime.strptime(
                lunch_start, "%Y-%m-%d %I:%M %p")
            emp_dict["break_start_time"] = datetime.datetime.strftime(
                break_start_time, "%I:%M %p")
            emp_details_on_break.append(emp_dict)
        # Create a list of dictionaries for employees not on break
        emp_details_not_on_break = []
        for emp in employees_not_on_break:
            emp_dict = EmployeeShowSerializer(emp).data
            emp_details_not_on_break.append(emp_dict)
        # Create a list of dictionaries for active employees
        emp_details_active = []
        for emp in employees_active:
            emp_dict = EmployeeShowSerializer(emp).data
            emp_details_active.append(emp_dict)
        # Return a response containing the three lists: employees on break, employees not on break but active, and employees not on break and not active
        response_data = {
            "employees_on_break": emp_details_on_break,
            "employees_active": emp_details_active,
            "employees_not_active": emp_details_not_on_break
        }
        return Response(response_data)





from dateutil import parser
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
class UploadEmployeeData(APIView):
    def post(self, request, *args, **kwargs):
        try:
            employees_data = request.data.get('employees', [])
            employees_df = pd.DataFrame(employees_data)
            # Map DataFrame column names to corresponding model field names
            field_mapping = {
                'id': 'id',
                'name': 'name',
                'Gender': 'Gender',
                'dob': 'dob',
                'age': 'age',
                'Maritalstatus': 'Maritalstatus',
                'mobile': 'mobile',
                'department': 'department',
                'RNRNO': 'RNRNO',
                'TNMCNO': 'TNMCNO',
                'ValidlityDate': 'ValidlityDate',
                'email': 'email',
                'dateofjoining': 'dateofjoining',
                'bankaccnum': 'bankaccnum',
                'designation': 'designation',
                'Aadhaarno': 'Aadhaarno',
                'PanNo': 'PanNo',
                'BloodGroup': 'BloodGroup',
                'address': 'address',
                'languages': 'languages',
                'salary': 'salary',
                'PF': 'PF',
                'ESINO': 'ESINO',
                'employmentCategory': 'employmentCategory',
                'employeeType': 'employeeType',
                'medicalClaimPolicyNo': 'medicalClaimPolicyNo',
                'validityDateFrom': 'validityDateFrom',
                'validityDateTo': 'validityDateTo',
                'bankName': 'bankName',
                'ifscCode': 'ifscCode',
                'companyEmail': 'companyEmail',
                'reportedBy': 'reportedBy',
            }
            # Loop through the DataFrame and create Employee objects
            for index, row in employees_df.iterrows():
                # Create a dictionary for Employee object using mapped field names
                employee_fields = {}
                for data_frame_column, model_field in field_mapping.items():
                    if data_frame_column in row.index:
                        # Handle date parsing separately
                        if model_field in ['dob', 'dateofjoining', 'validityDateFrom', 'validityDateTo']:
                            value = row[data_frame_column]
                            if pd.notna(value):
                                try:
                                    # Convert integer to string before parsing
                                    if isinstance(value, int):
                                        value = str(value)
                                    employee_fields[model_field] = parser.isoparse(value)
                                except ValueError:
                                    employee_fields[model_field] = None
                            else:
                                employee_fields[model_field] = None
                        else:
                            # Check if the value is blank and set it to None if it is
                            value = row[data_frame_column]
                            if pd.isnull(value) or (isinstance(value, str) and value.strip() == ''):
                                employee_fields[model_field] = None
                            else:
                                employee_fields[model_field] = value
                    else:
                        employee_fields[model_field] = None
                # Print the employee fields for debugging
                print("Employee Fields:", employee_fields)
                # Create the Employee object with the dynamically obtained fields
                Employee.objects.create(**employee_fields)
            return Response("Employees uploaded successfully", status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
