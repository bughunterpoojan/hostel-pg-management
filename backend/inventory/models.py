from django.db import models
from hostel.models import Room

class Inventory(models.Model):
    CONDITION_CHOICES = (
        ('new', 'New'),
        ('good', 'Good'),
        ('damaged', 'Damaged'),
        ('missing', 'Missing'),
    )
    item_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    room = models.ForeignKey(Room, related_name='inventory', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.item_name} ({self.quantity})"
