import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import User


@pytest.mark.django_db
def test_api_user_list_scoped_for_super_admin(api_client, super_admin, block_head_a, block_head_b):
    api_client.force_authenticate(user=super_admin)
    url = reverse('api_user_list')
    resp = api_client.get(url)
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.data) >= 3


@pytest.mark.django_db
def test_api_user_list_scoped_for_block_head(api_client, block_head_a, block_head_b, floor_head_a1):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_user_list')
    resp = api_client.get(url)
    assert resp.status_code == status.HTTP_200_OK
    usernames = [u['username'] for u in resp.data]
    assert 'blockhead_a' in usernames
    assert 'floorhead_a1' in usernames
    assert 'blockhead_b' not in usernames


@pytest.mark.django_db
def test_api_create_block_head_by_super_admin(api_client, super_admin, block_a):
    api_client.force_authenticate(user=super_admin)
    url = reverse('api_create_block_head')
    data = {
        'username': 'bh_via_api',
        'password': 'password123',
        'full_name': 'BH API',
        'block_id': block_a.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['role'] == User.Role.BLOCK_HEAD
    assert resp.data['scope']['block_id'] == block_a.id


@pytest.mark.django_db
def test_api_create_block_head_by_block_head_forbidden(api_client, block_head_a, block_b):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_create_block_head')
    data = {
        'username': 'bh_illegal_api',
        'password': 'password123',
        'block_id': block_b.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_api_create_floor_head_by_block_head_in_own_block(api_client, block_head_a, block_a):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_create_floor_head')
    data = {
        'username': 'fh_api',
        'password': 'password123',
        'full_name': 'FH API',
        'block_id': block_a.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['role'] == User.Role.FLOOR_HEAD
    assert resp.data['scope']['block_id'] == block_a.id


@pytest.mark.django_db
def test_api_create_floor_head_by_block_head_in_other_block_forbidden(api_client, block_head_a, block_b):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_create_floor_head')
    data = {
        'username': 'fh_illegal_api',
        'password': 'password123',
        'block_id': block_b.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_api_create_observer_by_block_head_in_own_block(api_client, block_head_a, block_a):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_create_observer')
    data = {
        'username': 'obs_api',
        'password': 'password123',
        'full_name': 'Obs API',
        'block_id': block_a.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['role'] == User.Role.OBSERVER


@pytest.mark.django_db
def test_api_create_observer_by_block_head_in_other_block_forbidden(api_client, block_head_a, block_b):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('api_create_observer')
    data = {
        'username': 'obs_illegal_api',
        'password': 'password123',
        'block_id': block_b.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_api_create_assistant_by_floor_head_in_own_floor(api_client, floor_head_a1, floor_a1):
    api_client.force_authenticate(user=floor_head_a1)
    url = reverse('api_create_assistant')
    data = {
        'username': 'asst_api',
        'password': 'password123',
        'full_name': 'Asst API',
        'floor_id': floor_a1.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['role'] == User.Role.ASSISTANT


@pytest.mark.django_db
def test_api_create_assistant_by_floor_head_in_other_floor_forbidden(api_client, floor_head_a1, floor_b1):
    api_client.force_authenticate(user=floor_head_a1)
    url = reverse('api_create_assistant')
    data = {
        'username': 'asst_illegal_api',
        'password': 'password123',
        'floor_id': floor_b1.id
    }
    resp = api_client.post(url, data, format='json')
    assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_api_create_assistant_limit_enforced(api_client, floor_head_a1, floor_a1):
    api_client.force_authenticate(user=floor_head_a1)
    url = reverse('api_create_assistant')
    data1 = {
        'username': 'first_asst_api',
        'password': 'password123',
        'floor_id': floor_a1.id
    }
    resp1 = api_client.post(url, data1, format='json')
    assert resp1.status_code == status.HTTP_201_CREATED

    data2 = {
        'username': 'second_asst_api',
        'password': 'password123',
        'floor_id': floor_a1.id
    }
    resp2 = api_client.post(url, data2, format='json')
    assert resp2.status_code == status.HTTP_400_BAD_REQUEST
