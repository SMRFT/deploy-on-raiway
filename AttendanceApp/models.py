from dataclasses import fields
from distutils.command.upload import upload
from pickle import TRUE
from turtle import title
from unittest.util import _MAX_LENGTH
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from gridfs_storage.storage import GridFSStorage
from django.utils import timezone



import datetime
import uuid



# Employee

gridfs_storage = GridFSStorage()

# Employee model (Add employee model)
class Employee(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    name = models.CharField(max_length=500)
    Gender = models.CharField(max_length=10)
    dob = models.CharField(max_length=500,blank=True, null=True)
    age = models.CharField(max_length=500,blank=True, null=True)
    Maritalstatus = models.CharField(max_length=10,blank=True)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    RNRNO = models.IntegerField(blank=True, null=True)
    TNMCNO = models.CharField(max_length=500, blank=True, null=True)
    ValidlityDate = models.DateField(blank=True, null=True)
    email = models.CharField(max_length=500,blank=True)
    dateofjoining = models.CharField(max_length=500,blank=True)
    bankaccnum = models.IntegerField(blank=True)
    designation = models.CharField(max_length=500)
    Aadhaarno = models.CharField(max_length=500)
    PanNo = models.CharField(max_length=500,blank=True)
    BloodGroup = models.CharField(max_length=500,blank=True)
    address = models.CharField(max_length=500)
    educationData = models.CharField(max_length=1200,blank=True, null=True)
    experienceData = models.CharField(max_length=1200,blank=True, null=True)
    referenceData = models.CharField(max_length=1200,blank=True, null=True)
    languages = models.CharField(max_length=1200,blank=True, null=True)
    salary = models.IntegerField(blank=True, null=True)
    PF=models.CharField(blank=True,null=True,max_length=500)
    ESINO=models.CharField(blank=True,null=True,max_length=500)
    employmentCategory=models.CharField(max_length=500)
    employeeType=models.CharField(max_length=500)
    medicalClaimPolicyNo=models.CharField(max_length=500,blank=True, null=True)
    validityDateFrom=models.DateField(blank=True, null=True)
    validityDateTo=models.DateField(blank=True, null=True)
    bankName=models.CharField(max_length=500)
    ifscCode=models.CharField(max_length=500)
    companyEmail=models.CharField(max_length=500,blank=True, null=True)
    assetDetails=models.CharField(max_length=1000,blank=True, null=True)
    reportedBy=models.CharField(max_length=1000,blank=True, null=True)
    experience=models.CharField(max_length=1000,blank=True, null=True)
    yearsOfExperience=models.CharField(max_length=1000,blank=True, null=True)


class DeletedEmployee(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    name = models.CharField(max_length=500)
    email = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    deleted_at = models.DateField()
    designation = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    educationData = models.CharField(max_length=1200)
    experienceData = models.CharField(max_length=1200)
    referenceData = models.CharField(max_length=1200)
    languages = models.CharField(max_length=500, blank=True)
    Aadhaarno = models.CharField(max_length=500)
    PanNo = models.CharField(max_length=500, blank=True, null=True)
    BloodGroup = models.CharField(max_length=500)
    RNRNO = models.IntegerField(blank=True, null=True)
    TNMCNO = models.CharField(max_length=500, blank=True, null=True)
    ValidlityDate = models.DateField(blank=True, null=True)
    dateofjoining = models.CharField(max_length=500, blank=True, null=True)
    bankaccnum = models.IntegerField(blank=True, null=True)
    salary = models.IntegerField(blank=True, null=True)

# Admin Login
from bson import ObjectId
class ObjectIdField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 24  # ObjectId is typically 24 characters long
        kwargs['primary_key'] = True
        kwargs['editable'] = False
        kwargs['default'] = str(ObjectId())
        super(ObjectIdField, self).__init__(*args, **kwargs)
    
    def pre_save(self, model_instance, add):
        if add and not getattr(model_instance, self.attname):
            setattr(model_instance, self.attname, str(ObjectId()))
        return super(ObjectIdField, self).pre_save(model_instance, add)
    
class Admin(AbstractUser):
    name = models.CharField(max_length=500)
    email = models.EmailField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    role = models.CharField(max_length=100,)
    mobile = models.CharField(max_length=100, blank=True, null=True)

    
    # You can specify 'id' explicitly
    id = ObjectIdField()
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    def __str__(self):
        return self.email

class PasswordResetRequest(models.Model):
    email = models.EmailField()
    reset_code = models.CharField(max_length=6)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

class Designation(models.Model):
    label = models.CharField(max_length=500)
    value = models.IntegerField()

# department count details model (Donut chart)

class department(models.Model):
    label = models.CharField(max_length=500)
    value = models.IntegerField()



# Employee model by department (Donut chart)

class Employeebydepartment(models.Model):
    id = models.CharField(max_length=500,primary_key=True)
    name = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
# Employee model by Designation


class Employeebydesignation(models.Model):
    id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    designation = models.CharField(max_length=500, primary_key=True)
    address = models.CharField(max_length=500)

# Calendar Model


class Admincalendarlogin(models.Model):
    id = models.CharField(max_length=500)
    iddate = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    start = models.DateTimeField()
    end = models.DateTimeField()
    month = models.IntegerField()
    year = models.IntegerField()
    shift = models.CharField(max_length=500)
    date = models.DateField()
    day = models.IntegerField()
    leavetype = models.CharField(max_length=500)
    latelogin = models.TimeField()
    earlyLogout = models.TimeField()

# Event calendar model


class Hour(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    start = models.DateTimeField()
    end = models.DateTimeField()
    month = models.IntegerField()
    date = models.DateField()
    barColor = models.CharField(max_length=500)
    text = models.CharField(max_length=500)
    leavetype = models.CharField(max_length=500)
    
# Summary calendar model


class Summary(models.Model):
    id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    month = models.IntegerField(primary_key=True)
    workingdays = models.IntegerField()
    leavedays = models.IntegerField()
    overtime = models.IntegerField()
    overtimedate = models.DateField()
    leavedates = models.DateField()
    overtimehours = models.CharField(max_length=500)
    workedhours = models.CharField(max_length=500)

# Employee calendar export model for single employee




class Employeeexport(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    date = models.DateField()
    month = models.IntegerField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    shift = models.CharField(max_length=500)
    workedhours = models.CharField(max_length=500)
    Breakhour = models.CharField(max_length=500)
    overtimehours = models.CharField(max_length=500)
    Total_hours_worked = models.CharField(max_length=500)
    leavetype = models.CharField(max_length=500)
# Employee calendar export model for all the employee


class Summaryexport(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    month = models.IntegerField()
    year = models.IntegerField()
    department = models.CharField(max_length=500)
    designation = models.CharField(max_length=500)
    workingdays = models.IntegerField()
    overtimedays = models.IntegerField()
    CL_Taken = models.IntegerField()
    SL_Taken = models.IntegerField()
    loss_of_pay = models.IntegerField()
    total_weekoff = models.IntegerField()
    weekoff_used = models.IntegerField()


class Breakhours(models.Model):
    id = models.CharField(max_length=500)
    iddate = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    lunchstart = models.CharField(max_length=500)
    lunchEnd = models.CharField(max_length=500)
    date = models.DateField()
    Breakhour = models.CharField(max_length=500)


class EmployeeHours(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    month = models.IntegerField()
    year = models.IntegerField()
    date = models.DateField()
    day = models.IntegerField()
    latelogin = models.TimeField()
    earlyLogout = models.TimeField()
    totallatelogin = models.TimeField()
    Totalearlylogouttime = models.TimeField()
    totlateearlyhours = models.TimeField()
    department = models.CharField(max_length=500)
    designation = models.CharField(max_length=500)


class UserPermission(models.Model):
    role = models.CharField(max_length=100)
    employee = models.BooleanField(default=False)
    add_employee = models.BooleanField(default=False)
    dashboard = models.BooleanField(default=False)
    pending_approval = models.BooleanField(default=False)
    admin_registration = models.BooleanField(default=False)

class EmployeeExitForm(models.Model):
    name = models.CharField(max_length=500)
    id = models.CharField(max_length=500, primary_key=True)
    department = models.CharField(max_length=500)
    exitStatus = models.CharField(max_length=500)
    lastWorkingDate = models.CharField(max_length=500)