from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HostelViewSet, FloorViewSet, RoomViewSet, BedViewSet

router = DefaultRouter()
router.register(r'hostels', HostelViewSet)
router.register(r'floors', FloorViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'beds', BedViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
