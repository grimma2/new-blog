from django.contrib import admin

from .models import News, Tag

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    
    class Media:
        js = ('admin/js/news_admin.js',)

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "published_at", "from_api")
    list_filter = ("published_at", "from_api", "tags")
    search_fields = ("title", "description", "content")
    filter_horizontal = ("tags",)
    
    class Media:
        js = ('admin/js/news_admin.js',)
