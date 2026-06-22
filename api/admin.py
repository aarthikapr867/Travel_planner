from django.contrib import admin

from .models import (
    Activity,
    Budget,
    ChecklistItem,
    Destination,
    Hotel,
    TravelJournal,
    Trip,
    UserProfile,
    WeatherForecast,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'mobile', 'dob']
    search_fields = ['user__username', 'user__email', 'mobile']


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'duration_days', 'budget', 'rating']
    list_filter = ['category']
    search_fields = ['name', 'places']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination']
    list_filter = ['destination']


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination', 'price_per_night', 'rating']
    list_filter = ['destination']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['destination', 'user', 'days', 'budget', 'travel_type', 'status']
    list_filter = ['status', 'travel_type']
    search_fields = ['destination__name', 'user__username']


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['trip', 'travel_cost', 'hotel_cost', 'food_cost', 'activity_cost']


@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ['item_name', 'trip', 'is_checked']
    list_filter = ['is_checked']


@admin.register(TravelJournal)
class TravelJournalAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'trip', 'created_at']
    search_fields = ['title', 'notes']


@admin.register(WeatherForecast)
class WeatherForecastAdmin(admin.ModelAdmin):
    list_display = ['destination', 'temperature', 'condition', 'humidity', 'wind_speed']
