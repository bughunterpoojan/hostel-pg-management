from rest_framework import viewsets, permissions
from .models import Hostel, Floor, Room, Bed
from .serializers import HostelSerializer, FloorSerializer, RoomSerializer, BedSerializer

class IsManagerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'manager'

class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsManagerOrReadOnly]

class FloorViewSet(viewsets.ModelViewSet):
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer
    permission_classes = [IsManagerOrReadOnly]

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsManagerOrReadOnly]

    def perform_create(self, serializer):
        room = serializer.save()
        # Automatically create beds based on capacity
        for i in range(room.capacity):
            identifier = chr(65 + i) # A, B, C...
            Bed.objects.create(room=room, identifier=identifier)

class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    permission_classes = [IsManagerOrReadOnly]
