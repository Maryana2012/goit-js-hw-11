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
        countPage = 2;
    } else { return inputValue; }
}


function handleMakeBtnSearchImages(e) {
    e.preventDefault();
    const name = handleReadInput();
    let countPage = 1;
    axios.get(`${BASE_URL}?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${countPage}`)
    .then(response => { 
        const { data: { totalHits }, data:{hits}  } = response;
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
            // else {
            //     btnLoadMoreIsHidden();
            //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")    }      
            })
            .catch(err => console.log(err));
        }
        
countPage = 2;
function handleMakeBtnLoadMore() {
    const name = handleReadInput();
    
    axios.get(`${BASE_URL}?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${countPage}`)
    .then(response => { 
        const { data: { totalHits }, data: { hits } } = response;
        const name = handleReadInput();
        console.log(countPage);
         if ((hits.length)  === perPage) {
             console.log(hits.length);
             countPage += 1;
             makeRender(response);   
         } else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")  
             makeRender(response);  
             btnLoadMoreIsHidden();
         }
        
            // if (hits.length === 40) {
            //     btnLoadMoreVisible();
            // } else {
            //     btnLoadMoreIsHidden();
            //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")    }      
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

// const totalImgGetLS = localStorage.getItem('total');
// const totalImgCount = JSON.parse(totalImgGetLS);

// function handleMakeBtnSearchImages(e) {
//     e.preventDefault();
//     const name = handleReadInput();
//     axiosRequest(name, countPage);
//     Notiflix.Notify.info(`Hooray! We found ${totalImgCount} images.`);
// }

// function handleMakeBtnLoadMore() {
//     const name = handleReadInput();
//     if ((totalImgCount % perPage) > 0) {
//         countPage += 1;
//         axiosRequest(name, countPage);   
//     } 
// }

// new SimpleLightbox('.gallery a', {
//     captionsData: 250,
// })