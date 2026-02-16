from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    age = models.IntegerField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=1200)


    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "age"]

    def __str__(self):
        return self.email


class Game(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('in_progress', 'In Progress'),
        ('finished', 'Finished'),
    ]

    white_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='white_games',
        on_delete=models.CASCADE
    )
    black_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='black_games',
        on_delete=models.CASCADE
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    result = models.CharField(max_length=10, null=True, blank=True)
    fen = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Move(models.Model):
    game = models.ForeignKey(
        Game,
        related_name='moves',
        on_delete=models.CASCADE
    )

    move_number = models.IntegerField()
    from_square = models.CharField(max_length=5)
    to_square = models.CharField(max_length=5)
    san = models.CharField(max_length=20)

    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['move_number']

class Message(models.Model):
    game = models.ForeignKey(
        Game,
        related_name='messages',
        on_delete=models.CASCADE
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
