#!/usr/bin/env python3
"""
Скрипт для импорта новостей через Django API
Использует системный токен для доступа к приватным views
"""

import requests
import json
from pathlib import Path
import os
import urllib3

# Отключаем предупреждения о непроверенных SSL сертификатах
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class NewsImporter:
    def __init__(self, base_url="https://linfo.tg", token=None, verify_ssl=True):
        self.base_url = base_url
        self.token = token
        self.verify_ssl = verify_ssl
        
    def set_token(self, token):
        """Установка системного токена"""
        self.token = token
        
    def test_connection(self):
        """Тестирование соединения и токена"""
        if not self.token:
            print("❌ Системный токен не установлен")
            return False
            
        test_url = f"{self.base_url}/api/news/import/"
        
        headers = {
            'Authorization': f'Bearer {self.token}',
        }
        
        try:
            response = requests.get(
                test_url,
                headers=headers,
                verify=self.verify_ssl
            )
            
            if response.status_code == 200:
                print("✅ Соединение и токен работают корректно")
                result = response.json()
                print(f"Ответ: {result}")
                return True
            elif response.status_code == 403:
                print("❌ Неверный системный токен")
                return False
            else:
                print(f"❌ Ошибка соединения: {response.status_code}")
                print(f"Ответ: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка соединения: {e}")
            return False
    
    def import_news(self, news_data):
        """Импорт новости через API"""
        if not self.token:
            print("❌ Системный токен не установлен")
            return None
            
        import_url = f"{self.base_url}/api/news/import/"
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
        }
        
        response = requests.post(
            import_url,
            json=news_data,
            headers=headers,
            verify=self.verify_ssl
        )
        
        if response.status_code == 201:
            print("✅ Новость успешно импортирована")
            return response.json()
        elif response.status_code == 403:
            print("❌ Доступ запрещен - неверный системный токен")
            return None
        else:
            print(f"❌ Ошибка импорта: {response.status_code}")
            print(f"Ответ: {response.text}")
            return None
    
    def import_news_with_image(self, news_data, image_path=None):
        """Импорт новости с изображением"""
        if not self.token:
            print("❌ Системный токен не установлен")
            return None
            
        import_url = f"{self.base_url}/api/news/import/"
        
        headers = {
            'Authorization': f'Bearer {self.token}',
        }
        
        files = {}
        if image_path and Path(image_path).exists():
            files['cover_image'] = ('test_image.jpg', open(image_path, 'rb'), 'image/jpeg')
        
        try:
            response = requests.post(
                import_url,
                data=news_data,
                files=files,
                headers=headers,
                verify=self.verify_ssl
            )
            
            if response.status_code == 201:
                print("✅ Новость с изображением успешно импортирована")
                return response.json()
            elif response.status_code == 403:
                print("❌ Доступ запрещен - неверный системный токен")
                return None
            else:
                print(f"❌ Ошибка импорта: {response.status_code}")
                print(f"Ответ: {response.text}")
                return None
                
        finally:
            # Закрываем файл если он был открыт
            if files:
                for file in files.values():
                    file.close()


def main():
    # Получаем токен из переменной окружения или вводим вручную
    system_token = os.getenv('SYSTEM_IMPORT_TOKEN')
    
    if not system_token:
        print("Переменная окружения SYSTEM_IMPORT_TOKEN не найдена")
        system_token = input("Введите системный токен: ").strip()
        
        if not system_token:
            print("❌ Токен не введен")
            return
    
    # Создаем импортер с токеном
    importer = NewsImporter(
        base_url="https://linfo.tg",
        token=system_token,
        verify_ssl=False  # Отключаем верификацию SSL для тестирования
    )
    
    # Тестируем соединение
    if not importer.test_connection():
        print("Не удалось подключиться к API")
        return
    
    # Пример импорта новости
    news_data = {
        "title": "Тестовая новость из скрипта (токен)",
        "description": "Краткое описание новости",
        "content": "Полный текст новости с подробностями...",
        "tags": ["технологии", "тест", "токен"],
        "from_api": True
    }
    
    # Пример импорта с изображением
    news_with_image = {
        "title": "Новость с изображением (токен)",
        "description": "Новость с прикрепленным изображением",
        "content": "Текст новости...",
        "published_at": "2025-07-04",
        "tags": ["фото", "тест"]
    }
    
    # Укажите путь к изображению
    image_path = "image.jpg"
    
    if Path(image_path).exists():
        result = importer.import_news_with_image(news_with_image, image_path)
        if result:
            print(f"ID новости с изображением: {result.get('id')}")
    else:
        print(f"Файл изображения не найден: {image_path}")
