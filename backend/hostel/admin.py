from django.contrib import admin
from .models import Hostel, Floor, Room, Bed

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ['name', 'address']

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ['number', 'hostel']
    list_filter = ['hostel']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['number', 'floor', 'room_type', 'rent_amount', 'capacity', 'is_available']
    list_filter = ['floor', 'room_type', 'is_available']

@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ['identifier', 'room', 'is_occupied']
    list_filter = ['room', 'is_occupied']
