
function DropdownViewModel(category, items, id) {
  var self = this;
  self.id = ko.observable(id);
  self.category = ko.observable(category);
  self.items = ko.observableArray(items);
  self.isOpen = ko.observable(false);

  self.toggleDropdown = () => {
    self.isOpen(!self.isOpen());
  };

}

function ViewModel() {
  var self = this;

  self.isOpen = ko.observable(true);

  self.toggleDropdown = () => {
    self.isOpen(!self.isOpen());
  };

  self.categories = ko.observableArray([
    {
      category: 'Обязательные для всех', 
      items: ['ИНН', 'Паспорт', 'Элемент 3'] 
    },
    {
      category: 'Специальные', 
      items: ['Элемент 4', 'Элемент 5', 'Элемент 6'] 
    },
    {
      category: 'Обязательные для трудоустройства', 
      items: ['Элемент 7', 'Элемент 8', 'Элемент 9'] 
    }
  ]);

  self.dropdowns = ko.observableArray([]);

  
  self.categories().forEach(function(category, index) {
    var dropdown = new DropdownViewModel(category.category, category.items, 'dropdown-' + index);
    self.dropdowns.push(dropdown);
  });

}

var viewModel = new ViewModel();
ko.applyBindings(viewModel, document.getElementById('list'));

const itemList = document.querySelector('.list');
const selectButtons = document.querySelectorAll('.btn-select');
const selectButtonsItem = document.querySelectorAll('.btn-select-item');

let selectedItem = null;
let selectedCategoryItem = null;

selectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (selectedItem) {
            selectedItem.classList.remove('selected');
        }

        const listItem = e.target.closest('.list-item');
        listItem.classList.add('selected');
        selectedItem = listItem;

        listItem.style.position = 'absolute';
        listItem.style.zIndex = 1000;
        const originalX = e.clientX - listItem.getBoundingClientRect().left;
        const originalY = e.clientY - listItem.getBoundingClientRect().top;

        const moveItem = (e) => {
            const x = e.clientX - originalX;
            const y = e.clientY - originalY;
            listItem.style.left = x + 'px';
            listItem.style.top = y + 'px';
        };

        const dropItem = (e) => {
            document.removeEventListener('mousemove', moveItem);
            document.removeEventListener('mouseup', dropItem);

            itemList.removeChild(listItem);
            const dropTarget = document.elementFromPoint(e.clientX, e.clientY).closest('.list-item');
            if (dropTarget && dropTarget.classList.contains('list-item')) {
                const index = Array.from(dropTarget.parentElement.children).indexOf(dropTarget);
                itemList.insertBefore(listItem, dropTarget);
                listItem.style.position = 'static';
                selectedItem = null;
            } else {
              itemList.appendChild(listItem);
              listItem.style.position = 'static';
              selectedItem = null;
            }
        };

        document.addEventListener('mousemove', moveItem);
        document.addEventListener('mouseup', dropItem);
    });
});

selectButtonsItem.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();

    if (selectedCategoryItem) {
      selectedCategoryItem.classList.remove('selected-item');
    }

    const listItem = e.target.closest('.category-item');
    listItem.classList.add('selected-item');
    selectedItem = listItem;

    listItem.style.position = 'absolute';
    listItem.style.zIndex = 1000;
    const originalX = e.clientX - listItem.getBoundingClientRect().left;
    const originalY = e.clientY - listItem.getBoundingClientRect().top;

    const moveItem = (e) => {
        const x = e.clientX - originalX;
        const y = e.clientY;
        listItem.style.left = x + 'px';
        listItem.style.top = y + 'px';
    };

    const dropItem = (e) => {
        document.removeEventListener('mousemove', moveItem);
        document.removeEventListener('mouseup', dropItem);

        const dropTarget = e.target.closest('.list-item')
        const categoryItemList = dropTarget.querySelector('.category-list');

        if (dropTarget && dropTarget.classList.contains('category-item')) {
            const index = Array.from(dropTarget.parentElement.children).indexOf(dropTarget);
            categoryItemList.insertBefore(listItem, dropTarget);
            listItem.style.position = 'static';
            selectedItem = null;
        } else {
          categoryItemList.appendChild(listItem);
          listItem.style.position = 'static';
          selectedItem = null;
        }

    };

    document.addEventListener('mousemove', moveItem);
    document.addEventListener('mouseup', dropItem);
  });
});

