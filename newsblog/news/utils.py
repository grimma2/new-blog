import re
from django.utils.text import slugify as django_slugify
from nltk.corpus import stopwords
import nltk

# Скачиваем необходимые данные NLTK (только если их нет)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def detect_language(text):
    """
    Определяет язык текста используя NLTK stopwords
    """
    if not text or len(text.strip()) < 3:
        return 'en'  # По умолчанию английский
    
    # Список языков для проверки
    languages = ['russian', 'english', 'german', 'french', 'spanish', 'italian']
    
    # Токенизируем текст
    words = re.findall(r'\b\w+\b', text.lower())
    if not words:
        return 'en'
    
    # Считаем совпадения со стоп-словами для каждого языка
    scores = {}
    for lang in languages:
        try:
            lang_stopwords = set(stopwords.words(lang))
            score = sum(1 for word in words if word in lang_stopwords)
            scores[lang] = score
        except:
            scores[lang] = 0
    
    # Возвращаем язык с максимальным счетом
    detected_lang = max(scores, key=scores.get)
    
    # Если счет слишком низкий, возвращаем английский
    if scores[detected_lang] == 0:
        return 'en'
    
    return detected_lang

def transliterate_russian(text):
    """
    Транслитерация русского текста в латиницу
    """
    translit_dict = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    
    result = ''
    for char in text:
        result += translit_dict.get(char, char)
    
    return result

def create_slug(text):
    """
    Создает слаг из текста с поддержкой русского языка
    """
    if not text:
        return ''
    
    # Проверяем наличие русских символов (простой способ)
    has_cyrillic = bool(re.findall(r'[а-яё]', text.lower()))
    
    if has_cyrillic:
        # Транслитерируем русский текст
        transliterated = transliterate_russian(text)
        return django_slugify(transliterated)
    else:
        # Для латинского текста используем стандартный slugify
        return django_slugify(text)

def get_or_create_tag_by_name(name):
    """
    Получает или создает тег по имени, автоматически создавая слаг.
    Если тега нет в базе - создает новый.
    """
    from .models import Tag
    
    if not name or not name.strip():
        return None
    
    name = name.strip()
    slug = create_slug(name)
    
    # Используем get_or_create для атомарной операции
    tag, created = Tag.objects.get_or_create(
        slug=slug,
        defaults={'name': name}
    )
    
    # Если тег уже существовал, но с другим именем, обновляем имя
    if not created and tag.name != name:
        tag.name = name
        tag.save()
        print(f"📝 Обновлено имя тега: '{tag.name}' (slug: {tag.slug})")
    elif created:
        print(f"✅ Создан новый тег: '{tag.name}' (slug: {tag.slug})")
    
    return tag 