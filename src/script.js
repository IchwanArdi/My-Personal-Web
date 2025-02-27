const hamburger = document.querySelector('#hamburger');
const navSlide = document.querySelector('#nav-slide');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('hamburger-active');
  navSlide.classList.toggle('-translate-x-full');
});
