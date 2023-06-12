

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
        blockElement.innerHTML = `<img class="user-prev-photo" src="${blockData.avatar_url}" alt="${blockData.login}"> <span class="user-prev-name">${blockData.login}</span>`;

        this.blockList.append(blockElement);
    }
};

class Search {
    constructor(view) {
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.searchData.bind(this))
    }

    async searchData() {
        return await fetch(`https://api.github.com/search/users?q=${this.view.searchInput.value}`)
        .then((res) => {
          if(res.ok) {
            res.json().then(res => {
                
              res.items.forEach(data => this.view.createBlock(data))
            });
          }
        } )
    }

};

new Search(new View());