document.addEventListener("DOMContentLoaded", function() {
    var formulario = document.querySelector("form");
    var contenedorPrincipal = document.querySelector("main");

    if (formulario) {
        formulario.onsubmit = function(e) {
            e.preventDefault();

            var nombre = document.getElementById("nombre").value;

            contenedorPrincipal.innerHTML =
                "<div class=\"mensaje-exito\" style=\"text-align: center; padding: 60px 20px;\">" +
                    "<h2 style=\"font-family: Fraunces, serif; color: #410805; font-size: 25px;\">" +
                        "¡Gracias por contactar, " + nombre + "!" +
                    "</h2>" +
                    "<p style=\"margin: 20px 0; font-size: 18px;\">" +
                        "Hemos recibido tu mensaje correctamente. <br>" +
                        "Te responderemos lo antes posible." +
                    "</p>" +
                    "<button class=\"btn-enviar\" onclick=\"location.reload()\" style=\"max-width: 200px; margin: 0 auto;\">" +
                        "VOLVER" +
                    "</button>" +
                "</div>";
        };
    }

    var caja = document.getElementById("caja-drop");

    if (caja && formulario) {

        // input file oculto
        var inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.name = "foto";
        inputFile.accept = "image/*";
        inputFile.hidden = true;
        formulario.appendChild(inputFile);

        // click en la caja
        caja.addEventListener("click", function() {
            inputFile.click();
        });

        // para arrastrar archivos en la zona
        caja.addEventListener("dragover", function(e) {
            e.preventDefault();
            caja.classList.add("dragover");
        });

        caja.addEventListener("dragleave", function() {
            caja.classList.remove("dragover");
        });

        // soltar imagen
        caja.addEventListener("drop", function(e) {
            e.preventDefault();
            caja.classList.remove("dragover");

            var file = e.dataTransfer.files[0];
            if (!file || !file.type.startsWith("image/")) return;

            inputFile.files = e.dataTransfer.files;
            mostrarImagen(file);
        });

        // para detectar la selección de imagen desde el explorador abierto
        inputFile.addEventListener("change", function() {
            var file = this.files[0];
            if (file) mostrarImagen(file);
        });

        function mostrarImagen(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                caja.innerHTML = "<img src=\"" + e.target.result + "\">";
            };
            reader.readAsDataURL(file);
        }
    }
});
