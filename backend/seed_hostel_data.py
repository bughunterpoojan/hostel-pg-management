import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hostel.models import Hostel, Floor, Room, Bed

def seed_data():
    print("Seeding sample hostel data...")
    
    # Create Hostel
    hostel, created = Hostel.objects.get_or_create(
        name="Hostel Alpha",
        defaults={
            "address": "123 Main St, Tech City",
            "description": "Premium student accommodation with modern amenities."
        }
    )
    if created:
        print(f"Created hostel: {hostel.name}")
    else:
        print(f"Hostel {hostel.name} already exists.")

    # Create Floors
    for i in range(1, 3):
        floor, f_created = Floor.objects.get_or_create(
            hostel=hostel,
            number=i
        )
        if f_created:
            print(f"Created Floor {i}")
            
            # Create Rooms for each floor
            for j in range(1, 4):
                room_number = f"{i}0{j}"
                room, r_created = Room.objects.get_or_create(
                    floor=floor,
                    number=room_number,
                    defaults={
                        "room_type": "double" if j % 2 == 0 else "single",
                        "rent_amount": 5000 + (i * 500),
                        "capacity": 2 if j % 2 == 0 else 1
                    }
                )
                if r_created:
                    print(f"Created Room {room_number}")
                    
                    # Create Beds
                    for k in range(room.capacity):
                        bed_id = chr(65 + k) # A, B
                        Bed.objects.get_or_create(
                            room=room,
                            identifier=bed_id
                        )
                        print(f"Created Bed {bed_id} in Room {room_number}")

    print("Seeding complete! 🚀")

if __name__ == "__main__":
    seed_data()
