from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Photo
from .serializer import PhotoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
import os

class PhotoCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoSerializer

    def is_valid_image_extension(self, file_name):
        valid_extensions = ['.jpg', '.jpeg', '.png', '.jfif', '.gif', '.bmp']
        file_extension = os.path.splitext(file_name)[1].lower()
        return file_extension in valid_extensions
    

    def is_valid_image_size(self, file):
            # Check if the file size is less than or equal to 50000KB
            if file.size > 50000 * 1024:  # 50000KB 
                return False
            return True
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        image = request.FILES.get("image")
        title = request.FILES.get("title")
        if image:
            # extension check
            if not self.is_valid_image_extension(image.name):
                return Response(
                    {"error": "Invalid image file format"}, status=status.HTTP_400_BAD_REQUEST
                )
            
            if not self.is_valid_image_size(image):
                return Response(
                    {"error": "Image file size exceeds 50000KB"}, status=status.HTTP_400_BAD_REQUEST
                )
        # print(request.data["title"])
        if serializer.is_valid():
            serializer.save(owner=request.user, owner_id=request.user.id, title=request.data["title"])  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        photos = Photo.objects.filter(owner=request.user)
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        photo_id = kwargs.get('pk')
        try:
            photo = Photo.objects.get(pk=photo_id)
        except Photo.DoesNotExist:
            return Response({"error": "Photo not found"}, status=status.HTTP_404_NOT_FOUND)

        if photo.owner != request.user:
            raise PermissionDenied("You do not have permission to delete this photo.")
        image_path = photo.image.path
        
        if os.path.exists(image_path):
            os.remove(image_path)
            photo.delete()
            return Response({"message": "Photo and image deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Image file not found"}, status=status.HTTP_404_NOT_FOUND)