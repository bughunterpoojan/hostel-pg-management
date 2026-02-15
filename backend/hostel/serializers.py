from rest_framework import serializers
from .models import Hostel, Floor, Room, Bed

class BedSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room.number', read_only=True)
    room_type = serializers.CharField(source='room.get_room_type_display', read_only=True)
    floor_number = serializers.IntegerField(source='room.floor.number', read_only=True)
    hostel_name = serializers.CharField(source='room.floor.hostel.name', read_only=True)

    class Meta:
        model = Bed
        fields = ['id', 'room', 'room_number', 'room_type', 'floor_number', 'hostel_name', 'identifier', 'is_occupied']

class RoomSerializer(serializers.ModelSerializer):
    beds = BedSerializer(many=True, read_only=True)
    
    class Meta:
        model = Room
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = '__all__'

class HostelSerializer(serializers.ModelSerializer):
    floors = FloorSerializer(many=True, read_only=True)

    class Meta:
        model = Hostel
        fields = '__all__'
