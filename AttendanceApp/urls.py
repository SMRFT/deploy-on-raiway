from calendar import calendar
import imp
from pickle import FROZENSET
# from django.conf.urls import url
from django.urls import path, include
from AttendanceApp import views
from AttendanceApp.Views.deteteemp import DeleteEmp, DeletedEmployeeList, PermanentDeleteEmp, RestoreEmployee
from AttendanceApp.Views.adminview import EmployeeView, AdminLogin,admin_registration , UserDetails,upload_file,aws_config_view,send_reset_code,reset_password,activate_account
from AttendanceApp.Views.retrieveemp import EmployeeEditView, RetriveEmp, EmployeeSearchView, RetriveEmpById, AdminCalendarView, AdmincalendarloginView, AdmincalendarlogoutView, RetrieveCalendarDataById,  Summary, RetriveEmployeeexport, BreakhoursView, BreakhourslogoutView, RetriveSummaryExport, RetriveBreakhours, send_email, send_whatsapp, get_file, RetrieveEmployeehours,facial_recognition_view,RetriveEmpdepartmentCount,RetriveEmpBydepartment
from .views import EmployeeView
from AttendanceApp.Views.retrieveemp import RetrieveBreak
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path

# from .views import send_email
urlpatterns = [

    path('addemp/', EmployeeView.as_view(), name='addemp'),
    path('showemp', RetriveEmp.as_view()),
    path('showempById', RetriveEmpById.as_view()),
    path('delemp', DeleteEmp.as_view()),
    path('editemp', EmployeeEditView.as_view()),
    path('searchemployee', EmployeeSearchView.as_view()),
    path('adminreg/', admin_registration, name='admin_registration'),
    path('adminlog', AdminLogin.as_view()),
    path('admincalendar', AdminCalendarView.as_view()),
    path('admincalendarlogin', AdmincalendarloginView.as_view()),
    path('admincalendarlogout', AdmincalendarlogoutView.as_view()),
    path('EmpcalendarId', RetrieveCalendarDataById.as_view()),
    path('SummaryDetails', Summary.as_view()),
    path('EmployeeExport', RetriveEmployeeexport.as_view()),
    path('lunchhourslogin', BreakhoursView.as_view()),
    path('lunchhourslogout', BreakhourslogoutView.as_view()),
    path('EmployeeSummaryExport', RetriveSummaryExport.as_view()),
    path('breakhours', RetriveBreakhours.as_view()),
    path('send-email/', send_email, name='send_email'),
    path('send-whatsapp/', send_whatsapp, name='send_whatsapp'),
    path('upload_file/', upload_file, name='upload_file'),
    path('get_file', get_file, name='get_file'),
    path('breakdetails', RetrieveBreak.as_view()),
    path('Employeehours', RetrieveEmployeehours.as_view()),
    path("delete-employee", DeleteEmp.as_view()),
    path('deleted-employees/', DeletedEmployeeList.as_view()),
    path('permanentdelete', PermanentDeleteEmp.as_view()),
    path('restore-employee/', RestoreEmployee.as_view()),
    path("UserDetails", UserDetails.as_view()),
    path('aws-config/', aws_config_view, name='aws-config'),
    path('facial-recognition/', facial_recognition_view, name='recognize_faces'),
    path('showempdesignation', RetriveEmpdepartmentCount.as_view()),
    path('empbydesignation', RetriveEmpBydepartment.as_view()),
    path('send-reset-code/', send_reset_code, name='send_reset_code'),
    path('reset-password/', reset_password, name='reset-password'),
    # path('compare/',face_comparison_view, name='compare'),
    path('admin/register/', admin_registration, name='admin_registration'),
    path('activate/<str:uidb64>/<str:token>/', activate_account, name='activate_account'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
