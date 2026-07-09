from django.urls import path
from accounts.apiviews.views import (
    UserListView,
    BlockHeadCreateView,
    FloorHeadCreateView,
    ObserverCreateView,
    AssistantCreateView,
)

urlpatterns = [
    path('users/', UserListView.as_view(), name='api_user_list'),
    path('block-heads/', BlockHeadCreateView.as_view(), name='api_create_block_head'),
    path('floor-heads/', FloorHeadCreateView.as_view(), name='api_create_floor_head'),
    path('observers/', ObserverCreateView.as_view(), name='api_create_observer'),
    path('assistants/', AssistantCreateView.as_view(), name='api_create_assistant'),
]
