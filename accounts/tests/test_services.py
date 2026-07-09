import pytest
from django.core.exceptions import PermissionDenied, ValidationError
from accounts.models import User
from accounts.services import (
    create_block_head,
    create_floor_head,
    create_observer,
    create_assistant,
    update_user_profile,
    change_user_password,
)


@pytest.mark.django_db
def test_create_block_head_by_super_admin(super_admin, block_a):
    user = create_block_head(
        building=block_a,
        username="blockhead_new",
        password="password123",
        full_name="Block Head New",
        created_by=super_admin
    )
    assert user.role == User.Role.BLOCK_HEAD
    assert user.block == block_a
    assert user.created_by == super_admin


@pytest.mark.django_db
def test_create_block_head_by_non_super_admin_raises_permission_denied(block_head_a, block_b):
    with pytest.raises(PermissionDenied, match="Block sardorini.*"):
        create_block_head(
            building=block_b,
            username="unauthorized_bh",
            password="password123",
            full_name="Unauthorized BH",
            created_by=block_head_a
        )


@pytest.mark.django_db
def test_create_floor_head_by_block_head(block_head_a, block_a, floor_a1):
    user = create_floor_head(
        block=block_a,
        username="fh_test",
        password="password123",
        full_name="FH Test",
        created_by=block_head_a,
        floor=floor_a1
    )
    assert user.role == User.Role.FLOOR_HEAD
    assert user.block == block_a
    assert user.floor == floor_a1
    assert user.created_by == block_head_a


@pytest.mark.django_db
def test_create_floor_head_scope_isolation_raises_permission_denied(block_head_a, block_b, floor_b1):
    with pytest.raises(PermissionDenied, match="Siz faqat o'zingizga tegishli blok uchun qavat sardori.*"):
        create_floor_head(
            block=block_b,
            username="fh_illegal",
            password="password123",
            full_name="Illegal FH",
            created_by=block_head_a,
            floor=floor_b1
        )


@pytest.mark.django_db
def test_create_observer_by_block_head(block_head_a, block_a):
    user = create_observer(
        block=block_a,
        username="obs_test",
        password="password123",
        full_name="Observer Test",
        created_by=block_head_a
    )
    assert user.role == User.Role.OBSERVER
    assert user.block == block_a


@pytest.mark.django_db
def test_create_observer_scope_isolation_raises_permission_denied(block_head_a, block_b):
    with pytest.raises(PermissionDenied, match="Siz faqat o'zingizga tegishli blok uchun kuzatuvchi.*"):
        create_observer(
            block=block_b,
            username="obs_illegal",
            password="password123",
            full_name="Illegal Observer",
            created_by=block_head_a
        )


@pytest.mark.django_db
def test_create_assistant_by_floor_head(floor_head_a1, floor_a1):
    user = create_assistant(
        floor=floor_a1,
        username="assistant_a1",
        password="password123",
        full_name="Assistant A1",
        created_by=floor_head_a1
    )
    assert user.role == User.Role.ASSISTANT
    assert user.floor == floor_a1


@pytest.mark.django_db
def test_create_assistant_scope_isolation_raises_permission_denied(floor_head_a1, floor_b1):
    with pytest.raises(PermissionDenied, match="Siz faqat o'zingizning qavatingiz uchun yordamchi.*"):
        create_assistant(
            floor=floor_b1,
            username="assistant_illegal",
            password="password123",
            full_name="Illegal Assistant",
            created_by=floor_head_a1
        )


@pytest.mark.django_db
def test_create_assistant_limit_raises_validation_error(floor_head_a1, floor_a1):
    create_assistant(
        floor=floor_a1,
        username="first_assistant",
        password="password123",
        full_name="First Assistant",
        created_by=floor_head_a1
    )
    with pytest.raises(ValidationError, match="Ushbu qavat uchun yordamchi.*1 ta yordamchi tayinlanishi mumkin."):
        create_assistant(
            floor=floor_a1,
            username="second_assistant",
            password="password123",
            full_name="Second Assistant",
            created_by=floor_head_a1
        )


@pytest.mark.django_db
def test_update_user_profile(super_admin):
    updated = update_user_profile(super_admin, full_name="Updated Name", phone_number="+998901234567")
    assert updated.full_name == "Updated Name"
    assert updated.phone_number == "+998901234567"


@pytest.mark.django_db
def test_change_user_password(super_admin):
    change_user_password(super_admin, "password123", "newpassword456")
    assert super_admin.check_password("newpassword456") is True


@pytest.mark.django_db
def test_change_user_password_invalid_old_password_raises_validation_error(super_admin):
    with pytest.raises(ValidationError, match="Eski parolni noto'g'ri kiritdingiz."):
        change_user_password(super_admin, "wrongpassword", "newpassword456")
