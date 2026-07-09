from django.core.exceptions import PermissionDenied, ValidationError
from accounts.models import User
from structure.models import Building, Block, Floor


def create_block_head(
    building=None,
    username: str = "",
    password: str = "",
    full_name: str = "",
    created_by: User = None,
    *,
    block=None,
    phone_number: str = "",
    profile_photo=None,
    **kwargs
) -> User:
    """
    Creates a user with role BLOCK_HEAD.
    Only callable by SUPER_ADMIN.
    Enforced strictly in this service following HackSoft styleguide.
    """
    if not created_by or created_by.role != User.Role.SUPER_ADMIN:
        raise PermissionDenied("Block sardorini (Block Head) yaratish uchun faqat SUPER_ADMIN huquqiga ega bo'lishingiz kerak.")

    if not username:
        raise ValidationError("Foydalanuvchi nomi (username) kiritilishi shart.")
    if User.objects.filter(username=username).exists():
        raise ValidationError("Bunday foydalanuvchi nomi allaqachon mavjud.")

    # Check if building argument passed is actually a Block instance
    if isinstance(building, Block):
        if block is None:
            block = building
        building = None

    user = User(
        username=username,
        role=User.Role.BLOCK_HEAD,
        full_name=full_name,
        created_by=created_by,
        building=building if isinstance(building, Building) else None,
        block=block if isinstance(block, Block) else None,
        phone_number=phone_number,
        profile_photo=profile_photo,
    )
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()
    user.save()
    return user


def create_floor_head(
    block=None,
    username: str = "",
    password: str = "",
    full_name: str = "",
    created_by: User = None,
    *,
    floor=None,
    phone_number: str = "",
    profile_photo=None,
    **kwargs
) -> User:
    """
    Creates a user with role FLOOR_HEAD.
    Only callable by BLOCK_HEAD of that specific block (or SUPER_ADMIN).
    """
    if not created_by:
        raise PermissionDenied("Qavat sardorini (Floor Head) yaratish uchun avtorizatsiya talab qilinadi.")

    block_obj = block if isinstance(block, Block) else None
    floor_obj = floor if isinstance(floor, Floor) else (block if isinstance(block, Floor) else None)

    if created_by.role == User.Role.BLOCK_HEAD:
        created_by_block_id = created_by.block_id
        target_block_id = getattr(block_obj, 'id', None) or getattr(getattr(floor_obj, 'block', None), 'id', None) or (block if isinstance(block, int) else None)
        if created_by_block_id and target_block_id and created_by_block_id != target_block_id:
            raise PermissionDenied("Siz faqat o'zingizga tegishli blok uchun qavat sardori (Floor Head) yarata olasiz.")
    elif created_by.role != User.Role.SUPER_ADMIN:
        raise PermissionDenied("Qavat sardorini (Floor Head) yaratish uchun faqat BLOCK_HEAD yoki SUPER_ADMIN huquqiga ega bo'lishingiz kerak.")

    if not username:
        raise ValidationError("Foydalanuvchi nomi (username) kiritilishi shart.")
    if User.objects.filter(username=username).exists():
        raise ValidationError("Bunday foydalanuvchi nomi allaqachon mavjud.")

    user = User(
        username=username,
        role=User.Role.FLOOR_HEAD,
        full_name=full_name,
        created_by=created_by,
        block=block_obj,
        floor=floor_obj,
        phone_number=phone_number,
        profile_photo=profile_photo,
    )
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()
    user.save()
    return user


def create_observer(
    block=None,
    username: str = "",
    password: str = "",
    full_name: str = "",
    created_by: User = None,
    *,
    phone_number: str = "",
    profile_photo=None,
    **kwargs
) -> User:
    """
    Creates a user with role OBSERVER.
    Only callable by BLOCK_HEAD of that specific block (or SUPER_ADMIN).
    """
    if not created_by:
        raise PermissionDenied("Kuzatuvchi (Observer) yaratish uchun avtorizatsiya talab qilinadi.")

    block_obj = block if isinstance(block, Block) else None

    if created_by.role == User.Role.BLOCK_HEAD:
        created_by_block_id = created_by.block_id
        target_block_id = getattr(block_obj, 'id', None) or (block if isinstance(block, int) else None)
        if created_by_block_id and target_block_id and created_by_block_id != target_block_id:
            raise PermissionDenied("Siz faqat o'zingizga tegishli blok uchun kuzatuvchi (Observer) yarata olasiz.")
    elif created_by.role != User.Role.SUPER_ADMIN:
        raise PermissionDenied("Kuzatuvchi (Observer) yaratish uchun faqat BLOCK_HEAD yoki SUPER_ADMIN huquqiga ega bo'lishingiz kerak.")

    if not username:
        raise ValidationError("Foydalanuvchi nomi (username) kiritilishi shart.")
    if User.objects.filter(username=username).exists():
        raise ValidationError("Bunday foydalanuvchi nomi allaqachon mavjud.")

    user = User(
        username=username,
        role=User.Role.OBSERVER,
        full_name=full_name,
        created_by=created_by,
        block=block_obj,
        phone_number=phone_number,
        profile_photo=profile_photo,
    )
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()
    user.save()
    return user


def create_assistant(
    floor=None,
    username: str = "",
    password: str = "",
    full_name: str = "",
    created_by: User = None,
    *,
    phone_number: str = "",
    profile_photo=None,
    **kwargs
) -> User:
    """
    Creates a user with role ASSISTANT.
    Only callable by FLOOR_HEAD of that specific floor (or BLOCK_HEAD / SUPER_ADMIN).
    Enforces that only 1 active assistant is allowed per floor.
    """
    if not created_by:
        raise PermissionDenied("Yordamchi (Assistant) yaratish uchun avtorizatsiya talab qilinadi.")

    floor_obj = floor if isinstance(floor, Floor) else None
    floor_id = getattr(floor_obj, 'id', None) or (floor if isinstance(floor, int) else None)

    if created_by.role == User.Role.FLOOR_HEAD:
        created_by_floor_id = created_by.floor_id
        if created_by_floor_id and floor_id and created_by_floor_id != floor_id:
            raise PermissionDenied("Siz faqat o'zingizning qavatingiz uchun yordamchi (Assistant) yarata olasiz.")
    elif created_by.role not in [User.Role.SUPER_ADMIN, User.Role.BLOCK_HEAD]:
        raise PermissionDenied("Yordamchi (Assistant) yaratish uchun faqat FLOOR_HEAD, BLOCK_HEAD yoki SUPER_ADMIN huquqiga ega bo'lishingiz kerak.")

    # Enforce assistant limit per floor
    if floor_id and User.objects.filter(floor_id=floor_id, role=User.Role.ASSISTANT, is_active=True).exists():
        raise ValidationError("Ushbu qavat uchun yordamchi (Assistant) allaqachon mavjud. Har bir qavatga faqat 1 ta yordamchi tayinlanishi mumkin.")

    if not username:
        raise ValidationError("Foydalanuvchi nomi (username) kiritilishi shart.")
    if User.objects.filter(username=username).exists():
        raise ValidationError("Bunday foydalanuvchi nomi allaqachon mavjud.")

    user = User(
        username=username,
        role=User.Role.ASSISTANT,
        full_name=full_name,
        created_by=created_by,
        floor=floor_obj,
        phone_number=phone_number,
        profile_photo=profile_photo,
    )
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()
    user.save()
    return user


def update_user_profile(user: User, *, full_name: str = None, phone_number: str = None, profile_photo=None) -> User:
    """Updates non-password fields of a User."""
    if full_name is not None:
        user.full_name = full_name
    if phone_number is not None:
        user.phone_number = phone_number
    if profile_photo is not None:
        user.profile_photo = profile_photo
    user.save()
    return user


def change_user_password(user: User, old_password: str, new_password: str) -> User:
    """Changes user password after validating old password."""
    if not user.check_password(old_password):
        raise ValidationError("Eski parolni noto'g'ri kiritdingiz.")
    if not new_password:
        raise ValidationError("Yangi parol bo'sh bo'lishi mumkin emas.")
    user.set_password(new_password)
    user.save()
    return user
