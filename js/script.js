/* 

class View {
    constructor(){
        this.app = document.querySelector('.app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = "github search users";

        this.plate = this.createElement('div', 'plate');

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input','search-input');
        this.searchLine.append(this.searchInput);

        this.blockWrapper = this.createElement('div', 'block-wrapper');
        this.blockList = this.createElement('ul', 'blocks');
        this.blockWrapper.append(this.blockList);
        this.plate.append(this.blockWrapper);


        this.app.append(this.title);
        this.app.append(this.plate);
        this.plate.append(this.searchLine);
        

    }
    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
        };
    
    createBlock(blockData) {
        const blockElement = this.createElement('li', 'repository');
        blockElement.innerHTML = `
        <p>${blockData.name}</p>
        `;

        this.blockList.append(blockElement);
    }

    clearBlock(contain) {
        contain.forEach(element => {
            element.remove();
        });
    }
};

class Search {
    constructor(view) {
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.searchData.bind(this))
    }

    async searchData() {
        return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}`) 
        .then((res) => {
            const blockList = document.querySelector('.blocks');
            const elements = blockList.querySelectorAll('.repository');
            if (elements.length > 0) {
                this.view.clearBlock(elements);
            }
          if(res.ok) {
            res.json().then(res => {
                for (let i=0; i<2; i++) {
                    this.view.createBlock(res.items[i])
                    
                }
            });
          }
        } )
    }

};
new Search(new View()); */

/* async function showRes() {
    const test = await fetch("https://api.github.com/search/repositories?q=react").then(res => res.json().then(res => res.items));
    for (let i = 0; i<5; i++) {
        console.log(test[i]);
        const block = document.createElement('div');
        block.insertAdjacentHTML("afterbegin", `<p class='p'>${test[i].name}</p> <p class='clear'>${test[i].owner.login}.login</p> <p>${test[i].stargazers_count}</p>`);
        const p = block.querySelector('.p');
        p.addEventListener('click', function () {
            console.log('click on name');
        })
        const clear = block.querySelector('.clear');
        clear.addEventListener('click', function (event) {
            event.stopPropagation();
            console.log('click on owner');           
        });
    const app = document.querySelector('.app');
    app.append(block);
    }}
document.addEventListener('click', showRes); */


const resultField = document.querySelector('.result-field');
const inputField = document.querySelector('.input-field');
const close = createElement('div', 'close');


function createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
};

function clearDropBlock() {
    const searchedElements = inputField.querySelectorAll('div');
    searchedElements.forEach(item => item.remove())
}

async function search() {
    const inputData = inputField.querySelector('input');
       /*  const searchedElements = inputField.querySelectorAll('div'); */
        clearDropBlock();

        const fetchData = await fetch(`https://api.github.com/search/repositories?q=${inputData.value}`).then(res => res.json().then(res => res.items));
    for (let i=0; i<5; i++){        
        const variant = createElement('div', 'variant-block');
        variant.insertAdjacentHTML("afterbegin", `<button>${fetchData[i].name}</button>`);
        variant.addEventListener('click', function () {
            const result = createElement('div', 'result-block');
            result.insertAdjacentHTML("afterbegin", `    <div> <p class='p'>Name: ${fetchData[i].name}</p>  <p class='clear'>Owner: ${fetchData[i].owner.login}.login</p>  <p>Stars: ${fetchData[i].stargazers_count}</p></div>`);
            const closeBtn = close.cloneNode(true);
            
            closeBtn.addEventListener('click', function(event){
                
                event.target.parentElement.remove();
            });
            result.append(closeBtn);

            
            resultField.append(result);
            inputData.value = '';
            clearDropBlock();
        })

        inputField.append(variant);
    }
}

function debounce(fn, timeout) {
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

const debouncedInput = debounce(search, 1000)
inputField.addEventListener('keyup', debouncedInput);