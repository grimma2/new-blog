# Generated by Django 4.2.23 on 2025-07-06 13:31

from django.db import migrations, models
import news.models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_alter_news_slug_alter_tag_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='cover_image',
            field=models.FileField(upload_to=news.models.news_cover_path),
        ),
    ]
