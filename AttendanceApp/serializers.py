from curses.ascii import EM
from dataclasses import fields
from django import forms
from rest_framework import serializers
from AttendanceApp.models import Admincalendarlogin, LeaveRequest,Employee, Admin,  department, Employeebydepartment, Hour, Summary, Employeeexport, Summaryexport, Breakhours,EmployeeHours,DeletedEmployee,Employeebydepartment,department,PasswordResetRequest,UserPermission,AWSCredentials

class AWSCredentialsForm(forms.ModelForm):
    class Meta:
        model = AWSCredentials
        fields = ['access_key_id', 'secret_access_key', 'bucket_name', 's3_region']
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class DeletedEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeletedEmployee
        fields = '__all__'
        
class EmployeeShowSerializer(serializers.ModelSerializer):
    # imgSrc = serializers.ImageField(use_url=False)
    class Meta:
        model = Employee
        fields = ('id', 'name', 'mobile', 'designation', 'address', 'department', 'email', 'BloodGroup', 'educationData', 'experienceData', 'referenceData', 'Aadhaarno', 'PanNo', 'RNRNO', 'TNMCNO', 'ValidlityDate', 'dateofjoining',  'languages', 'bankaccnum', 'dob','age', 'Maritalstatus', 'Gender','salary','medicalClaimPolicyNo','validityDateFrom','validityDateTo','bankName','ifscCode','employmentCategory',"employeeType")
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'name', 'email', 'password', 'role', 'mobile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['is_active'] = False  # Set is_active to False initially

        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()

        # Generate an activation token for the user
        token = default_token_generator.make_token(instance)
        uid = urlsafe_base64_encode(force_bytes(instance.id))

        # Build the activation link
        activation_link = f"https://35.154.23.156:7000/attendance/activate/{uid}/{token}/"
        
        # Send an activation email to the user
        subject = 'Activate your account'
        message = f'Click the following link to activate your account: {activation_link}'
        from_email = settings.EMAIL_HOST_USER  # Set this to your email address
        to_email = instance.email
        send_mail(subject, message, from_email, [to_email], fail_silently=False)

        return instance
    
class PasswordResetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetRequest
        fields = '__all__'


class EmployeedesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model =  department
        fields = ('label', 'value')


class EmployeeShowbydesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeebydepartment
        fields = ('id', 'name', 'mobile', 'designation', 'address')

class EmployeedepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = department
        fields = ('label', 'value')


class EmployeeShowbydepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeebydepartment
        fields = '__all__'


class AdmincalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admincalendarlogin
        fields = '__all__'


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admincalendarlogin
        fields = '__all__'


class HourcalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hour
        fields = '__all__'


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = '__all__'


class EmployeeexportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeeexport
        fields = '__all__'


class SummaryexportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Summaryexport
        fields = '__all__'


class BreakhoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breakhours
        fields = '__all__'


class EmployeeHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model=EmployeeHours
        fields = '__all__'

class UserPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermission 
        fields = (
            'role',
            'employee',
            'add_employee',  
            'dashboard',
            'pending_approval',  
            'admin_registration',
        )



class EmployeeHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeHours
        fields = ('id', 'name', 'month', 'year', 'date', 'day', 'department','designation','latelogin', 'earlyLogout', 'totallatelogin', 'Totalearlylogouttime', 'totlateearlyhours')
class EmployeeHoursdaySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeHours
        fields = ('id', 'name', 'month', 'year', 'date', 'day', 'department','designation','latelogin', 'earlyLogout')


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = '__all__'
