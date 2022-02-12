let elInput = document.querySelector(".site__search-input")
let elTotalBooksSearch = document.querySelector(".book__results")
let elBodyBookCards = document.querySelector(".book__cards")
let elBookmarksList = document.querySelector(".bookmark__list")
let elPagination = document.querySelector(".pagination")
let elOrderSort = document.querySelector(".book__order")
const elCardTemplate = document.querySelector(".template").content;
let elPrevPaginationBtn = document.querySelector(".prev__btn")
let elNextPaginationBtn = document.querySelector(".next__btn")

let elModal = document.querySelector(".modal")
let elModalBgOverlay = document.querySelector(".bg__modal")
let elModalTitle = document.querySelector(".modal__title")
let elModalImg = document.querySelector(".modal__img")
let elModalDesc = document.querySelector(".modal__desc")
let elModalAuthor = document.querySelector(".modal__author")
let elModalPublished = document.querySelector(".modal__published")
let elModalPublishers = document.querySelector(".modal__publishers")
let elModalCategories = document.querySelector(".modal__categories")
let elModalPage = document.querySelector(".modal__page")

elModalBgOverlay.addEventListener("click", function(e){
    elModalBgOverlay.classList.remove("opacity")
    elModal.classList.remove("block")
})

let request = "html"
let bookmarks = []
let page = 0;
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
        bookmarkLiDesc.textContent = item.volumeInfo.authors

        bookmarkLiBtnDelete.dataset.removeBookmarkId = item.id
        bookmarkLiBtnDeleteImg.dataset.removeBookmarkIdImg = item.id

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

const renderBook = function (arr, element) {
    if(arr){

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

          clonedFilmTemplate.querySelector(".card__img").src = item.volumeInfo.imageLinks?.thumbnail;

            // console.log(item.volumeInfo.imageLinks?.smallThumbnail);
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
})

let render = function(req) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${request}&startIndex=${page}&orderBy=${order}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        // console.log(data.items);

        renderBook(data.items, elBodyBookCards);
        totalItems(data)

        elBodyBookCards.addEventListener("click", function(e) {
            if(e.target.matches('.bookmark-add__btn')) {
                elBookmarksList.innerHTML = null

                const addBookmarkBtnId = e.target.dataset.AddBtnId

                const foundElement = data.items.find(item => item.id == addBookmarkBtnId)

                if(!bookmarks.includes(foundElement)) {
                    bookmarks.push(foundElement)
                }
            }else{
                return
            }

            renderBokkmark(bookmarks, elBookmarksList)
            // renderBook()
        })

        // let totalPage = Math.ceil(data.totalItems / 10) - 1

        // console.log(totalPage);

        if(page === 0) {
            elPrevPaginationBtn.disabled = true
            elPrevPaginationBtn.classList.add("disabled")

        }else{
            elPrevPaginationBtn.disabled = false
            elPrevPaginationBtn.classList.remove("disabled")
        }

        elBodyBookCards.addEventListener("click", function(e) {
            if(e.target.matches('.bookmark-more__btn')) {
                    // console.log(e.target);

                    elModalBgOverlay.classList.add("opacity")
                    const addBookmarkBtnId = e.target.dataset.moreBtnId

                    elBookmarksList.innerHTML = null

                    const foundElement = data.items.find(item => item.id == addBookmarkBtnId)

                    elModal.classList.remove("none")
                    elModal.classList.add("block")
                    elModalTitle.textContent = foundElement.volumeInfo.title
                    elModalDesc.textContent = foundElement.volumeInfo.description

                    elModalAuthor.innerHTML = null

                    for (let index = 0; index < foundElement.volumeInfo.authors.length; index++) {
                        let p = document.createElement("p")

                        p.setAttribute("class", "modal__abouts flex-wrap")

                        console.log(foundElement.volumeInfo.authors);

                        p.textContent = foundElement.volumeInfo.authors[index]

                        elModalAuthor.appendChild(p)
                    }

                    elModalPublished.textContent = foundElement.volumeInfo.publishedDate
                    elModalPublishers.textContent = foundElement.volumeInfo.publisher
                    elModalCategories.textContent = foundElement.volumeInfo.categories
                    elModalPage.textContent = foundElement.volumeInfo.pageCount
                    elModalImg.setAttribute("src", foundElement.volumeInfo.imageLinks.thumbnail)

                    console.log(foundElement);
                    // if(!bookmarks.includes(foundElement)) {
                    //     bookmarks.push(foundElement)
                    // }
            }
        })

        elBookmarksList.addEventListener('click', function(evt) {
            if(evt.target.matches('.remove__btn')) {
                const removeBtnId = evt.target.dataset.removeBookmarkId
                const foundIndex = bookmarks.findIndex(item => item.id == removeBtnId)
                bookmarks.splice(foundIndex, 1)
                console.log(evt.target);
            }else if(evt.target.matches('.delete__img')){
                const removeBtnIdImg = evt.target.dataset.removeBookmarkIdImg
                const foundIndex = bookmarks.findIndex(item => item.id == removeBtnIdImg)
                bookmarks.splice(foundIndex, 1)
                console.log(foundIndex);
            }

            elBookmarksList.innerHTML = null
            renderBokkmark(bookmarks, elBookmarksList)
        })

        elTotalBooksSearch.textContent = data.totalItems

        validationTotalItems(data.totalItems)

    })
}

render();


let totalItems = function(e) {
    elTotalBooksSearch.textContent = e.totalItems

    let totalResultPage = Math.ceil(elTotalBooksSearch.textContent / 10)
    for (let index = 1; index <= totalResultPage; index++) {

        let btnPage = document.createElement("button")

        btnPage.textContent = index

        btnPage.setAttribute("class", "pagination__btn")

        elPagination.appendChild(btnPage)
        // console.log(index);
    }
}

elPagination.addEventListener("click", function(e) {
    if(e.target.matches(".pagination__btn")){
        elBodyBookCards.innerHTML = null
        elPagination.innerHTML = null
        e.target.setAttribute("class", "btn-primary")
        page = Number(e.target.textContent * 10)

       console.log(page);
       render()
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
   render();
})

elPrevPaginationBtn.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null
    page = page - 10
    render()
    console.log(page);

})

elNextPaginationBtn.addEventListener("click", function(e) {
    elBodyBookCards.innerHTML = null
    elPagination.innerHTML = null
    page = page + 10
    console.log(page);
    render()
})