// Principal - Gloria Gordaliza Albert

const nextSlide = function() {
  // Localizar la diapositiva activa actualmente
  const current = document.querySelector('.current');
  // Quitar la clase current
  current.classList.remove('current');

  // Comprobar si existe la siguiente diapositiva
  if(current.nextElementSibling) {
    // Marcar la siguiente diapositiva como activa
    current.nextElementSibling.classList.add('current');
  } 
  else {
    // Marcar la primera diapositiva como activa si no hay siguiente
    slides[0].classList.add('current');
  }

  setTimeout(function() {
    current.classList.remove('current');
  });
};

const prevSlide = function() {
  // Localizar la diapositiva activa actualmente
  const current = document.querySelector('.current');
  current.classList.remove('current');

  
  if(current.previousElementSibling) { // si existe diapositiva anterior -> marcar como activa
    current.previousElementSibling.classList.add('current');
  } 
  else {// si no, marcar la última

    slides[slides.length - 1].classList.add('current');
  }

  setTimeout(function() {
    current.classList.remove('current');
  });
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