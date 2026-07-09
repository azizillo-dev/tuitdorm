from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Foydalanuvchi nomi (username) kiritilishi shart.")
        user = self.model(username=username, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('role') != User.Role.SUPER_ADMIN:
            raise ValueError("Superuser uchun role=SUPER_ADMIN bo'lishi kerak.")
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser uchun is_staff=True bo'lishi kerak.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser uchun is_superuser=True bo'lishi kerak.")

        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        BUILDING_HEAD = 'BUILDING_HEAD', 'Building Head'
        BLOCK_HEAD = 'BLOCK_HEAD', 'Block Head'
        FLOOR_HEAD = 'FLOOR_HEAD', 'Floor Head'
        OBSERVER = 'OBSERVER', 'Observer'
        ASSISTANT = 'ASSISTANT', 'Assistant'

    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ASSISTANT
    )
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=50, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Scope relationships
    building = models.ForeignKey(
        'structure.Building',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='building_heads'
    )
    block = models.ForeignKey(
        'structure.Block',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='block_staff'
    )
    floor = models.ForeignKey(
        'structure.Floor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='floor_staff'
    )

    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_users'
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} ({self.role})"
