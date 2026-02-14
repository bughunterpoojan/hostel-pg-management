from rest_framework import serializers
from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room.number', read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'
