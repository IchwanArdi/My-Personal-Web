const hamburger = document.querySelector('#hamburger');
const navSlide = document.querySelector('#nav-slide');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('hamburger-active');
  navSlide.classList.toggle('-translate-x-full');
});

// program untuk kategori filter
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.navKategori').forEach((nav) => {
    nav.addEventListener('click', function () {
      document.querySelector('.navKategori.active2')?.classList.remove('active2');
      this.classList.add('active2');
    });
  });
});
