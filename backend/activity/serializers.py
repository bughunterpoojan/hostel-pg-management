from rest_framework import serializers
from .models import StudentProfile, Document, Rent, Payment, Complaint, LeaveApplication
from accounts.serializers import UserSerializer
from hostel.serializers import BedSerializer

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class RentSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Rent
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'

class LeaveApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)

    class Meta:
        model = LeaveApplication
        fields = '__all__'

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    current_bed_details = BedSerializer(source='current_bed', read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    rents = RentSerializer(many=True, read_only=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'
