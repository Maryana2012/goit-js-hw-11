import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import './css/styles.css';

const inputEl = document.querySelector('input');
const btnEl = document.querySelector('button');
const form = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
 
const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '34725568-3bb6c7550daf8cb631b41e469';
const perPage = 40;

inputEl.addEventListener('input', handleReadInput);
btnLoadMoreIsHidden();

function btnLoadMoreIsHidden() {              //приховує кнопку load More
    btnLoadEl.classList.add("is-hidden");    
}

function btnLoadMoreVisible() {               //робить видимою кнопку load more
 btnLoadEl.classList.remove("is-hidden");    
}

function cleanerPage() {                      // очищує галерею
    divEl.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {       //створює новий SimpleLightbox 
    captionsData: 250 });
    
    function smoothScroll() {                                 //плавний скрол
        const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
    behavior: "smooth",
    });
}

function handleReadInput(e) {                            // зчитує значення input
    const inputValue = inputEl.value.trim();
    if (inputValue === '') {
        cleanerPage();
        btnLoadMoreIsHidden(); 
        countPage = 2;
    } else { return inputValue; }
}

const axiosPromise = async (name, countPage) => {    // створюємо запит
    try {
        const response = await axios.get(`${BASE_URL}?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${countPage}`); 
        return response;
    }
    catch {
        err => console.log(err);
    } 
}

const handleMakeBtnSearchImages = async (e) => {                // функція для кнопки Submit 
    e.preventDefault();
    const name = handleReadInput();
    let page = 1;
    try {
        const response = await axiosPromise(name, page)
          const { data: { totalHits }, data: { hits } } = response;
        if ((totalHits !== 0) && (page === 1)) {
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        }
        if (totalHits !== 0) {
            makeRender(response); 
        } else {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.") }     
            if (hits.length === 40) {
                btnLoadMoreVisible();
            }   
        }
    catch (err) { console.log(err); }
}

form.addEventListener('submit', handleMakeBtnSearchImages);
        
let page = 2;
const handleMakeBtnLoadMore = async() => {                    // функція для кнопки Load More
    const name = handleReadInput();
    try {
        const response = await axiosPromise(name, page)
         const { data: { hits } } = response;
        if ((hits.length) === perPage) {
            page += 1;
            makeRender(response);
            smoothScroll();
        } else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
            makeRender(response);
            btnLoadMoreIsHidden();
        }
        smoothScroll();
    }
    catch (err) { console.log(err) };
}      
btnLoadEl.addEventListener('click', handleMakeBtnLoadMore);

function makeRender(response) {                       // створюємо галерею
    const markupImg = (({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
        <figure> <a href="${largeImageURL}" class="link-img"><img src="${webformatURL}" class="image-card" alt="${tags}" loading="lazy" width=330 /></a>
        <figcaption class="signature">
         <div class="info">
         <p class="info-item"><b>Likes: ${likes}</b></p>
         <p class="info-item"><b>Views: ${views}</b></p>
         <p class="info-item"><b>Comments: ${comments}</b></p>
            <p class="info-item"><b>Downloads: ${downloads}</b></p>
         </div>
        </figcaption>
        </figure>
        </div>`
    });
    const markup = response.data.hits.map(data => markupImg(data)).join('');
    divEl.insertAdjacentHTML('beforeend', markup);  
    lightbox.refresh();
}



