const form = document.querySelector('.form');
const inputContainers = form.querySelectorAll('div');
const inputs = form.querySelectorAll('.input');
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

//Функция проверки формата и содержания полей ввода 

const validityChecker = () => {
    inputs.forEach((input) => {
        input.oninput = () => {
            if (input.validity.typeMismatch) {
                iconCleaner(input.parentElement);
                input.parentElement.classList.add('warning-input');
            } else if (input.value !== '' && !input.validity.typeMismatch){
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
        if (input.validity.typeMismatch) {
            return false;
        }
    }

    for (input of requireInputArr) {
        if (input.value === '') {
            console.log('hui');
            return false;
        }
    }

    return true;
}

//Функция отмены введенных значений

const resetForm = (form) => {
    form.reset();
    
    inputs.forEach((input) => {
        iconCleaner(input.parentElement);
    })
    requiredChecker();
}

//Вызов всех функций

requiredChecker();
validityChecker();
console.log(requireInputArr);

//Кнопка отмены ввода

resetButton.addEventListener('click', () => {
    resetForm(form);
})

//Кнопка отправки формы

submitButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (inputSubmitChecker()) {
        resetForm(form);

        modalSuccess.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    } else {
        modalFailure.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    }
})

//Кнопка закрытия модального окна

modalCloseButton.forEach((button) => {
    button.addEventListener('click', () => {
    modalSuccess.classList.remove('modal--active');
    modalFailure.classList.remove('modal--active');
    document.body.style.overflow = 'visible';
    })
})