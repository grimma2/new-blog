from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import models
from django.db.models import Count
import json

from .models import News, Tag
from .serializers import NewsSerializer, TagSerializer
from .permissions import HasSystemToken

# Create your views here.

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

class NewsViewSet(viewsets.ModelViewSet):
    queryset = (
        News.objects.select_related()
        .prefetch_related("tags")
        .order_by("-published_at")
    )
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        tags = self.request.query_params.get("tags")
        if tags:
            qs = qs.filter(tags__id=tags)
        slug = self.request.query_params.get("slug")
        if slug:
            qs = qs.filter(slug=slug)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                models.Q(title__icontains=search) | 
                models.Q(description__icontains=search) |
                models.Q(content__icontains=search)
            )
        return qs

class NewsImportView(APIView):
    permission_classes = [HasSystemToken]  # Только проверка токена, без аутентификации
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Поддержка файлов и JSON

    def post(self, request, *args, **kwargs):
        try:
            # Создаем копию данных для обработки
            data = request.data.copy()
            
            print(f"🔍 Данные: {data}")  # Для отладки
            print(f"🔍 Content-Type: {request.content_type}")  # Для отладки
            print(f"🔍 Method: {request.method}")  # Для отладки
            print(f"🔍 User: {request.user}")  # Для отладки
            print(f"🔍 Authenticated: {request.user.is_authenticated}")  # Для отладки
            
            serializer = NewsSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                news = serializer.save()
                return Response(NewsSerializer(news, context={'request': request}).data, status=status.HTTP_201_CREATED)
            else:
                print(f"🚨 Ошибки валидации: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"🚨 Исключение: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, *args, **kwargs):
        return Response({
            "message": "Use POST method to import news",
            "user": str(request.user),
            "authenticated": request.user.is_authenticated,
            "has_system_token": True  # Если дошли сюда, значит токен валидный
        }, status=status.HTTP_200_OK)


class HomePageViewSet(viewsets.ViewSet):
    """ViewSet для данных главной страницы"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def latest_api_news(self, request):
        """Последние 3 новости созданные через API"""
        news = News.objects.filter(from_api=True).order_by('-published_at')[:3]
        serializer = NewsSerializer(news, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_categories(self, request):
        """Топ 3 категории с новостями"""
        # Получаем топ 3 тега по количеству новостей
        top_tags = Tag.objects.annotate(
            news_count=Count('news')
        ).filter(news_count__gt=0).order_by('-news_count')[:3]
        
        result = []
        for tag in top_tags:
            # Получаем последние 5 новостей для каждого тега
            tag_news = News.objects.filter(tags=tag).order_by('-published_at')[:5]
            result.append({
                'tag': TagSerializer(tag).data,
                'news': NewsSerializer(tag_news, many=True, context={'request': request}).data
            })
        
        return Response(result)
