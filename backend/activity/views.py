from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import StudentProfile, Document, Rent, Payment, Complaint, LeaveApplication
from .serializers import StudentProfileSerializer, DocumentSerializer, RentSerializer, PaymentSerializer, ComplaintSerializer, LeaveApplicationSerializer
from django.conf import settings
import razorpay
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'manager':
            return self.queryset
        return self.queryset.filter(user=user)

    @decorators.action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        profile = self.get_object()
        profile.is_verified = True
        profile.save()
        send_notification(profile.user, "Account Verified", "Your profile has been verified by the manager.")
        return Response({'status': 'verified'})

    @decorators.action(detail=True, methods=['post'])
    def unverify(self, request, pk=None):
        profile = self.get_object()
        profile.is_verified = False
        profile.save()
        send_notification(profile.user, "Account Unverified", "Your profile verification has been revoked. Please contact the manager.")
        return Response({'status': 'unverified'})

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'manager':
            return self.queryset
        return self.queryset.filter(student__user=user)

    def perform_create(self, serializer):
        student_profile = StudentProfile.objects.get(user=self.request.user)
        serializer.save(student=student_profile)

from django.core.mail import send_mail

def send_notification(user, subject, message):
    """Mock notification helper"""
    print(f"NOTIF to {user.email}: {subject} - {message}")
    # In production, use send_mail
    # send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

class RentViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all()
    serializer_class = RentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'manager':
            return self.queryset
        return self.queryset.filter(student__user=user)

    @decorators.action(detail=True, methods=['post'], url_path='create-payment')
    def create_payment(self, request, pk=None):
        rent = self.get_object()
        client = razorpay.Client(auth=(getattr(settings, 'RAZORPAY_KEY_ID', 'test'), getattr(settings, 'RAZORPAY_KEY_SECRET', 'test')))
        
        order_amount = int((rent.amount + rent.late_fee) * 100)
        order_currency = 'INR'
        order_receipt = f'rent_{rent.id}'
        
        try:
            razorpay_order = client.order.create({
                'amount': order_amount,
                'currency': order_currency,
                'receipt': order_receipt,
                'payment_capture': '1'
            })
            return Response(razorpay_order)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request, pk=None):
        rent = self.get_object()
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        client = razorpay.Client(auth=(getattr(settings, 'RAZORPAY_KEY_ID', 'test'), getattr(settings, 'RAZORPAY_KEY_SECRET', 'test')))

        try:
            # Verify signature
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            # Update rent and create payment record
            rent.status = 'paid'
            rent.save()
            
            Payment.objects.create(
                rent=rent,
                transaction_id=razorpay_payment_id,
                amount=rent.amount + rent.late_fee,
                status='captured',
                method='razorpay'
            )

            send_notification(rent.student.user, "Rent Payment Received", f"Your payment of ₹{rent.amount + rent.late_fee} has been confirmed.")

            return Response({'status': 'payment verification successful'})
        except Exception as e:
            print(f"PAYMENT VERIFICATION ERROR: {str(e)}")
            return Response({'error': f'Payment verification failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'manager':
            return self.queryset
        return self.queryset.filter(rent__student__user=user)

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'manager':
            return Complaint.objects.all()
        if user.role == 'staff':
            return Complaint.objects.filter(assigned_to=user)
        return Complaint.objects.filter(student__user=user)

    def perform_create(self, serializer):
        try:
            student_profile = StudentProfile.objects.get(user=self.request.user)
            serializer.save(student=student_profile)
        except StudentProfile.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'Student profile not found. Please complete your profile first.'})

class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'role') and self.request.user.role == 'manager':
            return LeaveApplication.objects.all()
        return self.queryset.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        print(f"DEBUG: Leave Create - Request Data: {self.request.data}")
        print(f"DEBUG: Leave Create - Validated Data: {serializer.validated_data}")
        try:
            student_profile = StudentProfile.objects.get(user=self.request.user)
            serializer.save(student=student_profile)
        except StudentProfile.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'Student profile not found. Please complete your profile first.'})

    def perform_update(self, serializer):
        print(f"DEBUG: Leave Update - Request Data: {self.request.data}")
        print(f"DEBUG: Leave Update - Validated Data: {serializer.validated_data}")
        instance = serializer.save()
        print(f"DEBUG: Leave Update - Final Status: {instance.status}")

@decorators.api_view(['GET'])
@decorators.permission_classes([permissions.IsAuthenticated])
def generate_invoice_pdf(request, rent_id):
    rent = get_object_or_404(Rent, id=rent_id)
    if request.user.role != 'manager' and rent.student.user != request.user:
        return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 800, "RENT INVOICE")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 770, f"Hostel: {rent.student.current_bed.room.floor.hostel.name if rent.student.current_bed else 'N/A'}")
    p.drawString(100, 755, f"Student: {rent.student.user.get_full_name() or rent.student.user.username}")
    p.drawString(100, 740, f"Month: {rent.month.strftime('%B %Y')}")
    p.drawString(100, 725, f"Date: {rent.created_at.strftime('%d-%m-%Y')}")
    
    p.line(100, 715, 500, 715)
    
    p.drawString(100, 690, "Description")
    p.drawString(400, 690, "Amount")
    
    p.drawString(100, 670, f"Monthly Rent for {rent.month.strftime('%B %Y')}")
    p.drawString(400, 670, f"INR {rent.amount}")
    
    if rent.late_fee > 0:
        p.drawString(100, 650, "Late Fee")
        p.drawString(400, 650, f"INR {rent.late_fee}")
        
    p.line(100, 640, 500, 640)
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, 620, "Total")
    p.drawString(400, 620, f"INR {rent.amount + rent.late_fee}")
    
    p.setFont("Helvetica", 10)
    p.drawString(100, 580, f"Status: {rent.get_status_display()}")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf', status=status.HTTP_200_OK)
