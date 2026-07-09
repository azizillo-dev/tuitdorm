import pytest
from rest_framework.test import APIClient
from accounts.models import User
from structure.models import Building, Block, Floor


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def building_a(db):
    return Building.objects.create(name="A-Bino")


@pytest.fixture
def block_a(db):
    return Block.objects.create(name="A-Blok")


@pytest.fixture
def block_b(db):
    return Block.objects.create(name="B-Blok")


@pytest.fixture
def floor_a1(db):
    return Floor.objects.create(name="1-Qavat (A-Blok)")


@pytest.fixture
def floor_b1(db):
    return Floor.objects.create(name="1-Qavat (B-Blok)")


@pytest.fixture
def super_admin(db):
    return User.objects.create_superuser(
        username="superadmin",
        password="password123",
        full_name="Super Administrator"
    )


@pytest.fixture
def building_head(db, building_a, super_admin):
    return User.objects.create_user(
        username="buildinghead",
        password="password123",
        role=User.Role.BUILDING_HEAD,
        building=building_a,
        created_by=super_admin
    )


@pytest.fixture
def block_head_a(db, block_a, super_admin):
    return User.objects.create_user(
        username="blockhead_a",
        password="password123",
        role=User.Role.BLOCK_HEAD,
        block=block_a,
        created_by=super_admin
    )


@pytest.fixture
def block_head_b(db, block_b, super_admin):
    return User.objects.create_user(
        username="blockhead_b",
        password="password123",
        role=User.Role.BLOCK_HEAD,
        block=block_b,
        created_by=super_admin
    )


@pytest.fixture
def floor_head_a1(db, block_a, floor_a1, block_head_a):
    return User.objects.create_user(
        username="floorhead_a1",
        password="password123",
        role=User.Role.FLOOR_HEAD,
        block=block_a,
        floor=floor_a1,
        created_by=block_head_a
    )
