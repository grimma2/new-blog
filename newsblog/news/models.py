from uuid import uuid4
from django.db import models
from django.utils.text import slugify
from django.core.validators import RegexValidator


# Кастомный валидатор для слагов с поддержкой Unicode
unicode_slug_validator = RegexValidator(
    regex=r'^[-\w\u0400-\u04FF]+$',
    message='Слаг может содержать только буквы, цифры, дефисы и знаки подчеркивания (включая кириллицу).',
    code='invalid_slug'
)

def create_model_slug(text):
    """Создает слаг из текста используя стандартный Django slugify"""
    if not text:
        return ''
    
    # Просто используем стандартный Django slugify с поддержкой Unicode
    return slugify(text, allow_unicode=True)

class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, unique=True, blank=True, validators=[unicode_slug_validator])

    class Meta:
        verbose_name = "Рубрика"
        verbose_name_plural = "Рубрики"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = create_model_slug(self.name)
            # ensure uniqueness
            if Tag.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{self.slug}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)


def news_cover_path(instance, filename):
    return f"news/{instance.id}/{filename}"


class News(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.CharField(unique=True, max_length=200, blank=True, validators=[unicode_slug_validator])
    cover_image = models.ImageField(upload_to=news_cover_path)
    description = models.TextField()
    content = models.TextField()
    published_at = models.DateTimeField(db_index=True)
    from_api = models.BooleanField(default=False, help_text="Создано через API")
    tags = models.ManyToManyField(Tag, related_name="news")

    class Meta:
        ordering = ["-published_at"]
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = create_model_slug(self.title)
            # Ensure uniqueness by appending UUID if exists
            if News.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{self.slug}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)
