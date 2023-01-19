import { getImages } from './js/pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

async function search(query, page) {
  const response = await getImages(query, page);

  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  return response;
}

let query = '';
let nextPage = 1;

form.addEventListener('submit', async evt => {
  evt.preventDefault();

  nextPage = 1;
  galleryList.innerHTML = '';
  query = form.searchQuery.value;

  const response = await search(query, nextPage);
  if (!response) {
    return;
  }

  Notify.success(`Hooray! We found ${response.totalHits} images.`);

  drawImages(response.hits);

  checkButton(response.totalHits);
});

buttonLoadMore.addEventListener('click', async evt => {
  evt.preventDefault();

  const response = await search(query, nextPage);

  drawImages(response.hits);

  checkButton(response.totalHits);
});

function drawImages(hits) {
  const imageList = hits
    .map(
      el =>
        `
        <div class="photo-card">
            <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy"/>
            <div class="info">
                <p class="info-item">
                <b>Likes</b> ${el.likes}
                </p>
                <p class="info-item">
                <b>Views</b> ${el.views}
                </p>
                <p class="info-item">
                <b>Comments</b> ${el.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b> ${el.downloads}
                </p>
            </div>
        </div>`
    )
    .join('');

  galleryList.insertAdjacentHTML('beforeend', imageList);
}

function checkButton(totalHits) {
  if (totalHits - nextPage * 40 > 0) {
    buttonLoadMore.hidden = false;
    nextPage++;
  } else {
    buttonLoadMore.hidden = true;
    nextPage = 1;
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

buttonLoadMore.hidden = true;
