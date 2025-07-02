// Функция транслитерации русского текста
function transliterateRussian(text) {
    const translitMap = {
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
    };
    
    return text.split('').map(char => translitMap[char] || char).join('');
}

// Функция создания слага
function createSlug(text) {
    if (!text) return '';
    
    // Проверяем наличие кириллицы
    const hasCyrillic = /[а-яё]/i.test(text);
    
    if (hasCyrillic) {
        // Транслитерируем и создаем слаг
        const transliterated = transliterateRussian(text);
        return transliterated
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // убираем спецсимволы
            .replace(/[\s_-]+/g, '-') // заменяем пробелы и подчеркивания на дефисы
            .replace(/^-+|-+$/g, ''); // убираем дефисы в начале и конце
    } else {
        // Для латинского текста используем стандартную логику
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const titleField = document.querySelector('#id_title');
    const slugField = document.querySelector('#id_slug');
    
    if (titleField && slugField) {
        // Автоматическое заполнение слага при вводе заголовка
        titleField.addEventListener('input', function() {
            // Заполняем слаг только если он пустой
            if (!slugField.value.trim()) {
                slugField.value = createSlug(this.value);
            }
        });
        
        // Кнопка для пересоздания слага
        const slugContainer = slugField.parentElement;
        if (slugContainer && !slugContainer.querySelector('.regenerate-slug-btn')) {
            const regenerateBtn = document.createElement('button');
            regenerateBtn.type = 'button';
            regenerateBtn.className = 'regenerate-slug-btn';
            regenerateBtn.textContent = 'Пересоздать слаг';
            regenerateBtn.style.marginLeft = '10px';
            regenerateBtn.style.padding = '5px 10px';
            regenerateBtn.style.fontSize = '12px';
            
            regenerateBtn.addEventListener('click', function() {
                slugField.value = createSlug(titleField.value);
            });
            
            slugContainer.appendChild(regenerateBtn);
        }
    }
});

// Также для тегов
document.addEventListener('DOMContentLoaded', function() {
    const tagNameField = document.querySelector('#id_name');
    const tagSlugField = document.querySelector('#id_slug');
    
    if (tagNameField && tagSlugField) {
        tagNameField.addEventListener('input', function() {
            if (!tagSlugField.value.trim()) {
                tagSlugField.value = createSlug(this.value);
            }
        });
        
        // Кнопка для пересоздания слага тега
        const tagSlugContainer = tagSlugField.parentElement;
        if (tagSlugContainer && !tagSlugContainer.querySelector('.regenerate-tag-slug-btn')) {
            const regenerateBtn = document.createElement('button');
            regenerateBtn.type = 'button';
            regenerateBtn.className = 'regenerate-tag-slug-btn';
            regenerateBtn.textContent = 'Пересоздать слаг';
            regenerateBtn.style.marginLeft = '10px';
            regenerateBtn.style.padding = '5px 10px';
            regenerateBtn.style.fontSize = '12px';
            
            regenerateBtn.addEventListener('click', function() {
                tagSlugField.value = createSlug(tagNameField.value);
            });
            
            tagSlugContainer.appendChild(regenerateBtn);
        }
    }
}); 