#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import os
from datetime import datetime, timedelta

# URL API
BASE_URL = "http://localhost:8000/api"

# Путь к тестовому изображению
TEST_IMAGE_PATH = "test_image.jpg"

def create_test_image():
    """Создает простое тестовое изображение если его нет"""
    if not os.path.exists(TEST_IMAGE_PATH):
        print("📷 Создаем тестовое изображение...")
        try:
            from PIL import Image, ImageDraw, ImageFont
            
            # Создаем изображение 800x600
            img = Image.new('RGB', (800, 600), color='lightblue')
            draw = ImageDraw.Draw(img)
            
            # Добавляем текст
            try:
                font = ImageFont.truetype("arial.ttf", 40)
            except:
                font = ImageFont.load_default()
            
            text = "TEST NEWS IMAGE"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            position = ((800 - text_width) // 2, (600 - text_height) // 2)
            draw.text(position, text, fill='darkblue', font=font)
            
            # Добавляем рамку
            draw.rectangle([10, 10, 790, 590], outline='navy', width=5)
            
            img.save(TEST_IMAGE_PATH, 'JPEG')
            print(f"✅ Тестовое изображение создано: {TEST_IMAGE_PATH}")
            
        except ImportError:
            print("⚠️ Pillow не установлен. Создаем простой файл...")
            # Создаем простой файл-заглушку
            with open(TEST_IMAGE_PATH, 'wb') as f:
                # Минимальный JPEG header для валидного файла
                f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9')
            print(f"✅ Простой тестовый файл создан: {TEST_IMAGE_PATH}")

def create_test_news():
    """Создает 5 тестовых новостей"""
    
    # Проверяем/создаем тестовое изображение
    create_test_image()
    
    # Данные для тестовых новостей
    test_news = [
        {
            "title": "Новые технологии в искусственном интеллекте",
            "description": "Обзор последних достижений в области ИИ и машинного обучения",
            "content": "Искусственный интеллект продолжает развиваться быстрыми темпами. В этой статье мы рассмотрим последние достижения в области глубокого обучения, нейронных сетей и их практического применения в различных отраслях.",
            "tag_slugs": ["рубрика1"]
        },
        {
            "title": "Breakthrough in Quantum Computing Research",
            "description": "Scientists achieve new milestone in quantum computing development",
            "content": "Researchers at leading universities have made significant progress in quantum computing technology. This breakthrough could revolutionize computing power and solve complex problems that are currently impossible for classical computers.",
            "tag_slugs": ["рубрика2"]
        },
        {
            "title": "Экологические инициативы в современном мире",
            "description": "Как компании и государства борются с изменением климата",
            "content": "Изменение климата остается одной из главных проблем современности. В статье рассматриваются различные экологические инициативы, которые предпринимаются на государственном и корпоративном уровне для борьбы с глобальным потеплением.",
            "tag_slugs": ["рубрика2"]
        },
        {
            "title": "The Future of Space Exploration",
            "description": "Mars missions and beyond: what's next for humanity in space",
            "content": "Space exploration is entering a new era with private companies joining government agencies in the race to explore Mars and beyond. This article examines upcoming missions and the technology that will make them possible.",
            "tag_slugs": ["рубрика2"]
        },
        {
            "title": "Революция в медицинских технологиях",
            "description": "Как новые технологии меняют подход к лечению и диагностике",
            "content": "Медицинские технологии развиваются с невероятной скоростью. От телемедицины до роботизированной хирургии - новые решения кардинально меняют подход к здравоохранению и делают медицинскую помощь более доступной и эффективной.",
            "tag_slugs": ["рубрика2"]
        }
    ]
    
    print("🚀 Создаем 5 тестовых новостей...")
    
    for i, news_data in enumerate(test_news, 1):
        print(f"\n📝 Создаем новость {i}/5: {news_data['title'][:50]}...")
        
        try:
            # Подготавливаем данные для multipart/form-data
            files = {
                'cover_image': ('test_image.jpg', open(TEST_IMAGE_PATH, 'rb'), 'image/jpeg')
            }
            
            # Генерируем дату публикации (последние 30 дней)
            published_date = datetime.now() - timedelta(days=i*5)  # Разные даты для каждой новости
            
            data = {
                'title': news_data['title'],
                'description': news_data['description'],
                'content': news_data['content'],
                'published_at': published_date.isoformat(),
            }
            
            # Добавляем теги как отдельные поля
            for j, tag in enumerate(news_data['tag_slugs']):
                data[f'tag_slugs[{j}]'] = tag
            
            response = requests.post(
                f"{BASE_URL}/news/import/",
                files=files,
                data=data
            )
            
            files['cover_image'][1].close()  # Закрываем файл
            
            if response.status_code == 201:
                result = response.json()
                print(f"✅ Новость создана! ID: {result['id']}")
                print(f"   Заголовок: {result['title']}")
                print(f"   Slug: {result['slug']}")
                print(f"   Дата публикации: {result['published_at']}")
                print(f"   Теги: {', '.join([tag['name'] for tag in result['tags']])}")
                if result.get('cover_image'):
                    print(f"   Изображение: ✅")
            else:
                print(f"❌ Ошибка {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка соединения: {e}")
        except Exception as e:
            print(f"❌ Ошибка: {e}")

def check_created_news():
    """Проверяем созданные новости"""
    print("\n📋 Проверяем созданные новости...")
    
    try:
        response = requests.get(f"{BASE_URL}/news/")
        
        if response.status_code == 200:
            result = response.json()
            news_list = result.get('results', [])
            
            print(f"✅ Найдено {len(news_list)} новостей:")
            for news in news_list[:10]:  # Показываем первые 10
                print(f"   • {news['title']} (ID: {news['id']}, Дата: {news['published_at'][:10]})")
                
        else:
            print(f"❌ Ошибка получения новостей: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка соединения: {e}")

if __name__ == "__main__":
    print("=== Создание тестовых новостей ===")
    create_test_news()
    check_created_news()
    print("\n=== Готово! ===")
    
    # Удаляем тестовое изображение
    if os.path.exists(TEST_IMAGE_PATH):
        os.remove(TEST_IMAGE_PATH)
        print(f"🗑️ Тестовое изображение удалено: {TEST_IMAGE_PATH}") 