'use strict';

// Selectors:::

// --Modal Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// --Header NavBar  Selectors
const header = document.querySelector('header');
const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinksParent = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');

// --Operations Tab Selectors
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');

// -- Testimonials Slides Selectors
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
////////////////////////////////////////////////////////////////////////////
// Modal window
// Open Modal when clicking on Open Accoubt btn
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// _________________________________________________________________
// Implementing button (Learn More) Scrolling

btnScrollTo.addEventListener('click', function (e) {
  // get Section 1 Coordinates
  const section1Coordinates = section1.getBoundingClientRect();

  // Scroll to (Old Way)
  // window.scrollTo({
  //   left: section1Coordinates.left + window.pageXOffset,
  //   top: section1Coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Scroll to (Modern Way)
  section1.scrollIntoView({ behavior: 'smooth' });
});

// _________________________________________________________________
// Implementing Page Navigation

/*  Old Way might impact the performance

    // Old way and this might impact the performance if there is alot of elements to attach the event hanlder with.

    // navLinks.forEach(function (element) {
    //   element.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     const sectionID = this.getAttribute('href');
    //     console.log(sectionID);
    //     document.querySelector(sectionID).scrollIntoView({
    //       behavior: 'smooth',
    //     });
    //   });
    // });

*/

/*  Modern Way using Event Delegation

    // we need 2 steps:
    // 1) We add the event listener to a common parent element
    // 2) Determine what element originated the event
*/
navLinksParent.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  // because we wanted to ignore clicks that did not happen in one of the   navbar links
  if (e.target.classList.contains('nav__link')) {
    const sectionID = e.target.getAttribute('href');
    document.querySelector(sectionID).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// _________________________________________________________________
// Menu Fade Animation

// mouseenter is similar to mouseover but mouseenter does not bubble up

const handlerHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const clickedLink = e.target;
    // now we want to get all the siblings
    const links = clickedLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickedLink.closest('.nav').querySelector('img');
    links.forEach(link => {
      if (link !== clickedLink) {
        link.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handlerHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handlerHover(e, 1);
});

// _________________________________________________________________
// Implementing Sticky Navigation

/*  Old Way : Which is bad for the performance
    - Because the scroll event fires all the time , no matter how small it.,
      so that makes a pretty bad performacne especially on mobile.

  window.addEventListener('scroll', function (e) {
  const initialCoords = section1.getBoundingClientRect();
  if (this.window.screenY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

/* Modern Way: Using "The Intersection Observer API" 

  --Well, this API allows our code to basically
    observe changes to the way that a certain target element
    intersects another element, or the way
    it intersects the viewport.

  --The Intersection Observer API allows you to configure a callback that is called when either of these circumstances occur:

  1) A target element intersects either the device's viewport or a specified element. That specified element is called the root element or root for the purposes of the Intersection Observer API.

  2) The first time the observer is initially asked to watch a target element.

  --So our target element here, is intersecting
    the root element at the threshold that we defined.
  
  -- The element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null.

  -- A threshold of 1.0 means that when 100% of the target is visible   within the element specified by the root option, the callback is invoked.

*/
const stickyNav = function (entries, observer) {
  // Each entry describes an intersection change for one observed

  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const options = {
  root: null,
  // null because we interested in the entire viewport
  threshold: 0,
  /* what 0 means.

  --So 0% here means that basically our callback
    will trigger each time that the target element
    moves completely out of the view,
    and also as soon as it enters the view 

  -- So when 0% of the header here is visible, then we want something to happen.
  
  */
  rootMargin: '-180px',
};

// NOTE:  options object and callback function must be written before observer otherwise code will not get executed.
const Headerobserver = new IntersectionObserver(stickyNav, options);
Headerobserver.observe(header);

// _________________________________________________________________
// Implementing Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clickedTab = e.target.closest('.operations__tab');
  console.log(clickedTab);

  // guard cluase
  if (!clickedTab) return;
  /*   WHY USING  GUARD CLAUSE?

    when nothing clicked we wanna immediately finish this function
    and when we have null which is falsely value then it becomses true
    and none of the code after it will be executed

    if clickedTab does exist then this return wont be executed
    and the rest of the code will be exectued just fine

    ignore other clicks aint on tabs.

    //____________ THIS IS A MORE MODERN WAY THAN THIS

    if (!clickedTab) return;
    if(clickedTab){
          clickedTab.classList.add('operations__content--active');
    }
 */

  // Clearing active class on all tabs then add active tab class to the clicked tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedTab.classList.add('operations__tab--active');

  // activate tab content based on Data-attribute (data-tab=1) for EX:
  tabContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// _________________________________________________________________
// Revealing Elements on Scroll Effect
const allSections = document.querySelectorAll('section');

const revealSections = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSections, revealOptions);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// _________________________________________________________________
// Implementing Lazy Loading Images

// its so good for performance.
const featuresImages = document.querySelectorAll('.features img');
// console.log(featuresImages);
const lazyLoadImages = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  // console.log(entry);
  if (!entry.isIntersecting) return;

  // The Logic:
  // replace img.src with data-src then remove lazy-img class
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img'); // not a good practice

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imagesOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-30px',
};

const imagesObserver = new IntersectionObserver(lazyLoadImages, imagesOptions);

featuresImages.forEach(img => imagesObserver.observe(img));

// _________________________________________________________________
// Implementing Slider Functionality

const countSlides = slides.length;
console.log(countSlides);

let currentSlide = 0;

const createDots = function () {
  slides.forEach(function (_slide, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dot" data-slide="${i}"></button>
      `
    );
  });
};
createDots();

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

goToSlide(0);
// slides.forEach((slide, index) => {
//   slide.style.transform = `translateX(${100 * index}%)`;
//   0%,100%,200%,300% and so on
// });

// next slide
// will change percentages, active one will be 0% and previous one will be
// -100% and next one will be 100% and so on.

const activeDot = function (slide) {
  document
    .querySelectorAll('.dot')
    .forEach(dot => dot.classList.remove('dot--active'));
  document
    .querySelector(`.dot[data-slide="${slide}"`)
    .classList.add('dot--active');
};
activeDot(0);
const nextSlide = function () {
  if (currentSlide === countSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  // lets say we are on slide 1 =>
  // -100%,0%,100% and so on
  goToSlide(currentSlide);
  activeDot(currentSlide);
};
const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = countSlides - 1;
  } else {
    currentSlide--;
  }
  // lets say we are on slide 3 =>
  // -200%,-100%,0% and so on
  goToSlide(currentSlide);
  activeDot(currentSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

// implementing left and right arrows
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && previousSlide();
});

// implementing dots functionality
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activeDot(slide);
  }
});
