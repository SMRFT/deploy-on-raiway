from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from AttendanceApp.models import Employee, DeletedEmployee
from AttendanceApp.serializers import EmployeeSerializer
from rest_framework.response import Response
from django.utils import timezone
from AttendanceApp.serializers import DeletedEmployeeSerializer
from django.core.mail import send_mail
from rest_framework import status
# from .models import Employee, DeletedEmployee
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class DeleteEmp(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp = Employee.objects.get(id=data["id"])
        emp_name = emp.name
        emp_id=emp.id
        emp_department=emp.department
        emp_email=emp.email
        emp_mobile=emp.mobile
        emp_designation=emp.designation
        emp_Address=emp.address
        emp_salary=emp.salary
        emp_educationData =emp.educationData
        emp_experienceData=emp.experienceData
        emp_referenceData=emp.referenceData
        emp_languages =emp.languages
        emp_Aadhaarno=emp.Aadhaarno
        emp_PanNo=emp.PanNo
        emp_BloodGroup=emp.BloodGroup
        emp_RNRNO=emp.RNRNO
        emp_TNMCNO =emp.TNMCNO
        emp_ValidlityDate=emp.ValidlityDate
        emp_dateofjoining =emp.dateofjoining
        emp_bankaccnum =emp.bankaccnum
        emp.delete()
        emp_RNRNO = emp.RNRNO if emp.RNRNO != '' else None
        deleted_emp = DeletedEmployee(
            name=emp_name,
            id=emp_id,
            email=emp_email,
            department=emp_department,
            mobile =emp_mobile ,
            designation=emp_designation,
            address=emp_Address,
            educationData =emp.educationData,
            experienceData=emp.experienceData,
            referenceData=emp.referenceData,
            languages =emp.languages ,
            Aadhaarno=emp.Aadhaarno,
            PanNo=emp.PanNo,
            BloodGroup=emp.BloodGroup,
            RNRNO=emp_RNRNO,
            TNMCNO =emp.TNMCNO,
            ValidlityDate=emp.ValidlityDate,
            dateofjoining =emp.dateofjoining,
            bankaccnum =emp.bankaccnum,
            salary=emp.salary,
            deleted_at=timezone.now()
        )
        deleted_emp.save()
        # Send email to HR
        subject = f"Employee Deleted - {emp_name}"
        message = f"The employee {emp_name} has been deleted from the system."
        from_email = "parthibansmrft@gmail.com"
        recipient_list = ["parthibansmrft@gmail.com"]
        send_mail(subject, message, from_email, recipient_list)
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeletedEmployeeList(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        employees = DeletedEmployee.objects.all()
        serializer = DeletedEmployeeSerializer(employees, many=True)
        return Response(serializer.data)

class PermanentDeleteEmp(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp = DeletedEmployee.objects.get(id=data["id"])
        # print(emp)
        emp.delete()
        return JsonResponse({'message': 'Employee deleted successfully.'})

class RestoreEmployee(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    @csrf_exempt
    def post(self, request):
        data = request.data
        deleted_employee = DeletedEmployee.objects.get(id=data["id"])
        employee = Employee(id=deleted_employee.id,
                            name=deleted_employee.name,
                            email=deleted_employee.email,
                            department=deleted_employee.department,
                            mobile=deleted_employee.mobile,
                            designation=deleted_employee.designation,
                            address=deleted_employee.address,
                            educationData =deleted_employee.educationData,
                            experienceData=deleted_employee.experienceData,
                            referenceData=deleted_employee.referenceData,
                            languages =deleted_employee.languages ,
                            Aadhaarno=deleted_employee.Aadhaarno,
                            PanNo=deleted_employee.PanNo,
                            BloodGroup=deleted_employee.BloodGroup,
                            RNRNO=deleted_employee.RNRNO,
                            TNMCNO =deleted_employee.TNMCNO,
                            ValidlityDate=deleted_employee.ValidlityDate,
                            dateofjoining =deleted_employee.dateofjoining,
                            bankaccnum =deleted_employee.bankaccnum,
                            salary=deleted_employee.salary)
        employee.save()
        deleted_employee.delete()
        return JsonResponse({'message': 'Employee restored successfully.'})

