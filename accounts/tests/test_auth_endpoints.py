import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import User


@pytest.mark.django_db
def test_login_endpoint_returns_jwt_role_and_scope(api_client, block_head_a, block_a):
    url = reverse('auth_login')
    data = {
        'username': 'blockhead_a',
        'password': 'password123'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data
    assert response.data['role'] == User.Role.BLOCK_HEAD
    assert response.data['scope']['block_id'] == block_a.id


@pytest.mark.django_db
def test_login_invalid_credentials_returns_401(api_client, super_admin):
    url = reverse('auth_login')
    data = {
        'username': 'superadmin',
        'password': 'wrongpassword'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_token_refresh_flow(api_client, super_admin):
    login_url = reverse('auth_login')
    login_resp = api_client.post(login_url, {'username': 'superadmin', 'password': 'password123'}, format='json')
    refresh_token = login_resp.data['refresh']

    refresh_url = reverse('auth_refresh')
    refresh_resp = api_client.post(refresh_url, {'refresh': refresh_token}, format='json')
    assert refresh_resp.status_code == status.HTTP_200_OK
    assert 'access' in refresh_resp.data


@pytest.mark.django_db
def test_token_refresh_invalid_token_returns_401(api_client):
    url = reverse('auth_refresh')
    response = api_client.post(url, {'refresh': 'invalid.token.string'}, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_logout_endpoint_blacklists_token(api_client, super_admin):
    login_resp = api_client.post(reverse('auth_login'), {'username': 'superadmin', 'password': 'password123'}, format='json')
    access = login_resp.data['access']
    refresh = login_resp.data['refresh']

    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
    logout_resp = api_client.post(reverse('auth_logout'), {'refresh': refresh}, format='json')
    assert logout_resp.status_code == status.HTTP_200_OK

    # Trying to refresh with the blacklisted token should now fail
    refresh_resp = api_client.post(reverse('auth_refresh'), {'refresh': refresh}, format='json')
    assert refresh_resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_logout_without_token_returns_400(api_client, super_admin):
    api_client.force_authenticate(user=super_admin)
    response = api_client.post(reverse('auth_logout'), {}, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_me_endpoint_returns_profile(api_client, block_head_a, block_a):
    api_client.force_authenticate(user=block_head_a)
    url = reverse('auth_me')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['username'] == 'blockhead_a'
    assert response.data['role'] == User.Role.BLOCK_HEAD
    assert response.data['scope']['block_id'] == block_a.id


@pytest.mark.django_db
def test_patch_me_endpoint_update_profile_and_password(api_client, super_admin):
    api_client.force_authenticate(user=super_admin)
    url = reverse('auth_me')
    data = {
        'full_name': 'New Super Admin Name',
        'phone_number': '+998909998877',
        'old_password': 'password123',
        'new_password': 'supernewpassword456'
    }
    response = api_client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['full_name'] == 'New Super Admin Name'

    super_admin.refresh_from_db()
    assert super_admin.check_password('supernewpassword456') is True


@pytest.mark.django_db
def test_patch_me_endpoint_invalid_old_password_returns_400(api_client, super_admin):
    api_client.force_authenticate(user=super_admin)
    url = reverse('auth_me')
    data = {
        'old_password': 'wrongpassword',
        'new_password': 'supernewpassword456'
    }
    response = api_client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'old_password' in response.data
