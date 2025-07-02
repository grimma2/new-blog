from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import NewsViewSet, TagViewSet, NewsImportView, HomePageViewSet

router = DefaultRouter()
router.register(r"news", NewsViewSet, basename="news")
router.register(r"tags", TagViewSet, basename="tag")
router.register(r"homepage", HomePageViewSet, basename="homepage")

urlpatterns = [
    path("news/import/", NewsImportView.as_view(), name="news-import"),
    path("", include(router.urls)),
] 