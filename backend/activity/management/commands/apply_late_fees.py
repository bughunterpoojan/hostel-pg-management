from django.core.management.base import BaseCommand
from activity.models import Rent
from datetime import date
from decimal import Decimal

class Command(BaseCommand):
    help = 'Apply late fees to overdue unpaid rent records'

    def handle(self, *args, **options):
        today = date.today()
        # Find unpaid rents where due date has passed and late fee is not yet applied
        overdue_rents = Rent.objects.filter(
            status='unpaid', 
            due_date__lt=today,
            late_fee=0
        )
        
        count = 0
        LATE_FEE_AMOUNT = Decimal('200.00') # Fixed late fee

        for rent in overdue_rents:
            rent.late_fee = LATE_FEE_AMOUNT
            rent.save()
            count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully applied late fees to {count} overdue rent records.'))
