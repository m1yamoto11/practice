const dialog = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');

openBtn.addEventListener('click', function() {
    dialog.showModal();
    clearValidationErrors();
});

closeBtn.addEventListener('click', function() {
    dialog.close();
    clearValidationErrors();
});

function showFieldError(fieldName, message) {
    const field = form[fieldName];
    
    if (field.tagName === 'SELECT') {
        field.classList.add('form__select--error');
    } else if (field.tagName === 'TEXTAREA') {
        field.classList.add('form__textarea--error');
    } else {
        field.classList.add('form__input--error');
    }
    
    let errorElement = field.parentNode.querySelector('.form__error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'form__error';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(fieldName) {
    const field = form[fieldName];
    field.classList.remove('form__input--error', 'form__select--error', 'form__textarea--error');
    
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const errorElements = form.querySelectorAll('.form__error');
    errorElements.forEach(el => el.remove());
    
    const errorFields = form.querySelectorAll('.form__input--error, .form__select--error, .form__textarea--error');
    errorFields.forEach(field => {
        field.classList.remove('form__input--error', 'form__select--error', 'form__textarea--error');
    });
}

function validateField(fieldName) {
    const field = form[fieldName];
    const value = field.value.trim();
    
    clearFieldError(fieldName);
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(fieldName, 'Имя обязательно для заполнения');
                return false;
            }
            if (value.length < 2) {
                showFieldError(fieldName, 'Имя должно содержать минимум 2 символа');
                return false;
            }
            if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(value)) {
                showFieldError(fieldName, 'Имя может содержать только буквы, пробелы и дефисы');
                return false;
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(fieldName, 'Email обязателен для заполнения');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Введите корректный email адрес');
                return false;
            }
            break;
            
        case 'phone':
            if (!value) {
                showFieldError(fieldName, 'Телефон обязателен для заполнения');
                return false;
            }
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(fieldName, 'Введите телефон в формате +7 (900) 000-00-00');
                return false;
            }
            break;
            
        case 'topic':
            if (!value) {
                showFieldError(fieldName, 'Выберите тему обращения');
                return false;
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(fieldName, 'Сообщение обязательно для заполнения');
                return false;
            }
            if (value.length < 10) {
                showFieldError(fieldName, 'Сообщение должно содержать минимум 10 символов');
                return false;
            }
            if (value.length > 1000) {
                showFieldError(fieldName, 'Сообщение не должно превышать 1000 символов');
                return false;
            }
            break;
    }
    
    return true;
}

function validateForm() {
    const fields = ['name', 'email', 'phone', 'topic', 'message'];
    let isValid = true;
    
    fields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    return isValid;
}

['name', 'email', 'phone', 'topic', 'message'].forEach(fieldName => {
    const field = form[fieldName];
    field.addEventListener('blur', () => validateField(fieldName));
    field.addEventListener('input', () => {
        if (field.classList.contains('form__input--error') || 
            field.classList.contains('form__select--error') || 
            field.classList.contains('form__textarea--error')) {
            validateField(fieldName);
        }
    });
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        const firstErrorField = form.querySelector('.form__input--error, .form__select--error, .form__textarea--error');
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }
    
    alert('Форма успешно отправлена!');
    dialog.close();
    form.reset();
    clearValidationErrors();
});

phoneInput.addEventListener('input', function() {
    let input = phoneInput.value;
    let numbers = input.replace(/[^0-9]/g, '');
    
    // Если пользователь начинает с 7, убираем её - она будет добавлена автоматически
    if (numbers.startsWith('7')) {
        numbers = numbers.slice(1);
    }
    
    // Ограничиваем до 10 цифр (без кода страны)
    if (numbers.length > 10) {
        numbers = numbers.slice(0, 10);
    }
    
    let formatted = '+7';
    
    if (numbers.length > 0) {
        formatted += ' (' + numbers.slice(0, 3);
        
        if (numbers.length >= 3) {
            formatted += ')';
            
            if (numbers.length > 3) {
                formatted += ' ' + numbers.slice(3, 6);
                
                if (numbers.length > 6) {
                    formatted += '-' + numbers.slice(6, 8);
                    
                    if (numbers.length > 8) {
                        formatted += '-' + numbers.slice(8, 10);
                    }
                }
            }
        }
    }
    
    phoneInput.value = formatted;
});