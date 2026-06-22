from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile'
    )
    dob = models.DateField(null=True, blank=True)
    mobile = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username


class Destination(models.Model):
    CATEGORY_CHOICES = [
        ('beach', 'Beaches'),
        ('mountain', 'Mountains'),
        ('historical', 'Historical Places'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    places = models.CharField(max_length=255, blank=True, help_text='Comma-separated places')
    duration_days = models.PositiveIntegerField(default=3)
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Activity(models.Model):
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='activities'
    )
    name = models.CharField(max_length=150)

    def __str__(self):
        return f'{self.name} ({self.destination.name})'


class Hotel(models.Model):
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='hotels'
    )
    name = models.CharField(max_length=150)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Trip(models.Model):
    TRAVEL_TYPE_CHOICES = [
        ('solo', 'Solo'),
        ('family', 'Family'),
        ('friends', 'Friends'),
    ]
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips'
    )
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='trips'
    )
    hotel = models.ForeignKey(
        Hotel, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips'
    )
    days = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    travel_type = models.CharField(max_length=20, choices=TRAVEL_TYPE_CHOICES, default='solo')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.destination.name} - {self.user.username}'


class Budget(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='budget_detail')
    travel_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    hotel_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    food_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    activity_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def total(self):
        return self.travel_cost + self.hotel_cost + self.food_cost + self.activity_cost

    def __str__(self):
        return f'Budget for {self.trip}'


class ChecklistItem(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='checklist_items')
    item_name = models.CharField(max_length=100)
    is_checked = models.BooleanField(default=False)

    class Meta:
        ordering = ['item_name']

    def __str__(self):
        return self.item_name


class TravelJournal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journals'
    )
    trip = models.ForeignKey(
        Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='journals'
    )
    title = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    image = models.ImageField(upload_to='journals/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class WeatherForecast(models.Model):
    destination = models.OneToOneField(
        Destination, on_delete=models.CASCADE, related_name='weather'
    )
    temperature = models.DecimalField(max_digits=5, decimal_places=1)
    condition = models.CharField(max_length=50)
    humidity = models.PositiveIntegerField()
    wind_speed = models.DecimalField(max_digits=5, decimal_places=1)

    def __str__(self):
        return f'{self.destination.name} - {self.temperature}°C'
