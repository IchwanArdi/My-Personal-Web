function semuaProject() {
  $('.daftar-project').empty();
  $.getJSON('data/project.json', function (res) {
    let project = res.project;

    // Looping melalui setiap item di menu
    $.each(project, function (i, data) {
      $('.daftar-project').append(`<div class="aspect-[4/3] rounded-lg mt-5 px-3">
          <a href="#"><img src="picture/${data.gambar}" alt="picture-8" class="w-full h-full bg-cover bg-center" /></a>
          <div class="text-white judul-project">
            <span class="text-sm md:text-xs">${data.tanggal}</span>
            <p class="font-semibold 2xl:text-xl lg:text-base md:text-sm">${data.judul}</p>
          </div>
        </div>`);
    });
  });
}
semuaProject();

// program untuk kategori filter
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function () {
    document.querySelector('.nav-link.active')?.classList.remove('active');
    this.classList.add('active');

    let kategori = this.innerHTML; // Ambil teks kategori

    if (kategori == 'All') {
      semuaProject();
      return;
    }

    // Jika kategori bukan 'All', filter berdasarkan kategori
    $.getJSON('data/project.json', function (res) {
      let project = res.project;
      let content = '';

      //looping
      $.each(project, function (i, data) {
        if (data.kategori == kategori.toLowerCase()) {
          content += `<div class="aspect-[4/3] rounded-lg mt-5 px-3">
          <a href="#"><img src="picture/${data.gambar}" alt="picture-8" class="w-full h-full bg-cover bg-center" /></a>
          <div class="text-white judul-project">
            <span class="text-sm md:text-xs">${data.tanggal}</span>
            <p class="font-semibold 2xl:text-xl lg:text-base md:text-sm">${data.judul}</p>
          </div>
        </div>`;
        }
      });

      // Perbarui elemen daftar-menu dengan content yang difilter
      $('.daftar-project').html(content);
    });
  });
});
