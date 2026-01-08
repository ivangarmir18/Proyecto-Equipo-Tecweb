// Principal - Gloria Gordaliza Albert

const nextSlide = function() {
  // Definimos el slide activo
  const current = document.querySelector('.current');

  // buscamos la siguiente diapositiva que tenga la clase slide
  const next = document.querySelector('.current + .slide');

  // quitar current a la actual
  current.classList.remove('current');

  if (next) {
    // si existe una slide justo después, activarla
    next.classList.add('current');
  } else {
    // si no, volver a la primera slide
    document.querySelector('.slide').classList.add('current');
  }
};

const prevSlide = function() {
  const current = document.querySelector('.current');
  const slides = document.querySelectorAll('.slide');

  current.classList.remove('current');

  // si la actual es la primera
  if (current === slides[0]) {
    slides[slides.length - 1].classList.add('current'); // ponemos current a la última
  } else {
    // buscar cuál era la anterior
    for (let i = 0; i < slides.length; i++) {
      if (slides[i] === current) {
        slides[i - 1].classList.add('current');
        break;
      }
    }
  }
};

// Configurar eventos de los botones

// next = botón de después
next.addEventListener('click', function(e) {
  // Pasar a la siguiente diapositiva
  nextSlide();
  if(auto) {
    // Reiniciar el temporizador automático
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
});

// prev = botón de antes
prev.addEventListener('click', function(e) {
  // Pasar a la diapositiva anterior
  prevSlide();
  if(auto) {
    // Reiniciar el temporizador automático
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
});

// Reproducción automática del carrusel
if(auto) {
  slideInterval = setInterval(nextSlide, intervalTime);
}