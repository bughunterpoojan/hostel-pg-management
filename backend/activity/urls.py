from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentProfileViewSet, DocumentViewSet, RentViewSet, 
    PaymentViewSet, ComplaintViewSet, LeaveApplicationViewSet,
    generate_invoice_pdf
)

router = DefaultRouter()
router.register(r'profiles', StudentProfileViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'rents', RentViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'complaints', ComplaintViewSet)
router.register(r'leaves', LeaveApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-invoice/<int:rent_id>/', generate_invoice_pdf, name='generate_invoice_pdf'),
]
