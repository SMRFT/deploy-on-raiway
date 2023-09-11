from fractions import Fraction
from pickle import TRUE
from django.shortcuts import render

from AttendanceApp.Views.adminview import EmployeeView, AdminLogin
from AttendanceApp.Views.retrieveemp import RetriveEmp, RetriveEmpById, EmployeeEditView, EmployeeSearchView, AdminCalendarView, AdmincalendarloginView
from AttendanceApp.Views.deteteemp import DeleteEmp
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import requests
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


from django.http import JsonResponse



