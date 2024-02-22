from calendar import calendar
import imp
from pickle import FROZENSET
# from django.conf.urls import url
from django.urls import path, include
from AttendanceApp import views
from AttendanceApp.Views.deteteemp import DeleteEmp, DeletedEmployeeList, PermanentDeleteEmp, RestoreEmployee
from AttendanceApp.Views.adminview import EmployeeView, AdminLogin,admin_registration , UserDetails,upload_file,send_reset_code,reset_password,activate_account,GeneratePDF,user_permission,employee_events,get_employee_exit_form,submit_employee_exit_form,employee_events,get_aws_credentials,get_aws_credentials1
from AttendanceApp.Views.retrieveemp import EmployeeEditView, RetriveEmp, EmployeeSearchView, RetriveEmpById, AdminCalendarView, AdmincalendarloginView, AdmincalendarlogoutView, RetrieveCalendarDataById,  Summary, RetriveEmployeeexport, BreakhoursView, BreakhourslogoutView, RetriveSummaryExport, RetriveBreakhours, send_email, send_whatsapp, get_file, RetrieveEmployeehours,RetriveEmpdepartmentCount,RetriveEmpBydepartment,upload_aws_credentials
from AttendanceApp.Views.adminview import EmployeeView, AdminLogin,admin_registration , UserDetails,upload_file,send_reset_code,reset_password,activate_account,GeneratePDF,user_permission,employee_events,get_employee_exit_form,submit_employee_exit_form,employee_events
from AttendanceApp.Views.retrieveemp import EmployeeEditView,leave_request,approve_leave,reject_leave,calculate_payroll,send_logout_notification, RetriveEmp, EmployeeSearchView, RetriveEmpById, AdminCalendarView, AdmincalendarloginView, AdmincalendarlogoutView, RetrieveCalendarDataById,   Summary, RetriveEmployeeexport, BreakhoursView, BreakhourslogoutView, RetriveSummaryExport, RetriveBreakhours, send_email, send_whatsapp, get_file, RetrieveEmployeehours,RetriveEmpdepartmentCount,RetriveEmpBydepartment,UploadEmployeeData
from .views import EmployeeView
from AttendanceApp.Views.retrieveemp import RetrieveBreak
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
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
    # path('facial-recognition/', facial_recognition_view, name='recognize_faces'),
    path('showempdesignation', RetriveEmpdepartmentCount.as_view()),
    path('empbydesignation', RetriveEmpBydepartment.as_view()),
    path('send-reset-code/', send_reset_code, name='send_reset_code'),
    path('reset-password/', reset_password, name='reset-password'),
    # path('compare/',face_comparison_view, name='compare'),
    path('admin/register/', admin_registration, name='admin_registration'),
    path('activate/<str:uidb64>/<str:token>/', activate_account, name='activate_account'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('generate-pdf/<int:id>/', GeneratePDF.as_view(), name='generate_pdf'),
    path('userpermission/', user_permission, name='user_permission'), 
    path('attendance/userpermission/<str:role>/', user_permission, name='user_permission'),
    path('employee_events/', employee_events, name='employee_events'),
    path('submit-employee-exit-form/', submit_employee_exit_form, name='submit_employee_exit_form'),
    path('get-employee-exit-form/', get_employee_exit_form, name='get_employee_exit_form'),
    path('employee_events/', employee_events, name='employee_events'),
    path('upload-aws-credentials/', upload_aws_credentials, name='upload_aws_credentials'),
    path('get_aws_credentials/', get_aws_credentials, name='get_aws_credentials'),
    path('get_aws_credentials1/', get_aws_credentials, name='get_aws_credentials'),
    path('upload-employees/', UploadEmployeeData.as_view()),
    path('payroll_calculation/', calculate_payroll, name='payroll_calculation'),
    path('send_logout_notification/',send_logout_notification,name='send_logout_notification'),
    path('leave_request/', leave_request, name='leave_request'),
    path('approve_leave/', approve_leave, name='approve_leave'),
    path('reject_leave/', reject_leave, name='reject_leave'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
