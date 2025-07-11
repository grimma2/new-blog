# Generated by Django 4.2.23 on 2025-07-02 14:01

from django.db import migrations, models
import news.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Tag',
                'verbose_name_plural': 'Tags',
            },
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(blank=True, max_length=200, unique=True)),
                ('cover_image', models.ImageField(upload_to=news.models.news_cover_path)),
                ('description', models.TextField()),
                ('content', models.TextField()),
                ('published_at', models.DateTimeField(db_index=True)),
                ('tags', models.ManyToManyField(related_name='news', to='news.tag')),
            ],
            options={
                'verbose_name': 'News',
                'verbose_name_plural': 'News',
                'ordering': ['-published_at'],
            },
        ),
    ]
