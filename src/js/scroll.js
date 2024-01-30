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

  try {
    const data = await fetchData({ query, page });
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`There are ${data.total} results.`);
    onFetchSuccess(data);
    observer.observe(addMoreWrapper);
    formEl.reset();
  } catch (error) {
    Notify.failure(error.message);
  }
};

const addMore = async e => {
  page += 1;
  try {
    const data = await fetchData({ query, page });
    if (Math.floor(data.total / 40) === page) {
      Notify.info('End of collection');
    }
    onFetchSuccess(data);
  } catch (error) {
    Notify.failure(error.message);
  }
};

refs.formEl.addEventListener('submit', onFormSubmit);

const loadMoreScroll = entries => {
  if (entries[0].isIntersecting) {
    addMore();
  }
};

let options = {
  root: null,
  rootMargin: '0px 0px 600px 0px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(loadMoreScroll, options);
