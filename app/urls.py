from django.urls import path
from . import views

app_name = 'app'

urlpatterns = [
    path('home/', views.home, name='home'),
    path('play/<room_code>/', views.play, name='play'),
    path('<exception>', views.handler404, name='404'),
    path('', views.handler500, name='505'),
]
