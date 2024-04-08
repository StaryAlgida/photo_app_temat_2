from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    username = None
    # By default, Django uses username and password fields to log in users.
    # I overrode this to use email field instead of username.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
