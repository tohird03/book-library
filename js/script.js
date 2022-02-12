// SITE HTML ELEMENTS
let elInput = document.querySelector(".site__search-input")
let elTotalBooksSearch = document.querySelector(".book__results")
let elBodyBookCards = document.querySelector(".book__cards")
let elBookmarksList = document.querySelector(".bookmark__list")
let elPagination = document.querySelector(".pagination")
let elOrderSort = document.querySelector(".book__order")
const elCardTemplate = document.querySelector(".template").content;
let elPrevPaginationBtn = document.querySelector(".prev__btn")
let elNextPaginationBtn = document.querySelector(".next__btn")

// MODAL HTML ELEMENTS
let elModal = document.querySelector(".modal")
let elModalBgOverlay = document.querySelector(".bg__modal")
let elModalTitle = document.querySelector(".modal__title")
let elModalImg = document.querySelector(".modal__img")
let elModalDesc = document.querySelector(".modal__desc")
let elModalAuthor = document.querySelector(".modal__author")
let elModalPublished = document.querySelector(".modal__published")
let elModalPublishers = document.querySelector(".modal__publishers")
let elModalCategories = document.querySelector(".modal__categories")
let elModalPageBookTotal = document.querySelector(".modal__page")
let elModalPage = document.querySelector(".modal__read")


const localTodos = JSON.parse(window.localStorage.getItem('movie'))

let request = "uzbek"
let startIndex = 10;
let page = 1;
let order = "relevance"
let allBooks = []
const bookmarks = localTodos || []

// RENDER BOOKMARK CARDS
let renderBokkmark = function(arr, element){
    arr.forEach(item => {
        let bookmarkLi = document.createElement('li')
        let bookmarkLiDivTitle = document.createElement('div')
        let bookmarkLiTitle = document.createElement('h3')
        let bookmarkLiDesc = document.createElement('p')
        let bookmarkDivBtn = document.createElement('div')
        let bookmarkLiBtnRead = document.createElement('a')
        let bookmarkLiBtnReadImg = document.createElement('img')
        let bookmarkLiBtnDelete = document.createElement('button')
        let bookmarkLiBtnDeleteImg = document.createElement('img')

        bookmarkLi.setAttribute("class", "bookmark__item d-flex justify-content-between align-items-center")
        bookmarkLiTitle.setAttribute("class", "bookmark__title m-0")
        bookmarkLiDesc.setAttribute("class", "bookmark__desc m-0")
        bookmarkDivBtn.setAttribute("class", "d-flex w-100")
        bookmarkLiBtnRead.setAttribute("class", "btn ms-auto me-2 p-0 bookmark__read-link")
        bookmarkLiBtnDelete.setAttribute("class", "btn p-0 remove__btn")
        bookmarkLiBtnReadImg.setAttribute("src", "./img/book-open.png")
        bookmarkLiBtnReadImg.setAttribute("width", "24")
        bookmarkLiBtnReadImg.setAttribute("height", "24")
        bookmarkLiBtnDeleteImg.setAttribute("src", "./img/delete.png")
        bookmarkLiBtnDeleteImg.setAttribute("width", "24")
        bookmarkLiBtnDeleteImg.setAttribute("class", "delete__img")
        bookmarkLiBtnDeleteImg.setAttribute("height", "24")


        bookmarkLiTitle.textContent = item.volumeInfo.title
        bookmarkLiDesc.textContent = item.volumeInfo.authors

        bookmarkLiBtnDelete.dataset.removeBookmarkId = item.id
        bookmarkLiBtnDeleteImg.dataset.removeBookmarkIdImg = item.id

        bookmarkLiBtnRead.setAttribute("href", item.volumeInfo.previewLink)
        bookmarkLiBtnRead.setAttribute("target", "_blank")

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

renderBokkmark(bookmarks, elBookmarksList)

// RENDER FUNCTION TEMPLATE CARDS
const renderBook = function (arr, element) {
    if (!arr) return

    const filmsFragment = document.createDocumentFragment();
    arr.forEach((item) => {
        const clonedFilmTemplate = elCardTemplate.cloneNode(true);

        clonedFilmTemplate.querySelector(".card-title").textContent = item.volumeInfo.title;

        clonedFilmTemplate.querySelector(".card-desc").textContent = item.volumeInfo.authors;

        clonedFilmTemplate.querySelector(".card-year").textContent = item.volumeInfo.publishedDate;

        clonedFilmTemplate.querySelector(".bookmark-add__btn").dataset.AddBtnId = item.id;

        clonedFilmTemplate.querySelector(".bookmark-more__btn").dataset.moreBtnId = item.id;

        clonedFilmTemplate.querySelector(".book-read__btn").href = item.volumeInfo.previewLink;

        clonedFilmTemplate.querySelector(".book-read__btn").target = "_blank";

        clonedFilmTemplate.querySelector(".card__img").src = item.volumeInfo.imageLinks?.thumbnail || "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=200";

        filmsFragment.appendChild(clonedFilmTemplate);
    });

    element.appendChild(filmsFragment);
};

// INPUT SEARCH
elInput.addEventListener("keyup", function(evt) {
    if(evt.keyCode === 13){
        elBodyBookCards.innerHTML = null
        elPagination.innerHTML = null
        evt.preventDefault()
        request = elInput.value;
        refresh();
    }
})

// GET BOOKS FROM API
async function getData() {
    return await fetch(`https://www.googleapis.com/books/v1/volumes?q=${request}&startIndex=${startIndex}&orderBy=${order}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        allBooks = data
    })
}

// RENDER API
function render() {
    // PAGENATION DISABLED
    if (startIndex === 10) {
        elPrevPaginationBtn.disabled = true
        elPrevPaginationBtn.classList.add("disabled")
    } else {
        elPrevPaginationBtn.disabled = false
        elPrevPaginationBtn.classList.remove("disabled")
    }

    renderBook(allBooks.items, elBodyBookCards);
    totalItems(allBooks)
    elTotalBooksSearch.textContent = allBooks.totalItems
    validationTotalItems(allBooks.totalItems)

}

// GLOBAL FUNCTION
async function refresh() {
    await getData()
    render()
}

refresh();

// BOOKMARKS ADD
elBodyBookCards.addEventListener("click", function(e) {
    if(e.target.matches('.bookmark-add__btn')) {
        elBookmarksList.innerHTML = null

        const addBookmarkBtnId = e.target.dataset.AddBtnId
        const foundElement = allBooks.items.find(item => item.id == addBookmarkBtnId)

        if (foundElement && !bookmarks.includes(foundElement)) {
            bookmarks.push(foundElement)
        }
    }else{
        return
    }

    window.localStorage.setItem('movie', JSON.stringify(bookmarks))
    renderBokkmark(bookmarks, elBookmarksList)
})

// BOOKMARK REMOVE
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

    window.localStorage.setItem('movie', JSON.stringify(bookmarks))
    elBookmarksList.innerHTML = null
    renderBokkmark(bookmarks, elBookmarksList)
})

// MODAL BODY
elBodyBookCards.addEventListener("click", function(e) {
    if (e.target.matches('.bookmark-more__btn')) {
        elModalBgOverlay.classList.add("opacity")
        const addBookmarkBtnId = e.target.dataset.moreBtnId

        elBookmarksList.innerHTML = null

        const foundElement = allBooks.items.find(item => item.id == addBookmarkBtnId)

        elModal.classList.remove("none")
        elModal.classList.add("block")
        elModalTitle.textContent = foundElement.volumeInfo.title
        elModalDesc.textContent = foundElement.volumeInfo.description

        elModalAuthor.innerHTML = null

        // AUTHORS
        for (let index = 0; index < foundElement.volumeInfo.authors.length; index++) {
            let p = document.createElement("p")

            p.setAttribute("class", "modal__abouts flex-wrap")

            p.textContent = foundElement.volumeInfo.authors[index]

            elModalAuthor.appendChild(p)
        }

        elModalPublished.textContent = foundElement.volumeInfo.publishedDate
        elModalPublishers.textContent = foundElement.volumeInfo.publisher
        elModalCategories.textContent = foundElement.volumeInfo.categories
        elModalPageBookTotal.textContent = foundElement.volumeInfo.pageCount
        elModalPage.setAttribute("href", foundElement.volumeInfo.previewLink)

        elModalImg.setAttribute("src", foundElement.volumeInfo.imageLinks.thumbnail)
    }
})

// MODAL
elModalBgOverlay.addEventListener("click", function(e){
    elModalBgOverlay.classList.remove("opacity")
    elModal.classList.remove("block")
})

// TOTAL AND PAGINATION
let totalItems = function(e) {
    elTotalBooksSearch.textContent = e.totalItems

    let totalResultPage = Math.ceil(elTotalBooksSearch.textContent / 10)
    for (let index = 1; index <= totalResultPage; index++) {

        let btnPage = document.createElement("button")

        btnPage.textContent = index
        btnPage.dataset.pageNumber = index

        btnPage.setAttribute("class", "pagination__btn")

        if (index === page) {
            btnPage.classList.add("btn-primary")
        }

        elPagination.appendChild(btnPage)
    }
}

// PAGINATION BTN'S
elPagination.addEventListener("click", function(e) {
    if (e.target.matches(".pagination__btn")){
        elBodyBookCards.innerHTML = null
        elPagination.innerHTML = null
        e.target.setAttribute("class", "btn-primary")

        page = parseInt(e.target.textContent)
        startIndex = Number(page * 10)

        refresh()
    }
})

// SEARCH ERROR
let validationTotalItems = function(e) {
    if(e == 0) {
        var toastLiveExample = document.getElementById('liveToast')

        var toast = new bootstrap.Toast(toastLiveExample)

        toast.show()
    }
}

// ORDER
elOrderSort.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null

   order = "newest"
   refresh();
})

// PREV BTN PAGINATION
elPrevPaginationBtn.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null
    startIndex = startIndex - 10
    page -= 1
    refresh()

})

// NEXT BTN PAGINATION
elNextPaginationBtn.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null
    startIndex = startIndex + 10
    page++
    refresh()
})