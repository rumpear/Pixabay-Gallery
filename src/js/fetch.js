import throttle from 'lodash.throttle';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import imgCardsTpl from '../templates/img-cards.hbs';
import PixabayApiService from './PixabayApi';

let isDataLoading = false;

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

hideSpinner();

let gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
const pixabayApi = new PixabayApiService();

async function onSearch(e) {
  e.preventDefault();
  cleanupRender();
  showSpinner();
  // console.log(isDataLoading);

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApi.resetPage();

  if (!pixabayApi.query) {
    Notiflix.Notify.warning('Enter your search term');
    // cleanupRender();
    hideSpinner();
    return;
  }

  if (isDataLoading) return;
  isDataLoading = true;

  // console.log(isDataLoading);

  try {
    const { totalHits, hits } = await pixabayApi.fetchImg();

    // disableSearchBtn();
    refs.searchForm.reset();

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again',
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
    renderImg(hits);
  } catch (error) {
    console.log(error);
  } finally {
    // enableSearchBtn();

    hideSpinner();
    isDataLoading = false;
  }
  addInfiniteScroll();
  // console.log(isDataLoading);
}

async function onLoadMoreClick() {
  try {
    const data = await pixabayApi.fetchImg();

    showSpinner();

    if (isDataLoading) return;
    isDataLoading = true;

    if (!data || data.hits.length === 0) {
      removeInfiniteScroll();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
      hideSpinner();
      return;
    }

    renderImg(data.hits);
  } catch (error) {
    console.log(error);
    hideSpinner();
  } finally {
    isDataLoading = false;
  }
}

// render
function renderImg(hits) {
  const markup = hits.map(imgCardsTpl).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function cleanupRender() {
  refs.gallery.innerHTML = '';
}

// buttons
function disableSearchBtn() {
  refs.searchForm.elements.search.disabled = true;
}

function enableSearchBtn() {
  refs.searchForm.elements.search.disabled = false;
}

// scroll
function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();

  // console.log('top', documentRect.top);
  // console.log('bottom', documentRect.bottom);
  // console.log('clientHeight', document.documentElement.clientHeight);
  if (documentRect.bottom < document.documentElement.clientHeight + 500) {
    onLoadMoreClick();
  }
}

// enableIntersectionObserver();
// function enableIntersectionObserver() {
//   const options = {
//     root: document.querySelector('.container'),
//     threshold: 1,
//   };

//   const handleObserver = ([item]) => {
//     item.isIntersecting;
//     if (item.isIntersecting) {
//       console.log(item.isIntersecting);
//       onLoadMoreClick();
//       console.log(1);
//     }
//   };

//   const observer = new IntersectionObserver(handleObserver, options);
//   observer.observe(refs.loadMoreBtn);
// }

const scrollThrottled = throttle(infiniteScroll, 700);

function addInfiniteScroll() {
  window.addEventListener('scroll', scrollThrottled);
}

function removeInfiniteScroll() {
  window.removeEventListener('scroll', scrollThrottled);
}

// spinner
function hideSpinner() {
  // refs.loadMoreBtn.classList.add('is-hidden');
  // refs.loadMoreBtn.hidden = true;
  refs.loadMoreBtn.style.display = 'none';
}

function showSpinner() {
  // refs.loadMoreBtn.classList.remove('is-hidden');
  // refs.loadMoreBtn.hidden = false;
  refs.loadMoreBtn.style.display = 'block';
}

// * smooth
// function smoothFn() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// * scrolls
// function scrollHandler() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   console.log('scrollTop', scrollTop);
//   console.log('scrollHeight', scrollHeight);
//   console.log('clientHeight', clientHeight);
//   if (clientHeight + scrollTop >= scrollHeight - 5) {
//     onLoadMoreClick();
//   }
// }

// function checkPosition() {
//   // ?????? ?????????????????????? ?????????? ???????????? ?????????????????? ?? ???????????? ????????????.
//   const height = document.body.offsetHeight;
//   const screenHeight = window.innerHeight;

//   // ?????? ?????????? ????????????????????: ???????? ???? ???????????????? ?????????? ????????????????,
//   // ???????????? ?????????????????? ?????????? ???????????? ???????????? ???????????? (???????????? ?? ????????????).

//   // ????????????????????, ?????????????? ???????????????? ???????????????????????? ?????? ??????????????????????.
//   const scrolled = window.scrollY;

//   // ?????????????????? ??????????, ???? ?????????????????????? ?? ????????????????
//   // ?????????? ???????????????? ??????????-???? ????????????????.
//   // ?? ?????????? ???????????? ??? ???????????????? ???????????? ???? ?????????? ????????????????.
//   const threshold = height - screenHeight / 4;

//   // ??????????????????????, ?????? ?????????????????? ?????? ???????????? ???????????????????????? ????????????????.
//   const position = scrolled + screenHeight;

//   if (position >= threshold) {
//     // ???????? ???? ?????????????????? ????????????-??????????, ???????????????? ???????????? ????????????????.
//     onLoadMoreClick();
//     console.log('load');
//   }
// }

// window.addEventListener('resize', checkPosition);
