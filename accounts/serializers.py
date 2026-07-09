from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from accounts.models import User
from accounts.selectors import get_user_scope_dict


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['scope'] = get_user_scope_dict(self.user)
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    scope = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'role',
            'full_name',
            'phone_number',
            'profile_photo',
            'is_active',
            'date_joined',
            'scope',
        )
        read_only_fields = fields

    def get_scope(self, obj):
        return get_user_scope_dict(obj)


class ProfileUpdateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255, required=False)
    phone_number = serializers.CharField(max_length=50, required=False)
    profile_photo = serializers.ImageField(required=False, allow_null=True)
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        new_pwd = attrs.get('new_password') or attrs.get('password')
        if new_pwd:
            old_pwd = attrs.get('old_password')
            if not old_pwd:
                raise serializers.ValidationError(
                    {"old_password": "Yangi parolni o'rnatish uchun eski parolni kiritish shart."}
                )
            if self.instance and not self.instance.check_password(old_pwd):
                raise serializers.ValidationError(
                    {"old_password": "Eski parolni noto'g'ri kiritdingiz."}
                )
        return attrs


class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(max_length=255, required=False, default="")
    phone_number = serializers.CharField(max_length=50, required=False, default="")
    building_id = serializers.IntegerField(required=False, allow_null=True)
    block_id = serializers.IntegerField(required=False, allow_null=True)
    floor_id = serializers.IntegerField(required=False, allow_null=True)


class BaseCreateUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(max_length=255, required=False, default="")
    phone_number = serializers.CharField(max_length=50, required=False, default="")


class CreateBlockHeadSerializer(BaseCreateUserSerializer):
    building_id = serializers.IntegerField(required=False, allow_null=True)
    block_id = serializers.IntegerField(
        required=False, allow_null=True,
        error_messages={
            "required": "Block sardori (Block Head) yaratish uchun block_id kiritilishi shart.",
            "null": "Block sardori (Block Head) yaratish uchun block_id kiritilishi shart."
        }
    )

    def validate(self, attrs):
        if attrs.get('block_id') is None and attrs.get('building_id') is None:
            raise serializers.ValidationError({"block_id": "Block sardori (Block Head) yaratish uchun block_id kiritilishi shart."})
        return attrs


class CreateFloorHeadSerializer(BaseCreateUserSerializer):
    block_id = serializers.IntegerField(
        required=True,
        error_messages={
            "required": "Qavat sardori (Floor Head) yaratish uchun block_id kiritilishi shart.",
            "null": "Qavat sardori (Floor Head) yaratish uchun block_id kiritilishi shart."
        }
    )
    floor_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        if attrs.get('block_id') is None:
            raise serializers.ValidationError({"block_id": "Qavat sardori (Floor Head) yaratish uchun block_id kiritilishi shart."})
        return attrs


class CreateObserverSerializer(BaseCreateUserSerializer):
    block_id = serializers.IntegerField(
        required=True,
        error_messages={
            "required": "Kuzatuvchi (Observer) yaratish uchun block_id kiritilishi shart.",
            "null": "Kuzatuvchi (Observer) yaratish uchun block_id kiritilishi shart."
        }
    )

    def validate(self, attrs):
        if attrs.get('block_id') is None:
            raise serializers.ValidationError({"block_id": "Kuzatuvchi (Observer) yaratish uchun block_id kiritilishi shart."})
        return attrs


class CreateAssistantSerializer(BaseCreateUserSerializer):
    floor_id = serializers.IntegerField(
        required=True,
        error_messages={
            "required": "Yordamchi (Assistant) yaratish uchun floor_id kiritilishi shart.",
            "null": "Yordamchi (Assistant) yaratish uchun floor_id kiritilishi shart."
        }
    )

    def validate(self, attrs):
        if attrs.get('floor_id') is None:
            raise serializers.ValidationError({"floor_id": "Yordamchi (Assistant) yaratish uchun floor_id kiritilishi shart."})
        return attrs
