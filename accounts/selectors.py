from typing import Optional, Dict, Any
from django.db.models import QuerySet
from accounts.models import User


def get_user_scope_dict(user: User) -> Dict[str, Optional[int]]:
    """Returns the scope dictionary (building_id, block_id, floor_id) for a user."""
    return {
        "building_id": user.building_id,
        "block_id": user.block_id,
        "floor_id": user.floor_id,
    }


def get_user_by_id(user_id: int) -> Optional[User]:
    """Fetches a User by primary key."""
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


def get_user_by_username(username: str) -> Optional[User]:
    """Fetches a User by username."""
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None


def list_users_for_scope(request_user: User) -> QuerySet[User]:
    """
    Returns a queryset of Users filtered according to the requesting user's role and scope.
    Following HackSoft styleguide, read queries live in selectors.
    """
    if not request_user.is_authenticated:
        return User.objects.none()

    if request_user.role == User.Role.SUPER_ADMIN:
        return User.objects.all()

    if request_user.role == User.Role.BUILDING_HEAD and request_user.building_id:
        return User.objects.filter(building_id=request_user.building_id)

    if request_user.role == User.Role.BLOCK_HEAD and request_user.block_id:
        return User.objects.filter(block_id=request_user.block_id)

    if request_user.role in [User.Role.FLOOR_HEAD, User.Role.ASSISTANT] and request_user.floor_id:
        return User.objects.filter(floor_id=request_user.floor_id)

    return User.objects.filter(id=request_user.id)
