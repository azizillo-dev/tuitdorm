import pytest
from accounts.models import User
from structure.models import Building, Block, Floor


@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(username="testuser", password="secretpassword")
    assert user.username == "testuser"
    assert user.check_password("secretpassword")
    assert user.role == User.Role.ASSISTANT
    assert user.is_active is True
    assert user.is_staff is False
    assert user.is_superuser is False


@pytest.mark.django_db
def test_create_user_without_username_raises_error():
    with pytest.raises(ValueError, match="Foydalanuvchi nomi.*"):
        User.objects.create_user(username="", password="secretpassword")


@pytest.mark.django_db
def test_create_superuser():
    admin = User.objects.create_superuser(username="adminuser", password="adminpassword")
    assert admin.username == "adminuser"
    assert admin.check_password("adminpassword")
    assert admin.role == User.Role.SUPER_ADMIN
    assert admin.is_staff is True
    assert admin.is_superuser is True


@pytest.mark.django_db
def test_create_superuser_invalid_role_raises_error():
    with pytest.raises(ValueError, match="Superuser uchun role=SUPER_ADMIN bo'lishi kerak."):
        User.objects.create_superuser(username="invalidadmin", password="password", role=User.Role.ASSISTANT)


@pytest.mark.django_db
def test_user_string_representation():
    user = User.objects.create_user(username="johndoe", role=User.Role.BLOCK_HEAD)
    assert str(user) == "johndoe (BLOCK_HEAD)"


@pytest.mark.django_db
def test_structure_models_string_representation(building_a, block_a, floor_a1):
    assert str(building_a) == "A-Bino"
    assert str(block_a) == "A-Blok"
    assert str(floor_a1) == "1-Qavat (A-Blok)"
