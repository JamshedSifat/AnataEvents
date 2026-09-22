from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="auth-login"),
    path("refresh/", views.RefreshView.as_view(), name="auth-refresh"),
    path("logout/", views.LogoutView.as_view(), name="auth-logout"),
    path("me/", views.me, name="auth-me"),
    path("change-password/", views.change_password, name="auth-change-password"),
    path("forgot-password/", views.forgot_password, name="auth-forgot-password"),
    path("reset-password/", views.reset_password, name="auth-reset-password"),
]
