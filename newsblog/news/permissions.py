"""
Кастомные разрешения для системного токена
"""
from django.conf import settings
from rest_framework.permissions import BasePermission


class HasSystemToken(BasePermission):
    """
    Разрешение для проверки системного токена без обязательной аутентификации
    """
    
    def has_permission(self, request, view):
        """
        Проверяем системный токен в заголовке Authorization
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return False
            
        try:
            # Ожидаем формат: "Bearer your-token" или "Token your-token"
            auth_parts = auth_header.split()
            
            if len(auth_parts) != 2:
                return False
                
            token_type, token = auth_parts
            
            # Поддерживаем оба формата
            if token_type.lower() not in ('bearer', 'token'):
                return False
                
            # Проверяем токен
            return token == settings.SYSTEM_IMPORT_TOKEN
                
        except (ValueError, AttributeError):
            return False 