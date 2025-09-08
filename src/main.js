const dialog = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');

openBtn.addEventListener('click', function() {
    dialog.showModal();
});

closeBtn.addEventListener('click', function() {
    dialog.close();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const topic = form.topic.value;
    const message = form.message.value;
    
    if (!name) {
        alert('Введите имя');
        return;
    }
    if (!email) {
        alert('Введите email');
        return;
    }
    if (!phone) {
        alert('Введите телефон');
        return;
    }
    if (!topic) {
        alert('Выберите тему');
        return;
    }
    if (!message) {
        alert('Введите сообщение');
        return;
    }
    
    alert('Форма отправлена!');
    dialog.close();
    form.reset();
});

phoneInput.addEventListener('input', function() {
    let value = phoneInput.value.replace(/[^0-9]/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length >= 1) {
        value = '+7 ' + value.slice(1);
    }
    if (value.length >= 6) {
        value = value.slice(0, 5) + '(' + value.slice(5);
    }
    if (value.length >= 10) {
        value = value.slice(0, 9) + ')' + value.slice(9);
    }
    if (value.length >= 14) {
        value = value.slice(0, 13) + '-' + value.slice(13);
    }
    if (value.length >= 17) {
        value = value.slice(0, 16) + '-' + value.slice(16);
    }
    
    phoneInput.value = value;
});