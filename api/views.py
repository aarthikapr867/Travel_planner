from decimal import Decimal

from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import (
    Budget,
    ChecklistItem,
    Destination,
    Hotel,
    TravelJournal,
    Trip,
    UserProfile,
    WeatherForecast,
)
from .serializers import (
    BudgetCalculateSerializer,
    BudgetSerializer,
    ChecklistItemSerializer,
    DestinationSerializer,
    HotelSerializer,
    PlannerRequestSerializer,
    RegisterSerializer,
    TravelJournalSerializer,
    TripCreateSerializer,
    TripSerializer,
    UserProfileSerializer,
    UserSerializer,
    WeatherForecastSerializer,
)

DEFAULT_CHECKLIST_ITEMS = [
    'Clothes',
    'Mobile Charger',
    'Documents',
    'Medicines',
    'Camera',
    'Power Bank',
]


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.prefetch_related('activities', 'weather').all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(places__icontains=search)
            )
        if category:
            queryset = queryset.filter(category=category)

        return queryset

    @action(detail=False, methods=['get'], url_path='categories')
    def categories(self, request):
        categories = []
        for value, label in Destination.CATEGORY_CHOICES:
            destinations = Destination.objects.filter(category=value)
            categories.append({
                'category': value,
                'label': label,
                'destinations': DestinationSerializer(destinations, many=True).data,
            })
        return Response(categories)

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        featured = self.get_queryset().order_by('-rating')[:3]
        return Response(DestinationSerializer(featured, many=True).data)


class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hotel.objects.select_related('destination').all()
    serializer_class = HotelSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        destination_id = self.request.query_params.get('destination')
        destination_name = self.request.query_params.get('destination_name')

        if destination_id:
            queryset = queryset.filter(destination_id=destination_id)
        if destination_name:
            queryset = queryset.filter(destination__name__iexact=destination_name)

        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def book(self, request, pk=None):
        hotel = self.get_object()
        trip_id = request.data.get('trip_id')

        if trip_id:
            try:
                trip = Trip.objects.get(id=trip_id, user=request.user)
            except Trip.DoesNotExist:
                return Response(
                    {'detail': 'Trip not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            trip = Trip.objects.filter(
                user=request.user, destination=hotel.destination
            ).order_by('-created_at').first()

            if not trip:
                trip = Trip.objects.create(
                    user=request.user,
                    destination=hotel.destination,
                    days=hotel.destination.duration_days,
                    budget=hotel.destination.budget,
                    travel_type='solo',
                )

        trip.hotel = hotel
        trip.save(update_fields=['hotel'])

        return Response({
            'detail': f'Successfully booked {hotel.name}.',
            'trip': TripSerializer(trip).data,
        })


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).select_related(
            'destination', 'hotel'
        ).prefetch_related('budget_detail', 'checklist_items', 'destination__activities')

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return TripCreateSerializer
        return TripSerializer

    def perform_create(self, serializer):
        trip = serializer.save(user=self.request.user)
        Budget.objects.create(trip=trip)
        for item in DEFAULT_CHECKLIST_ITEMS:
            ChecklistItem.objects.create(trip=trip, item_name=item)

    @action(detail=False, methods=['get'], url_path='recommendations', permission_classes=[AllowAny])
    def recommendations(self, request):
        trips = Destination.objects.order_by('-rating')[:3]
        return Response(DestinationSerializer(trips, many=True).data)

    @action(detail=True, methods=['get'], url_path='summary')
    def summary(self, request, pk=None):
        trip = self.get_object()
        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'], url_path='confirm')
    def confirm(self, request, pk=None):
        trip = self.get_object()
        trip.status = 'confirmed'
        trip.save(update_fields=['status'])
        return Response({
            'detail': 'Trip confirmed successfully.',
            'trip': TripSerializer(trip).data,
        })


class ChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ChecklistItem.objects.filter(trip__user=self.request.user)
        trip_id = self.request.query_params.get('trip')
        if trip_id:
            queryset = queryset.filter(trip_id=trip_id)
        return queryset.select_related('trip')


class TravelJournalViewSet(viewsets.ModelViewSet):
    serializer_class = TravelJournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TravelJournal.objects.filter(user=self.request.user).select_related('trip')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='calculate')
    def calculate(self, request):
        serializer = BudgetCalculateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        total = (
            serializer.validated_data['travel_cost']
            + serializer.validated_data['hotel_cost']
            + serializer.validated_data['food_cost']
            + serializer.validated_data['activity_cost']
        )

        trip_id = request.data.get('trip_id')
        if trip_id:
            try:
                trip = Trip.objects.get(id=trip_id, user=request.user)
                budget, _ = Budget.objects.get_or_create(trip=trip)
                budget.travel_cost = serializer.validated_data['travel_cost']
                budget.hotel_cost = serializer.validated_data['hotel_cost']
                budget.food_cost = serializer.validated_data['food_cost']
                budget.activity_cost = serializer.validated_data['activity_cost']
                budget.save()
            except Trip.DoesNotExist:
                return Response(
                    {'detail': 'Trip not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response({
            'travel_cost': serializer.validated_data['travel_cost'],
            'hotel_cost': serializer.validated_data['hotel_cost'],
            'food_cost': serializer.validated_data['food_cost'],
            'activity_cost': serializer.validated_data['activity_cost'],
            'total': total,
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'user': UserSerializer(user).data, 'token': token.key},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({'detail': 'Successfully logged out.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    profile_obj, _ = UserProfile.objects.get_or_create(user=request.user)
    return Response(UserProfileSerializer(profile_obj).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_plan(request):
    serializer = PlannerRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    destination_name = serializer.validated_data['destination']
    days = serializer.validated_data['days']
    budget = serializer.validated_data['budget']
    travel_type = serializer.validated_data['travel_type']

    destination = Destination.objects.filter(name__iexact=destination_name).first()
    if not destination:
        destination = Destination.objects.filter(
            name__icontains=destination_name
        ).first()

    if not destination:
        return Response(
            {'detail': f'Destination "{destination_name}" not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    hotel = destination.hotels.order_by('price_per_night').first()
    hotel_cost = hotel.price_per_night * days if hotel else Decimal('0')
    travel_cost = budget * Decimal('0.3')
    food_cost = budget * Decimal('0.25')
    activity_cost = budget * Decimal('0.2')
    hotel_budget = min(hotel_cost, budget * Decimal('0.25'))

    plan = {
        'destination': DestinationSerializer(destination).data,
        'days': days,
        'budget': budget,
        'travel_type': travel_type,
        'recommended_hotel': HotelSerializer(hotel).data if hotel else None,
        'estimated_costs': {
            'travel_cost': travel_cost,
            'hotel_cost': hotel_budget,
            'food_cost': food_cost,
            'activity_cost': activity_cost,
            'total': travel_cost + hotel_budget + food_cost + activity_cost,
        },
        'checklist': DEFAULT_CHECKLIST_ITEMS,
        'activities': list(destination.activities.values_list('name', flat=True)),
    }

    if request.user.is_authenticated:
        trip = Trip.objects.create(
            user=request.user,
            destination=destination,
            hotel=hotel,
            days=days,
            budget=budget,
            travel_type=travel_type,
        )
        Budget.objects.create(
            trip=trip,
            travel_cost=travel_cost,
            hotel_cost=hotel_budget,
            food_cost=food_cost,
            activity_cost=activity_cost,
        )
        for item in DEFAULT_CHECKLIST_ITEMS:
            ChecklistItem.objects.create(trip=trip, item_name=item)

        plan['trip_id'] = trip.id
        plan['trip'] = TripSerializer(trip).data

    return Response(plan)


@api_view(['GET'])
@permission_classes([AllowAny])
def weather_detail(request, destination_name):
    destination = Destination.objects.filter(name__iexact=destination_name).first()
    if not destination:
        destination = Destination.objects.filter(
            name__icontains=destination_name
        ).first()

    if not destination:
        return Response(
            {'detail': f'Destination "{destination_name}" not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        weather = destination.weather
    except WeatherForecast.DoesNotExist:
        return Response(
            {'detail': 'Weather data not available for this destination.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response({
        'destination': destination.name,
        'weather': WeatherForecastSerializer(weather).data,
    })
