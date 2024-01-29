import fetchData from './js/api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  addMoreWrapper: document.querySelector('.btn-wrapper'),
  addMoreButton: document.querySelector('.add-more'),
};
let query;
let page = 1;

const onFetchSuccess = data => {
  insertMarkup(data.hits);
  createLightbox();
};

const onFormSubmit = async e => {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value;

  const { formEl, galleryEl, addMoreWrapper } = refs;
  galleryEl.innerHTML = '';
  addMoreWrapper.classList.add('not-visible');

  try {
    const data = await fetchData({ query, page });
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`There are ${data.total} results.`);
    if (data.total > 40) {
      showButton();
    }
    onFetchSuccess(data);
    formEl.reset();
  } catch (error) {
    Notify.failure(error.message);
  }
};

const onAddMoreClick = async e => {
  page += 1;
  try {
    const data = await fetchData({ query, page });
    if (Math.floor(data.total / 40) === page) {
      hideButton();
      Notify.info('End of collection');
    }
    onFetchSuccess(data);
    smoothScroll();
  } catch (error) {
    Notify.failure(error.message);
  }
};

const insertMarkup = data => {
  const markup = createMarkup(data);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
};

const createMarkup = data => {
  return data
    .map(hit => {
      return `
        <div class="photo-card">
        <a href=${hit.largeImageURL}><img src=${hit.previewURL} alt="" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                <b>Likes: </b>${hit.likes}
                </p>
                <p class="info-item">
                <b>Views: </b>${hit.views}
                </p>
                <p class="info-item">
                <b>Comments: </b>${hit.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>
                </p>
            </div>
        </div>
    `;
    })
    .join('');
};

const createLightbox = () => {
  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionDelay: 250,
  });
  gallery.refresh();
};
const showButton = () => {
  const { addMoreWrapper, addMoreButton } = refs;
  addMoreWrapper.classList.remove('not-visible');
  addMoreButton.addEventListener('click', onAddMoreClick);
};
const hideButton = () => {
  const { addMoreWrapper, addMoreButton } = refs;
  addMoreWrapper.classList.add('not-visible');
  addMoreButton.removeEventListener('click', onAddMoreClick);
};
const smoothScroll = () => {
  if (refs.addMoreWrapper.classList.contains('not-visible')) {
    return;
  }
  refs.addMoreWrapper.scrollIntoView({ behavior: 'smooth' });
};
refs.formEl.addEventListener('submit', onFormSubmit);
