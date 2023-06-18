const resultField = document.querySelector('.result-field');
const inputField = document.querySelector('.input-field');
const close = createElement('div', 'close');


function createElement(elementTag, elementClass) { //функция создания элементов
    const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
};

function clearDropBlock() { //функция очистки выпадающего меню
    const searchedElements = inputField.querySelectorAll('div');
    searchedElements.forEach(item => item.remove());
}

async function search(event) { //асинхронная функция поиска
    try{const inputData = inputField.querySelector('input'); //получаем доступ к элементу поля ввода
        let toFetch = inputData.value.trim(); //записываем в переменную результат ввода без пробелов в начале и конце
        for (let i = 0; i<toFetch.length; i++) { //проверка на латиницу и цифры
            if(toFetch[i].charCodeAt(0) > 122) {
                inputData.value = '';
                clearDropBlock();   
            return alert('введены не латинские буквы или цифры');    
            }
        }
        if (toFetch.length == 0) { //проверка на пустое поле ввода
            inputData.value = '';
            clearDropBlock();
        return };

        clearDropBlock(); //очищаем выпадающее меню от предыдущей выдачи

        const fetchData = await fetch(`https://api.github.com/search/repositories?q=${toFetch}`) //отправляем запрос, дожидаемся ответа
        .then(res => res.json())// конвертируем из джэйсона
        .then(res => res.items); //получаем доступ к необходимым данным. 
        if (fetchData.length < 1) { //проверяем не пришел ли пустой массив (нет таких пользователей)
            inputData.value = '';
            return alert('такого аккаунта не существует')
        }


    for (let i=0; i<5; i++){  
        if (fetchData.length < i+1) {
            return } //проверяем на длину массива в айтемс, чтобы не гонять лишние циклы и не плодить ошибку в консоль
        
        function createResultBlock() { //функция создания блока выдачи
            const result = createElement('div', 'result-block');
            const resInfo = createElement('div', 'result-info');
            resInfo.insertAdjacentHTML("afterbegin", `<div> <p class='p'>Name: ${fetchData[i].name}</p>  <p class='clear'>Owner: ${fetchData[i].owner.login}.login</p>  <p>Stars: ${fetchData[i].stargazers_count}</p></div>`); //формируем контент блока выдачи
            result.append(resInfo); 
            const closeBtn = close.cloneNode(true); 
            function closeB(event) { //функция удаления блока выдачи
                event.target.parentElement.remove();
                variant.removeEventListener('click', createResultBlock); //удаляем листнер создания блока
                closeBtn.removeEventListener('click', closeB); //удаляем листнер кнопки удаления
            }
            closeBtn.addEventListener('click', closeB); //навешиваем листнер на кнопку удаления
            result.append(closeBtn);            
            resultField.append(result);
            inputData.value = '';
            clearDropBlock();
        }
        
        const variant = createElement('div', 'variant-block'); //создаем элемент выдачи выпадающего
        variant.insertAdjacentHTML("afterbegin", `<button>${fetchData[i].name}</button>`); //наполняем его контентом
        variant.addEventListener('click', createResultBlock); // вешаем листнер на кнопку варианта выпадающего меню
        inputField.append(variant); //апендим вариант в блок
    }}
    
    catch(error) {
        console.log(error);
    }
}

function debounce(fn, timeout) { //дебаунс 
    let timer = null;
    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
        timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,);
	});
    };
}

const debouncedInput = debounce(search, 600); 
inputField.addEventListener('keyup', debouncedInput);

