from rest_framework import serializers
from .models import News, Tag
from .utils import get_or_create_tag_by_name

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]

class NewsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source="tags", required=False
    )
    tag_slugs = serializers.ListField(
        child=serializers.CharField(max_length=100), 
        write_only=True, required=False, allow_empty=True
    )

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "cover_image",
            "description",
            "content",
            "published_at",
            "tags",
            "tag_ids",
            "tag_slugs",
        ]
        read_only_fields = ["slug"]
        extra_kwargs = {
            "cover_image": {"required": False, "allow_null": True}
        }

    def create(self, validated_data):
        # Обрабатываем все поля связанные с тегами отдельно
        tag_slugs = validated_data.pop('tag_slugs', [])
        tag_ids = validated_data.pop('tags', [])  # это может прийти от tag_ids
        
        # Устанавливаем флаг from_api для новостей созданных через API
        validated_data['from_api'] = True
        
        # Создаем новость
        news = News.objects.create(**validated_data)
        
        # Обрабатываем теги
        tags_to_set = []
        
        # Добавляем теги по ID (если переданы)
        if tag_ids:
            tags_to_set.extend(tag_ids)
        
        # Добавляем теги по slug/name (если переданы)
        if tag_slugs:
            for tag_input in tag_slugs:
                tag = get_or_create_tag_by_name(tag_input)
                tags_to_set.append(tag)
        
        # Устанавливаем теги
        if tags_to_set:
            news.tags.set(tags_to_set)
        
        return news

    def update(self, instance, validated_data):
        # Обрабатываем все поля связанные с тегами отдельно
        tag_slugs = validated_data.pop('tag_slugs', None)
        tag_ids = validated_data.pop('tags', None)  # это может прийти от tag_ids
        
        # Обновляем основные поля
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Обрабатываем теги если они переданы
        tags_to_set = []
        update_tags = False
        
        # Добавляем теги по ID (если переданы)
        if tag_ids is not None:
            tags_to_set.extend(tag_ids)
            update_tags = True
        
        # Добавляем теги по slug/name (если переданы)
        if tag_slugs is not None:
            for tag_input in tag_slugs:
                tag = get_or_create_tag_by_name(tag_input)
                tags_to_set.append(tag)
            update_tags = True
        
        # Устанавливаем теги только если они были переданы
        if update_tags:
            instance.tags.set(tags_to_set)
        
        return instance

    def to_representation(self, instance):
        """Переопределяем представление для полного URL изображения"""
        data = super().to_representation(instance)
        if instance.cover_image:
            request = self.context.get('request')
            if request:
                data['cover_image'] = request.build_absolute_uri(instance.cover_image.url)
            else:
                data['cover_image'] = instance.cover_image.url
        return data 