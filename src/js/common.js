import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  galleryEl: document.querySelector('.gallery'),
};

const onFetchSuccess = data => {
  insertMarkup(data.hits);
  createLightbox();
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

export default onFetchSuccess;
