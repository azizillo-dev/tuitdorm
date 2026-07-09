import pytest
from unittest.mock import Mock
from accounts.permissions import (
    IsSuperAdmin,
    IsBuildingHead,
    IsBlockHead,
    IsFloorHeadOrAssistant,
    IsOwnerOrSuperAdmin,
)
from accounts.models import User


@pytest.mark.django_db
def test_is_super_admin_permission(super_admin, block_head_a):
    perm = IsSuperAdmin()
    req_admin = Mock(user=super_admin)
    req_bh = Mock(user=block_head_a)

    assert perm.has_permission(req_admin, None) is True
    assert perm.has_permission(req_bh, None) is False


@pytest.mark.django_db
def test_is_building_head_permission(building_head, block_head_a, building_a):
    perm = IsBuildingHead()
    req_bh = Mock(user=building_head)
    req_block = Mock(user=block_head_a)

    assert perm.has_permission(req_bh, None) is True
    assert perm.has_permission(req_block, None) is False

    obj_inside_building = Mock(building_id=building_a.id)
    obj_outside_building = Mock(building_id=9999)

    assert perm.has_object_permission(req_bh, None, obj_inside_building) is True
    assert perm.has_object_permission(req_bh, None, obj_outside_building) is False


@pytest.mark.django_db
def test_is_block_head_permission(block_head_a, block_head_b, block_a, block_b):
    perm = IsBlockHead()
    req_a = Mock(user=block_head_a)
    req_b = Mock(user=block_head_b)

    assert perm.has_permission(req_a, None) is True

    obj_in_a = Mock(block_id=block_a.id)
    obj_in_b = Mock(block_id=block_b.id)

    assert perm.has_object_permission(req_a, None, obj_in_a) is True
    assert perm.has_object_permission(req_a, None, obj_in_b) is False
    assert perm.has_object_permission(req_b, None, obj_in_b) is True


@pytest.mark.django_db
def test_is_floor_head_or_assistant_permission(floor_head_a1, block_head_a, floor_a1, floor_b1):
    perm = IsFloorHeadOrAssistant()
    req_fh = Mock(user=floor_head_a1)

    assert perm.has_permission(req_fh, None) is True

    obj_on_floor_a1 = Mock(floor_id=floor_a1.id)
    obj_on_floor_b1 = Mock(floor_id=floor_b1.id)

    assert perm.has_object_permission(req_fh, None, obj_on_floor_a1) is True
    assert perm.has_object_permission(req_fh, None, obj_on_floor_b1) is False


@pytest.mark.django_db
def test_is_owner_or_super_admin_permission(super_admin, block_head_a, block_head_b):
    perm = IsOwnerOrSuperAdmin()
    req_a = Mock(user=block_head_a)
    req_admin = Mock(user=super_admin)

    assert perm.has_object_permission(req_a, None, block_head_a) is True
    assert perm.has_object_permission(req_a, None, block_head_b) is False
    assert perm.has_object_permission(req_admin, None, block_head_b) is True
