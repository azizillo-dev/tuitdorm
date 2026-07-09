from django.core.exceptions import PermissionDenied as DjangoPermissionDenied, ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied, ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import (
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    ProfileUpdateSerializer,
)
from accounts.services import update_user_profile, change_user_password


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token kiritilmagan."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Muvaffaqiyatli tizimdan chiqildi."},
                status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"detail": "Noto'g'ri yoki allaqachon bekor qilingan token."},
                status=status.HTTP_400_BAD_REQUEST
            )


class MeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True
        )
        try:
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data

            if 'new_password' in validated_data or 'password' in validated_data:
                new_pwd = validated_data.get('new_password') or validated_data.get('password')
                old_pwd = validated_data.get('old_password')
                change_user_password(request.user, old_pwd, new_pwd)

            update_kwargs = {}
            if 'full_name' in validated_data:
                update_kwargs['full_name'] = validated_data['full_name']
            if 'phone_number' in validated_data:
                update_kwargs['phone_number'] = validated_data['phone_number']
            if 'profile_photo' in validated_data:
                update_kwargs['profile_photo'] = validated_data['profile_photo']

            if update_kwargs:
                update_user_profile(request.user, **update_kwargs)

            return Response(
                UserProfileSerializer(request.user).data,
                status=status.HTTP_200_OK
            )
        except (DjangoValidationError, DRFValidationError) as e:
            detail = e.message_dict if hasattr(e, 'message_dict') else (e.detail if hasattr(e, 'detail') else {"detail": str(e.messages if hasattr(e, 'messages') else e)})
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        except (DjangoPermissionDenied, DRFPermissionDenied) as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
