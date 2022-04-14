import throttle from 'lodash.throttle';

const btnUpElem = document.createElement('button');
btnUpElem.setAttribute('type', 'button');
btnUpElem.classList.add('btn-up');
btnUpElem.classList.add('is-hidden');

const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
useElem.setAttributeNS(
  'http://www.w3.org/1999/xlink',
  'href',
  '/sprite.5ec50489.svg#icon-up-arrow',
);

svgElem.setAttribute('width', '20');
svgElem.setAttribute('height', '20');
svgElem.classList.add('team-social__icon');

svgElem.appendChild(useElem);
btnUpElem.appendChild(svgElem);
document.body.append(btnUpElem);

const upToTop = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

btnUpElem.addEventListener('click', upToTop);

const scrollFunction = () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btnUpElem.classList.remove('is-hidden');
  } else {
    btnUpElem.classList.add('is-hidden');
  }
};

window.addEventListener('scroll', throttle(scrollFunction, 500));
// window.addEventListener('scroll', scrollFunction, { passive: true });
