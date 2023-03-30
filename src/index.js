import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// import {axiosRequest} from './axiosRequest';
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const inputEl = document.querySelector('input');
const btnEl = document.querySelector('button');
const form = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
 
const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '34725568-3bb6c7550daf8cb631b41e469';
let countPage = 1;
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

function handleReadInput(e) {
    const inputValue = inputEl.value.trim();
    if (inputValue === '') {
        cleanerPage();
        btnLoadMoreIsHidden(); 
    } else { return inputValue; }
}



function axiosRequest(name, countPage) {
    axios.get(`${BASE_URL}?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${countPage}`)
    .then(response => { 
        const totalImg = response.data.totalHits;
        
        console.log(response);
        if ((totalImg !== 0) && (countPage === 1)) {
            Notiflix.Notify.info(`Hooray! We found ${totalImg} images.`)
        }
        if (totalImg !== 0) {
            makeRender(response);
            const totalImgLS = localStorage.setItem('total', totalImg);
        } else {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.") }     
            
        if (response.data.hits.length === 40) {
                btnLoadMoreVisible();
            } else {
                btnLoadMoreIsHidden();
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }   
    })
        
            .catch(err => console.log(err));
        }
        
        
function makeRender(response) {
    const markupImg = (({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width=120 /></a>`

        // <div class="info">
        // <p class="info-item">
        // <b>Likes:${likes}</b>
        //    </p>

        //    <p class="info-item">
        //    <b>Views:${views}</b>
        //    </p>

        //    <p class="info-item">
        //    <b>Comments:${comments}</b>
        //    </p>
        
        //   <p class="info-item">
        //   <b>Downloads:${downloads}</b>
        //   </p>
        //   </div>
        // </div> 
    });
    const markup = response.data.hits.map(data => markupImg(data)).join('');
    divEl.insertAdjacentHTML('beforeend', markup);          
    
}

const totalImgGetLS = localStorage.getItem('total');
const totalImgCount = JSON.parse(totalImgGetLS);

function handleMakeBtnSearchImages(e) {
    e.preventDefault();
    const name = handleReadInput();
    axiosRequest(name, countPage);
    // Notiflix.Notify.info(`Hooray! We found ${totalImgCount} images.`);
}

function handleMakeBtnLoadMore() {
    const name = handleReadInput();
    if ((totalImgCount % perPage) > 0) {
        countPage += 1;
        axiosRequest(name, countPage);   
    } 
}

// new SimpleLightbox('.gallery a', {
//     captionsData: 250,
// })