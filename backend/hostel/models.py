from django.db import models

class Hostel(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Floor(models.Model):
    hostel = models.ForeignKey(Hostel, related_name='floors', on_delete=models.CASCADE)
    number = models.IntegerField()

    def __str__(self):
        return f"{self.hostel.name} - Floor {self.number}"

class Room(models.Model):
    ROOM_TYPES = (
        ('single', 'Single'),
        ('double', 'Double'),
        ('triple', 'Triple'),
    )
    floor = models.ForeignKey(Floor, related_name='rooms', on_delete=models.CASCADE)
    number = models.CharField(max_length=10)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPES)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Room {self.number} ({self.get_room_type_display()})"

class Bed(models.Model):
    room = models.ForeignKey(Room, related_name='beds', on_delete=models.CASCADE)
    identifier = models.CharField(max_length=10) # e.g., A, B, C
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.room.number} - Bed {self.identifier}"
