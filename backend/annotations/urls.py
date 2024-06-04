from django.urls import path

from .views import *

urlpatterns = [
    path('groups', GroupCreateAPIView.as_view(), name='group_create'),
    path('groups/<int:group_id>/delete', GroupDeleteAPIView.as_view(), name='group_delete'),
    path('groups/<int:group_id>/add-member/', GroupAddMemberAPIView.as_view(), name='group_add_member'),
    path('groups/list', GroupListAPIView.as_view(), name='groups_get'),


    path('photos', PhotoCreateAPIView.as_view(), name='photo_create'),
    path('photos/<int:pk>', PhotoCreateAPIView.as_view(), name='photo_delete'),
    path('photos_edit/<int:pk>', PhotoAnnotateAPIView.as_view(), name='photo_patch'),
    path('photo/<int:id>', PhotoGetAPIView.as_view(), name='get_single_photo'),
    path('photo/<int:id>/annotate', AnnotationAPIView.as_view(), name='add_annotation'),
    path('photo/delete_annotation/<int:photo_id>/<int:annotation_id>', AnnotationAPIView.as_view(), name='delete_annotation'),

]



