const dialog = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');

let lastActiveElement = null;

openBtn.addEventListener('click', () => {
    lastActiveElement = document.activeElement;
    dialog.showModal();

    const firstInput = dialog.querySelector('input, select, textarea, button');
    if (firstInput) {
        firstInput.focus();
    }
});

closeBtn.addEventListener('click', () => {
    dialog.close('cancel');
});

dialog.addEventListener('close', () => {
    if (lastActiveElement) {
        lastActiveElement.focus();
    }
});

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    [...form.elements].forEach(element => {
        if (element.setCustomValidity) {
            element.setCustomValidity('');
        }
    });

    if (!form.checkValidity()) {
        const email = form.elements.email;
        const phone = form.elements.phone;
        const name = form.elements.name;
        const topic = form.elements.topic;
        const message = form.elements.message;

        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например: name@example.com');
        } else if (email?.validity.valueMissing) {
            email.setCustomValidity('Поле E-mail обязательно для заполнения');
        }

        if (phone?.validity.patternMismatch) {
            phone.setCustomValidity('Используйте формат: +7 (900) 000-00-00');
        } else if (phone?.validity.valueMissing) {
            phone.setCustomValidity('Поле Телефон обязательно для заполнения');
        }

        if (name?.validity.tooShort) {
            name.setCustomValidity('Имя должно содержать минимум 2 символа');
        } else if (name?.validity.valueMissing) {
            name.setCustomValidity('Поле Имя обязательно для заполнения');
        }

        if (topic?.validity.valueMissing) {
            topic.setCustomValidity('Выберите тему обращения');
        }

        if (message?.validity.valueMissing) {
            message.setCustomValidity('Поле Сообщение обязательно для заполнения');
        }

        form.reportValidity();

        [...form.elements].forEach(element => {
            if (element.willValidate) {
                element.toggleAttribute('aria-invalid', !element.checkValidity());
            }
        });

        return;
    }

    alert('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.');

    dialog.close('success');
    form.reset();

    [...form.elements].forEach(element => {
        element.removeAttribute('aria-invalid');
    });
});

const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);

    const normalizedDigits = digits.replace(/^8/, '7');

    const parts = [];

    if (normalizedDigits.length > 0) {
        parts.push('+7');
    }
    if (normalizedDigits.length > 1) {
        parts.push(' (' + normalizedDigits.slice(1, 4));
    }
    if (normalizedDigits.length >= 4) {
        parts[parts.length - 1] += ')';
    }
    if (normalizedDigits.length >= 5) {
        parts.push(' ' + normalizedDigits.slice(4, 7));
    }
    if (normalizedDigits.length >= 8) {
        parts.push('-' + normalizedDigits.slice(7, 9));
    }
    if (normalizedDigits.length >= 10) {
        parts.push('-' + normalizedDigits.slice(9, 11));
    }

    phoneInput.value = parts.join('');
});

dialog.addEventListener('cancel', (e) => {
    const formData = new FormData(form);
    let hasData = false;

    for (let [key, value] of formData.entries()) {
        if (value.toString().trim()) {
            hasData = true;
            break;
        }
    }

    if (hasData) {
        const shouldClose = confirm('Вы уверены, что хотите закрыть форму? Введенные данные будут потеряны.');
        if (!shouldClose) {
            e.preventDefault();
        }
    }
});