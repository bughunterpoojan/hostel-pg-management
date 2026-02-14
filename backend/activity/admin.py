from django.contrib import admin
from .models import StudentProfile, Document, Rent, Payment, Complaint, LeaveApplication

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_bed', 'is_verified']
    list_filter = ['is_verified']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['student', 'doc_type', 'status', 'uploaded_at']
    list_filter = ['status', 'doc_type']

@admin.register(Rent)
class RentAdmin(admin.ModelAdmin):
    list_display = ['student', 'amount', 'month', 'status']
    list_filter = ['status', 'month']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['rent', 'transaction_id', 'amount', 'status', 'payment_date']
    list_filter = ['status']

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['title', 'student', 'assigned_to', 'status', 'created_at']
    list_filter = ['status', 'assigned_to']

@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'start_date', 'end_date', 'status']
    list_filter = ['status']
