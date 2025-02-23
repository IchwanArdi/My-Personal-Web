// program untuk kategori filter
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function () {
    document.querySelector('.nav-link.active')?.classList.remove('active');
    this.classList.add('active');
  });
});
