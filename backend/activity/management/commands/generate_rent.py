from django.core.management.base import BaseCommand
from activity.models import StudentProfile, Rent
from datetime import date
from dateutil.relativedelta import relativedelta

class Command(BaseCommand):
    help = 'Generate monthly rent for all students with active room allocation'

    def handle(self, *args, **options):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        due_date = first_day_of_month + relativedelta(days=9) # Due on 10th

        students = StudentProfile.objects.filter(current_bed__isnull=False)
        count = 0

        for student in students:
            # Check if rent already exists for this student and month
            if not Rent.objects.filter(student=student, month=first_day_of_month).exists():
                Rent.objects.create(
                    student=student,
                    amount=student.current_bed.room.rent_amount,
                    month=first_day_of_month,
                    due_date=due_date,
                    status='unpaid'
                )
                count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully generated {count} rent records for {first_day_of_month.strftime("%B %Y")}'))
