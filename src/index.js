import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const inputEl = document.querySelector('input');
const btnEl = document.querySelector('button');
const form = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
 
const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '34725568-3bb6c7550daf8cb631b41e469';
// let countPage = 1;
const perPage = 40;

inputEl.addEventListener('input', handleReadInput);
form.addEventListener('submit', handleMakeBtnSearchImages);
btnLoadEl.addEventListener('click', handleMakeBtnLoadMore);
btnLoadMoreIsHidden();

function btnLoadMoreIsHidden() {
btnLoadEl.classList.add("is-hidden");    
}

function btnLoadMoreVisible() {
 btnLoadEl.classList.remove("is-hidden");    
}

function cleanerPage() {
    divEl.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 250 });
    
function smoothScroll() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}

function handleReadInput(e) {
    const inputValue = inputEl.value.trim();
    if (inputValue === '') {
        cleanerPage();
        btnLoadMoreIsHidden(); 
        countPage = 2;
    } else { return inputValue; }
}

 const axiosPromise = async (name, countPage) => {
     const response = await axios.get(`${BASE_URL}?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${countPage}`); 
     return response;
 }

function handleMakeBtnSearchImages(e) {
    e.preventDefault();
    const name = handleReadInput();
    let countPage = 1;
    axiosPromise(name, countPage)
        .then(response => { console.log(response);
            const { data: { totalHits }, data: { hits } } = response;
        if ((totalHits !== 0) && (countPage === 1)) {
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        }
        if (totalHits !== 0) {
            makeRender(response); 
        } else {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.") }     
        if (hits.length === 40) {
            btnLoadMoreVisible();
        }
        smoothScroll();
    })
    .catch(err => console.log(err));
}
        
let countPage = 2;
function handleMakeBtnLoadMore() {
    const name = handleReadInput();
    axiosPromise(name, countPage)
    .then(response => { 
        const { data: { hits } } = response;
        if ((hits.length)  === perPage) {
            countPage += 1;
            makeRender(response);   
            smoothScroll();
        } else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")  
            makeRender(response);  
            btnLoadMoreIsHidden();
        }
      })
    .catch(err => console.log(err));
 }      

function makeRender(response) {
    const markupImg = (({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
        <figure> <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width=120 /></a>
        <figcaption>
         <div class="info">
         <p class="info-item"><b>Likes:${likes}</b></p>
         <p class="info-item"><b>Views:${views}</b></p>
         <p class="info-item"><b>Comments:${comments}</b></p>
         <p class="info-item"><b>Downloads:${downloads}</b></p>
         </div>
        </figcaption>
        </figure>
        </div>`
    });
    const markup = response.data.hits.map(data => markupImg(data)).join('');
    divEl.insertAdjacentHTML('beforeend', markup);  
    lightbox.refresh();
}



