from django.core.exceptions import PermissionDenied as DjangoPermissionDenied, ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied, ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsSuperAdmin, IsBlockHead, IsFloorHeadOrAssistant
from accounts.selectors import list_users_for_scope
from accounts.serializers import (
    UserProfileSerializer,
    CreateBlockHeadSerializer,
    CreateFloorHeadSerializer,
    CreateObserverSerializer,
    CreateAssistantSerializer,
)
from accounts.services import (
    create_block_head,
    create_floor_head,
    create_observer,
    create_assistant,
)
from structure.models import Building, Block, Floor


class UserListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        users = list_users_for_scope(request.user)
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlockHeadCreateView(APIView):
    permission_classes = (IsAuthenticated, IsSuperAdmin)

    def post(self, request):
        serializer = CreateBlockHeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        building = None
        if data.get('building_id'):
            try:
                building = Building.objects.get(id=data['building_id'])
            except Building.DoesNotExist:
                return Response({"building_id": "Building topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        block = None
        if data.get('block_id'):
            try:
                block = Block.objects.get(id=data['block_id'])
            except Block.DoesNotExist:
                return Response({"block_id": "Block topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = create_block_head(
                building=building,
                block=block,
                username=data['username'],
                password=data['password'],
                full_name=data.get('full_name', ''),
                phone_number=data.get('phone_number', ''),
                created_by=request.user
            )
            return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        except (DjangoValidationError, DRFValidationError) as e:
            detail = e.message_dict if hasattr(e, 'message_dict') else (e.detail if hasattr(e, 'detail') else {"detail": str(e.messages if hasattr(e, 'messages') else e)})
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        except (DjangoPermissionDenied, DRFPermissionDenied) as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)


class FloorHeadCreateView(APIView):
    permission_classes = (IsAuthenticated, IsBlockHead)

    def post(self, request):
        serializer = CreateFloorHeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            block = Block.objects.get(id=data['block_id'])
        except Block.DoesNotExist:
            return Response({"block_id": "Block topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        floor = None
        if data.get('floor_id'):
            try:
                floor = Floor.objects.get(id=data['floor_id'])
            except Floor.DoesNotExist:
                return Response({"floor_id": "Floor topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = create_floor_head(
                block=block,
                floor=floor,
                username=data['username'],
                password=data['password'],
                full_name=data.get('full_name', ''),
                phone_number=data.get('phone_number', ''),
                created_by=request.user
            )
            return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        except (DjangoValidationError, DRFValidationError) as e:
            detail = e.message_dict if hasattr(e, 'message_dict') else (e.detail if hasattr(e, 'detail') else {"detail": str(e.messages if hasattr(e, 'messages') else e)})
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        except (DjangoPermissionDenied, DRFPermissionDenied) as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)


class ObserverCreateView(APIView):
    permission_classes = (IsAuthenticated, IsBlockHead)

    def post(self, request):
        serializer = CreateObserverSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            block = Block.objects.get(id=data['block_id'])
        except Block.DoesNotExist:
            return Response({"block_id": "Block topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = create_observer(
                block=block,
                username=data['username'],
                password=data['password'],
                full_name=data.get('full_name', ''),
                phone_number=data.get('phone_number', ''),
                created_by=request.user
            )
            return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        except (DjangoValidationError, DRFValidationError) as e:
            detail = e.message_dict if hasattr(e, 'message_dict') else (e.detail if hasattr(e, 'detail') else {"detail": str(e.messages if hasattr(e, 'messages') else e)})
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        except (DjangoPermissionDenied, DRFPermissionDenied) as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)


class AssistantCreateView(APIView):
    permission_classes = (IsAuthenticated, IsFloorHeadOrAssistant)

    def post(self, request):
        serializer = CreateAssistantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            floor = Floor.objects.get(id=data['floor_id'])
        except Floor.DoesNotExist:
            return Response({"floor_id": "Floor topilmadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = create_assistant(
                floor=floor,
                username=data['username'],
                password=data['password'],
                full_name=data.get('full_name', ''),
                phone_number=data.get('phone_number', ''),
                created_by=request.user
            )
            return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)
        except (DjangoValidationError, DRFValidationError) as e:
            detail = e.message_dict if hasattr(e, 'message_dict') else (e.detail if hasattr(e, 'detail') else {"detail": str(e.messages if hasattr(e, 'messages') else e)})
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        except (DjangoPermissionDenied, DRFPermissionDenied) as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
