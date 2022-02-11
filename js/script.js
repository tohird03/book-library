let elInput = document.querySelector(".site__search-input")
let elTotalBooksSearch = document.querySelector(".book__results")
let elBodyBookCards = document.querySelector(".book__cards")
let elBookmarksList = document.querySelector(".bookmark__list")
let elPagination = document.querySelector(".pagination")
let elOrder = document.querySelector(".book__order")
const elCardTemplate = document.querySelector(".template").content;

let request = "Uzbek"
let bookmarks = []
let page = 1;
let order = "relevance"

let renderBokkmark = function(arr, element){
    arr.forEach(item => {
        let bookmarkLi = document.createElement('li')
        let bookmarkLiDivTitle = document.createElement('div')
        let bookmarkLiTitle = document.createElement('h3')
        let bookmarkLiDesc = document.createElement('p')
        let bookmarkDivBtn = document.createElement('div')
        let bookmarkLiBtnRead = document.createElement('button')
        let bookmarkLiBtnReadImg = document.createElement('img')
        let bookmarkLiBtnDelete = document.createElement('button')
        let bookmarkLiBtnDeleteImg = document.createElement('img')

        bookmarkLi.setAttribute("class", "bookmark__item d-flex justify-content-between align-items-center")
        bookmarkLiTitle.setAttribute("class", "bookmark__title m-0")
        bookmarkLiDesc.setAttribute("class", "bookmark__desc m-0")
        bookmarkDivBtn.setAttribute("class", "d-flex w-100")
        bookmarkLiBtnRead.setAttribute("class", "btn ms-auto me-2 p-0")
        bookmarkLiBtnDelete.setAttribute("class", "btn p-0 remove__btn")
        bookmarkLiBtnReadImg.setAttribute("src", "./img/book-open.png")
        bookmarkLiBtnReadImg.setAttribute("width", "24")
        bookmarkLiBtnReadImg.setAttribute("height", "24")
        bookmarkLiBtnDeleteImg.setAttribute("src", "./img/delete.png")
        bookmarkLiBtnDeleteImg.setAttribute("width", "24")
        bookmarkLiBtnDeleteImg.setAttribute("class", "delete__img")
        bookmarkLiBtnDeleteImg.setAttribute("height", "24")


        bookmarkLiTitle.textContent = item.volumeInfo.title
        // bookmarkLiDesc.textContent = item.volumeInfo.authors

        // bookmarkLiBtnDelete.dataset.removeBookmarkId = item.id
        // bookmarkLiBtnDeleteImg.dataset.removeBookmarkIdImg = item.id

        element.appendChild(bookmarkLi)
        bookmarkLi.appendChild(bookmarkLiDivTitle)
        bookmarkLiDivTitle.appendChild(bookmarkLiTitle)
        bookmarkLiDivTitle.appendChild(bookmarkLiDesc)
        bookmarkLi.appendChild(bookmarkDivBtn)
        bookmarkDivBtn.appendChild(bookmarkLiBtnRead)
        bookmarkLiBtnRead.appendChild(bookmarkLiBtnReadImg)
        bookmarkDivBtn.appendChild(bookmarkLiBtnDelete)
        bookmarkLiBtnDelete.appendChild(bookmarkLiBtnDeleteImg)
    })
}



const renderBook = function (arr, element) {
    if(arr){

        const filmsFragment = document.createDocumentFragment();

        arr.forEach((item) => {
          const clonedFilmTemplate = elCardTemplate.cloneNode(true);

          clonedFilmTemplate.querySelector(".card-title").textContent = item.volumeInfo.title;

          clonedFilmTemplate.querySelector(".card-desc").textContent = item.volumeInfo.authors;

          clonedFilmTemplate.querySelector(".card-year").textContent = item.volumeInfo.publishedDate;

          clonedFilmTemplate.querySelector(".bookmark-add__btn").dataset.AddBtnId = item.id;

          clonedFilmTemplate.querySelector(".book-read__btn").href = item.volumeInfo.previewLink;

          clonedFilmTemplate.querySelector(".book-read__btn").target = "_blank";

          clonedFilmTemplate.querySelector(".card__img").src = item.volumeInfo.imageLinks?.thumbnail;

            console.log(item.volumeInfo.imageLinks?.smallThumbnail);
          filmsFragment.appendChild(clonedFilmTemplate);
        });

        element.appendChild(filmsFragment);
      }
};

elInput.addEventListener("keyup", function(evt) {
    if(evt.keyCode === 13){
        elBodyBookCards.innerHTML = null
        evt.preventDefault()
        request = elInput.value;
        render();
    }
        // render();
})

let render = function(req) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${request}&startIndex=${page}&orderBy=${order}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        console.log(data.items);

        renderBook(data.items, elBodyBookCards);
        totalItems(data)
        validationTotalItems(data)

        elBodyBookCards.addEventListener("click", function(e) {

            if(e.target.matches('.bookmark-add__btn')) {
                const addBookmarkBtnId = e.target.dataset.AddBtnId

                elBookmarksList.innerHTML = null
                console.log("HAaa");
                // console.log(addBookmarkBtnId);

                const foundElement = data.items.find(item => item.id == addBookmarkBtnId)

                // console.log(foundElement.volumeInfo);

                if(!bookmarks.includes(foundElement)) {
                    bookmarks.push(foundElement)
                }
            }else{
                return
            }

            renderBokkmark(bookmarks, elBookmarksList)
            // renderBook()
        })

        elBookmarksList.addEventListener('click', function(evt) {

            if(evt.target.matches('.remove__btn')) {
                const removeBtnId = evt.target.dataset.removeBookmarkId
                const foundIndex = bookmarks.findIndex(item => item.id == removeBtnId)
                bookmarks.splice(foundIndex, 1)
            }else if(evt.target.matches('.delete__img')){
                const removeBtnIdImg = evt.target.dataset.removeBookmarkIdImg
                const foundIndex = bookmarks.findIndex(item => item.id == removeBtnIdImg)
                bookmarks.splice(foundIndex, 1)
            }

            elBookmarksList.innerHTML = null
            renderBokkmark(bookmarks, elBookmarksList)
            // renderBook()
        })
    })
}

render();


let totalItems = function(e) {
    elTotalBooksSearch.textContent = e.totalItems

    let totalResultPage = Math.ceil(elTotalBooksSearch.textContent / 10)
    for (let index = 1; index <= totalResultPage; index++) {

        let btnPage = document.createElement("button")
        btnPage.textContent = index
        elPagination.appendChild(btnPage)
        console.log(index);
    }
}

elPagination.addEventListener("click", function(e) {
    console.log(e.target);
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null
    e.target.setAttribute("class", "btn-primary")
    page = Number(e.target.textContent)

    render()
})

// SEARCH ERROR
let validationTotalItems = function(e) {
    if(e.totalItems === 0) {
        var toastLiveExample = document.getElementById('liveToast')

        var toast = new bootstrap.Toast(toastLiveExample)

        toast.show()
    }
}

// ORDER
elOrder.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null

   order = "newest"
   render();
})