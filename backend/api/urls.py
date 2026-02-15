from django.urls import path
from .views import get_users, create_user, user_details, signup, login_view, logout_view, csrf_cookie, me

urlpatterns = [
    path('users/', get_users, name = 'get_users'),
    path('users/create/', create_user, name = 'create_user'),
    path('users/<int:pk>/', user_details, name = 'user_details'),
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/me/', me, name='me'),
    path('auth/csrf/', csrf_cookie, name='csrf_cookie'),
]