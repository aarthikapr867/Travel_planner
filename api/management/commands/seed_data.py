from decimal import Decimal

from django.core.management.base import BaseCommand

from api.models import Activity, Destination, Hotel, WeatherForecast


class Command(BaseCommand):
    help = 'Seed initial travel data matching the React frontend'

    def handle(self, *args, **options):
        self.stdout.write('Seeding travel data...')

        destinations_data = [
            {
                'name': 'Kodaikanal',
                'category': 'mountain',
                'description': 'Hill station in Tamil Nadu with lakes and forests.',
                'places': 'Coaker\'s Walk, Kodai Lake, Pine Forest',
                'duration_days': 3,
                'budget': Decimal('8000'),
                'rating': Decimal('5.0'),
                'activities': ["Coaker's Walk", 'Kodai Lake', 'Pine Forest'],
                'weather': {
                    'temperature': Decimal('22.0'),
                    'condition': 'Cloudy',
                    'humidity': 70,
                    'wind_speed': Decimal('10.0'),
                },
                'hotels': [
                    {
                        'name': 'Hill View Resort',
                        'price_per_night': Decimal('2500'),
                        'rating': Decimal('5.0'),
                    },
                ],
            },
            {
                'name': 'Ooty',
                'category': 'mountain',
                'description': 'Queen of hill stations in Tamil Nadu.',
                'places': 'Botanical Garden, Ooty Lake, Doddabetta',
                'duration_days': 2,
                'budget': Decimal('6000'),
                'rating': Decimal('4.0'),
                'activities': ['Botanical Garden', 'Ooty Lake', 'Doddabetta Peak'],
                'weather': {
                    'temperature': Decimal('18.0'),
                    'condition': 'Misty',
                    'humidity': 75,
                    'wind_speed': Decimal('8.0'),
                },
                'hotels': [
                    {
                        'name': 'Lake Side Hotel',
                        'price_per_night': Decimal('2000'),
                        'rating': Decimal('4.0'),
                    },
                ],
            },
            {
                'name': 'Goa',
                'category': 'beach',
                'description': 'Popular beach destination on the west coast.',
                'places': 'Goa, Maldives, Pondicherry',
                'duration_days': 4,
                'budget': Decimal('15000'),
                'rating': Decimal('5.0'),
                'activities': ['Beach Walk', 'Water Sports', 'Fort Aguada'],
                'weather': {
                    'temperature': Decimal('30.0'),
                    'condition': 'Sunny',
                    'humidity': 65,
                    'wind_speed': Decimal('12.0'),
                },
                'hotels': [
                    {
                        'name': 'Beach Paradise Resort',
                        'price_per_night': Decimal('3500'),
                        'rating': Decimal('4.5'),
                    },
                ],
            },
            {
                'name': 'Maldives',
                'category': 'beach',
                'description': 'Tropical island paradise.',
                'places': 'Maldives',
                'duration_days': 5,
                'budget': Decimal('50000'),
                'rating': Decimal('5.0'),
                'activities': ['Snorkeling', 'Island Hopping', 'Sunset Cruise'],
                'weather': {
                    'temperature': Decimal('28.0'),
                    'condition': 'Sunny',
                    'humidity': 80,
                    'wind_speed': Decimal('15.0'),
                },
                'hotels': [],
            },
            {
                'name': 'Pondicherry',
                'category': 'beach',
                'description': 'French colonial charm by the sea.',
                'places': 'Pondicherry',
                'duration_days': 2,
                'budget': Decimal('5000'),
                'rating': Decimal('4.0'),
                'activities': ['French Quarter Walk', 'Beach Visit', 'Auroville'],
                'weather': {
                    'temperature': Decimal('29.0'),
                    'condition': 'Partly Cloudy',
                    'humidity': 72,
                    'wind_speed': Decimal('11.0'),
                },
                'hotels': [],
            },
            {
                'name': 'Manali',
                'category': 'mountain',
                'description': 'Adventure hub in Himachal Pradesh.',
                'places': 'Manali',
                'duration_days': 4,
                'budget': Decimal('12000'),
                'rating': Decimal('4.5'),
                'activities': ['Solang Valley', 'Rohtang Pass', 'Old Manali'],
                'weather': {
                    'temperature': Decimal('15.0'),
                    'condition': 'Cold',
                    'humidity': 60,
                    'wind_speed': Decimal('14.0'),
                },
                'hotels': [],
            },
            {
                'name': 'Delhi',
                'category': 'historical',
                'description': 'Capital city with rich history.',
                'places': 'Delhi, Agra, Jaipur',
                'duration_days': 3,
                'budget': Decimal('10000'),
                'rating': Decimal('4.0'),
                'activities': ['Red Fort', 'India Gate', 'Qutub Minar'],
                'weather': {
                    'temperature': Decimal('25.0'),
                    'condition': 'Hazy',
                    'humidity': 55,
                    'wind_speed': Decimal('9.0'),
                },
                'hotels': [],
            },
            {
                'name': 'Agra',
                'category': 'historical',
                'description': 'Home of the Taj Mahal.',
                'places': 'Agra',
                'duration_days': 1,
                'budget': Decimal('4000'),
                'rating': Decimal('4.5'),
                'activities': ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh'],
                'weather': {
                    'temperature': Decimal('27.0'),
                    'condition': 'Clear',
                    'humidity': 50,
                    'wind_speed': Decimal('7.0'),
                },
                'hotels': [],
            },
            {
                'name': 'Jaipur',
                'category': 'historical',
                'description': 'The Pink City of Rajasthan.',
                'places': 'Jaipur',
                'duration_days': 2,
                'budget': Decimal('7000'),
                'rating': Decimal('4.5'),
                'activities': ['Amber Fort', 'Hawa Mahal', 'City Palace'],
                'weather': {
                    'temperature': Decimal('32.0'),
                    'condition': 'Hot',
                    'humidity': 45,
                    'wind_speed': Decimal('6.0'),
                },
                'hotels': [],
            },
        ]

        for data in destinations_data:
            destination, created = Destination.objects.update_or_create(
                name=data['name'],
                defaults={
                    'category': data['category'],
                    'description': data['description'],
                    'places': data['places'],
                    'duration_days': data['duration_days'],
                    'budget': data['budget'],
                    'rating': data['rating'],
                },
            )

            for activity_name in data['activities']:
                Activity.objects.get_or_create(
                    destination=destination,
                    name=activity_name,
                )

            WeatherForecast.objects.update_or_create(
                destination=destination,
                defaults=data['weather'],
            )

            for hotel_data in data['hotels']:
                Hotel.objects.update_or_create(
                    destination=destination,
                    name=hotel_data['name'],
                    defaults={
                        'price_per_night': hotel_data['price_per_night'],
                        'rating': hotel_data['rating'],
                    },
                )

            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {destination.name}')

        self.stdout.write(self.style.SUCCESS('Seed data loaded successfully.'))
