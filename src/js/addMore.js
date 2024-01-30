import fetchData from './api';
import onFetchSuccess from './common';
import { Notify } from 'notiflix';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  addMoreWrapper: document.querySelector('.btn-wrapper'),
  addMoreButton: document.querySelector('.add-more'),
};
let query;
let page = 1;

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
    if (Math.ceil(data.total / 40) === page) {
      hideButton();
      Notify.info('End of collection');
    }
    onFetchSuccess(data);
    smoothScroll();
  } catch (error) {
    Notify.failure(error.message);
  }
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
