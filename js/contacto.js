document.addEventListener('DOMContentLoaded', function() {
    var formulario = document.querySelector('form');
    var contenedorPrincipal = document.querySelector('main');

    if (formulario) {
        formulario.onsubmit = function(e) {
            e.preventDefault();

            var datos = new FormData(formulario);
            var nombre = datos.get('nombre');

            contenedorPrincipal.innerHTML = 
                "<div class='mensaje-exito' style='text-align: center; padding: 60px 20px;'>" +
                    "<h2 style='font-family: Fraunces, serif; color: #410805; font-size: 2.5rem;'>" +
                        "¡Gracias por contactar, " + nombre + "!" +
                    "</h2>" +
                    "<p style='margin: 20px 0; font-size: 1.2rem;'>" +
                        "Hemos recibido tu mensaje correctamente. <br>" +
                        "Te responderemos lo antes posible." +
                    "</p>" +
                    "<button class='btn-enviar' onclick='location.reload()' style='max-width: 200px; margin: 0 auto;'>" +
                        "VOLVER" +
                    "</button>" +
                "</div>";
        };
    }
});