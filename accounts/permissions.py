from rest_framework.permissions import BasePermission
from accounts.models import User


class IsSuperAdmin(BasePermission):
    """Allows access only to super admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.SUPER_ADMIN
        )

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsBuildingHead(BasePermission):
    """Allows access to building heads (and super admins), scoped to their building."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [User.Role.BUILDING_HEAD, User.Role.SUPER_ADMIN]
        )

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == User.Role.SUPER_ADMIN:
            return True
        if request.user.role == User.Role.BUILDING_HEAD:
            obj_building_id = getattr(obj, 'building_id', getattr(obj, 'id', None) if hasattr(obj, 'building_heads') else None)
            return bool(request.user.building_id and request.user.building_id == obj_building_id)
        return False


class IsBlockHead(BasePermission):
    """Allows access to block heads (and super admins), scoped to their block."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [User.Role.BLOCK_HEAD, User.Role.SUPER_ADMIN]
        )

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == User.Role.SUPER_ADMIN:
            return True
        if request.user.role == User.Role.BLOCK_HEAD:
            obj_block_id = getattr(obj, 'block_id', getattr(obj, 'id', None) if hasattr(obj, 'block_staff') else None)
            return bool(request.user.block_id and request.user.block_id == obj_block_id)
        return False


class IsFloorHeadOrAssistant(BasePermission):
    """Allows access to floor heads and assistants, scoped to their floor."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [User.Role.FLOOR_HEAD, User.Role.ASSISTANT, User.Role.SUPER_ADMIN]
        )

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == User.Role.SUPER_ADMIN:
            return True
        if request.user.role in [User.Role.FLOOR_HEAD, User.Role.ASSISTANT]:
            obj_floor_id = getattr(obj, 'floor_id', getattr(obj, 'id', None) if hasattr(obj, 'floor_staff') else None)
            return bool(request.user.floor_id and request.user.floor_id == obj_floor_id)
        return False


class IsOwnerOrSuperAdmin(BasePermission):
    """Allows access only to the user themselves or a super admin."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == User.Role.SUPER_ADMIN:
            return True
        return obj == request.user or getattr(obj, 'id', None) == request.user.id
