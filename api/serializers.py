from django.contrib.auth.models import User
from rest_framework import serializers

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    dob = serializers.DateField(required=False, allow_null=True, write_only=True)
    mobile = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'dob', 'mobile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        dob = validated_data.pop('dob', None)
        mobile = validated_data.pop('mobile', '')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, dob=dob, mobile=mobile)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    trips_planned = serializers.SerializerMethodField()
    favourite_destinations = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'username',
            'email',
            'dob',
            'mobile',
            'trips_planned',
            'favourite_destinations',
        ]

    def get_trips_planned(self, obj):
        return obj.user.trips.count()

    def get_favourite_destinations(self, obj):
        destinations = (
            obj.user.trips.values_list('destination__name', flat=True).distinct()[:5]
        )
        return list(destinations)


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name']


class WeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherForecast
        fields = ['temperature', 'condition', 'humidity', 'wind_speed']


class DestinationSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    weather = WeatherForecastSerializer(read_only=True)

    class Meta:
        model = Destination
        fields = [
            'id',
            'name',
            'category',
            'description',
            'places',
            'duration_days',
            'budget',
            'rating',
            'image',
            'activities',
            'weather',
        ]


class HotelSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)

    class Meta:
        model = Hotel
        fields = [
            'id',
            'name',
            'destination',
            'destination_name',
            'price_per_night',
            'rating',
            'image',
        ]


class BudgetSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id',
            'travel_cost',
            'hotel_cost',
            'food_cost',
            'activity_cost',
            'total',
        ]


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = ['id', 'item_name', 'is_checked']


class TripSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)
    budget_detail = BudgetSerializer(read_only=True)
    checklist_items = ChecklistItemSerializer(many=True, read_only=True)
    activities = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'destination',
            'destination_name',
            'hotel',
            'hotel_name',
            'days',
            'budget',
            'travel_type',
            'status',
            'created_at',
            'budget_detail',
            'checklist_items',
            'activities',
        ]
        read_only_fields = ['user', 'status', 'created_at']

    def get_activities(self, obj):
        return list(obj.destination.activities.values_list('name', flat=True))


class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['destination', 'days', 'budget', 'travel_type', 'hotel']


class PlannerRequestSerializer(serializers.Serializer):
    destination = serializers.CharField()
    days = serializers.IntegerField(min_value=1)
    budget = serializers.DecimalField(max_digits=10, decimal_places=2)
    travel_type = serializers.ChoiceField(choices=['solo', 'family', 'friends'])


class BudgetCalculateSerializer(serializers.Serializer):
    travel_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    hotel_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    food_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    activity_cost = serializers.DecimalField(max_digits=10, decimal_places=2)


class TravelJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelJournal
        fields = ['id', 'trip', 'title', 'notes', 'image', 'created_at']
        read_only_fields = ['user', 'created_at']
