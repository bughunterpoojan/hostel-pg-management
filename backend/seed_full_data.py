import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hostel.models import Hostel, Floor, Room, Bed
from inventory.models import Inventory
from activity.models import StudentProfile, Complaint, LeaveApplication

User = get_user_model()

def seed_full_data():
    print("🚀 Starting full data seeding...")

    # 1. Ensure Manager User
    manager, _ = User.objects.get_or_create(
        username="manager_user",
        defaults={"role": "manager"}
    )
    manager.set_password("pass123")
    manager.save()

    # 2. Ensure Staff User
    staff, _ = User.objects.get_or_create(
        username="staff_user",
        defaults={"role": "staff"}
    )
    staff.set_password("pass123")
    staff.save()

    # 3. Ensure Student User
    student_user, _ = User.objects.get_or_create(
        username="student_user",
        defaults={"role": "student"}
    )
    student_user.set_password("pass123")
    student_user.save()

    # 4. Hostel, Floors, Rooms (Recycle logic from previous seed)
    hostel, _ = Hostel.objects.get_or_create(
        name="Hostel Alpha",
        defaults={"address": "123 Main St", "description": "Primary Hostel"}
    )
    
    floor, _ = Floor.objects.get_or_create(hostel=hostel, number=1)
    
    room1, _ = Room.objects.get_or_create(
        floor=floor, number="101",
        defaults={"room_type": "single", "rent_amount": 5000, "capacity": 1}
    )
    bed1, _ = Bed.objects.get_or_create(room=room1, identifier="A")

    room2, _ = Room.objects.get_or_create(
        floor=floor, number="102",
        defaults={"room_type": "double", "rent_amount": 4000, "capacity": 2}
    )
    bed2, _ = Bed.objects.get_or_create(room=room2, identifier="A")
    bed3, _ = Bed.objects.get_or_create(room=room2, identifier="B")

    # 5. Inventory Seeding
    print("📦 Seeding Inventory...")
    inventory_items = [
        {"item_name": "Single Bed Frame", "quantity": 10, "condition": "new", "description": "Standard steel frame"},
        {"item_name": "Study Table", "quantity": 15, "condition": "good", "description": "Wooden finish"},
        {"item_name": "Ceiling Fan", "quantity": 8, "condition": "good", "description": "Bajaj 1200mm"},
        {"item_name": "LED Bulb 9W", "quantity": 20, "condition": "new", "description": "Philips"},
    ]
    for item in inventory_items:
        Inventory.objects.get_or_create(item_name=item["item_name"], defaults=item)
    
    # Associate some inventory with a room
    Inventory.objects.get_or_create(
        item_name="Chair", room=room1, 
        defaults={"quantity": 1, "condition": "good", "description": "Plastic chair"}
    )

    # 6. Student Profile Seeding
    print("👤 Seeding Student Profile...")
    student_profile, _ = StudentProfile.objects.get_or_create(
        user=student_user,
        defaults={"address": "Sample Address", "current_bed": bed1, "is_verified": True}
    )
    bed1.is_occupied = True
    bed1.save()

    # 7. Activity Seeding (Complaints & Leaves)
    print("📝 Seeding Activity (Complaints & Leaves)...")
    
    # Complaints
    Complaint.objects.get_or_create(
        student=student_profile,
        title="Fan making noise",
        defaults={
            "description": "The ceiling fan in room 101 is making a clicking sound.",
            "status": "pending"
        }
    )
    Complaint.objects.get_or_create(
        student=student_profile,
        title="Wi-Fi signal weak",
        defaults={
            "description": "Cannot connect to Wi-Fi from the corner of the room.",
            "status": "in_progress",
            "assigned_to": staff
        }
    )

    # Leaves
    LeaveApplication.objects.get_or_create(
        student=student_profile,
        start_date=date.today() + timedelta(days=5),
        end_date=date.today() + timedelta(days=10),
        defaults={
            "reason": "Going home for festival.",
            "status": "pending"
        }
    )

    print("✅ All sample data seeded successfully! 🚀")

if __name__ == "__main__":
    seed_full_data()
