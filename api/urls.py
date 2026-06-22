from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as drf_auth_views

from .views import (
    BudgetViewSet,
    ChecklistViewSet,
    DestinationViewSet,
    HotelViewSet,
    TravelJournalViewSet,
    TripViewSet,
    generate_plan,
    logout,
    profile,
    register,
    weather_detail,
)

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet, basename='destinations')
router.register(r'hotels', HotelViewSet, basename='hotels')
router.register(r'trips', TripViewSet, basename='trips')
router.register(r'checklist', ChecklistViewSet, basename='checklist')
router.register(r'journals', TravelJournalViewSet, basename='journals')
router.register(r'budget', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='api-register'),
    path('auth/login/', drf_auth_views.obtain_auth_token, name='api-login'),
    path('auth/logout/', logout, name='api-logout'),
    path('profile/', profile, name='api-profile'),
    path('planner/generate/', generate_plan, name='api-planner-generate'),
    path('weather/<str:destination_name>/', weather_detail, name='api-weather'),
]
