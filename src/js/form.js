/* ЛОГИКА ПОЛЕЙ ВВОДА */

const form = document.querySelector('.form');
const inputContainers = form.querySelectorAll('div');
const inputs = form.querySelectorAll('.input');
const phoneInput = form.querySelector('#phone');
const submitButton = form.querySelector('.send-panel__button--submit');
const resetButton = form.querySelector('.send-panel__button--reset');
const modalSuccess = document.querySelector('.modal--success');
const modalFailure = document.querySelector('.modal--failure');
const modalCloseButton = document.querySelectorAll('.modal__button');

let requireInputArr = [];

//Функция проверки атрибута required у полей ввода

const requiredChecker = () => {
    inputs.forEach((item) => {
        if (item.hasAttribute('required')) {
            item.parentElement.classList.add('required-input');
            requireInputArr.push(item);
        }
    })
}

//Функция удаляющая все иконки у поля ввода

const iconCleaner = (n) => {
    n.classList.remove('required-input', 'warning-input', 'correct-input');
}

//Функция автозаполнения поля ввода телефона

const phoneAutocomplete = () => {
    phoneInput.onfocus = () => {
        if (phoneInput.value === '') {
            phoneInput.value = '+7';
        }
    }
}

//Функция проверки формата и содержания полей ввода 

const validityChecker = () => {
    inputs.forEach((input) => {
        input.oninput = () => {
            if (input.validity.typeMismatch || input.validity.patternMismatch) {
                iconCleaner(input.parentElement);
                input.parentElement.classList.add('warning-input');
            } else if (input.value !== '' && !input.validity.typeMismatch && !input.validity.patternMismatch){
                iconCleaner(input.parentElement);
                input.parentElement.classList.add('correct-input');
            } else {
                iconCleaner(input.parentElement);
                requiredChecker();
            }
        }
    })
}

//Функция проверки каждого инпута на соответсвие требованиям (для отправки формы)

const inputSubmitChecker = () => {
    for (input of inputs) {
        if (input.validity.typeMismatch || input.validity.patternMismatch) {
            return false;
        }
    }

    for (input of requireInputArr) {
        if (input.value === '') {
            return false;
        }
    }

    return true;
}

//Функция отмены введенных значений

const resetForm = () => {
    inputs.forEach((input) => {
        input.value = '';
        iconCleaner(input.parentElement);
    })
    requiredChecker();
}

//Вызов всех функций

phoneAutocomplete();
requiredChecker();
validityChecker();

//Кнопка отмены ввода

resetButton.addEventListener('click', () => {
    resetForm(form);
})

//Кнопка закрытия модального окна

modalCloseButton.forEach((button) => {
    button.addEventListener('click', () => {
    modalSuccess.classList.remove('modal--active');
    modalFailure.classList.remove('modal--active');
    document.body.style.overflow = 'visible';
    })
})

/* Скрипт для отправки сообщения */

const token = '5683729746:AAGC6h_EiKOBbxzHQjOjzCjjuxe41VwFp08';
const chatId = '-1001546624725';
const URI_API = ` https://api.telegram.org/bot${ token }/sendMessage`;

form.addEventListener('submit', function(evt) {
    evt.preventDefault();

    let formMessage = `<b>Отклик с сайта!</b>\n`;
    formMessage += `<b>Отправитель: </b> ${ this.name.value }\n`;
    formMessage += `<b>Компания: </b> ${ this.company_name.value }\n`;
    formMessage += `<b>Email: </b> ${ this.email.value }\n`
    formMessage += `<b>Телефон: </b> ${ this.phone.value }\n`
    formMessage += `<b>Дополнительная информация: </b> ${ this.message.value }\n`;
    
    if (inputSubmitChecker()) {
        axios.post(URI_API, {
            chat_id: chatId,
            text: formMessage,
            parse_mode: 'html'
        });

        resetForm(form);

        modalSuccess.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    } else {
        modalFailure.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    }
})