// 1. Función GLOBAL para cambiar entre secciones (pestañas)
// Se coloca fuera para que el "onclick" del HTML pueda encontrarla
function mostrarSeccion(seccion) {
    var seccionPlatos = document.getElementById('seccion-platos');
    var seccionMenu = document.getElementById('seccion-menu');
    var btnPlatos = document.getElementById('btn-platos');
    var btnMenu = document.getElementById('btn-menu');

    if (seccion === 'platos') {
        seccionPlatos.classList.remove('paso-oculto');
        seccionMenu.classList.add('paso-oculto');
        btnPlatos.classList.add('activo');
        btnMenu.classList.remove('activo');
    } else {
        seccionPlatos.classList.add('paso-oculto');
        seccionMenu.classList.remove('paso-oculto');
        btnPlatos.classList.remove('activo');
        btnMenu.classList.add('activo');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 2. Lógica para botones de platos individuales
    var botones = document.querySelectorAll('.Plato button');

    for (var i = 0; i < botones.length; i++) {
        botones[i].addEventListener('click', function() {
            var contenedorPlato = this.parentElement.parentElement;
            var nombre = contenedorPlato.querySelector('h5').innerText;
            var precioTexto = contenedorPlato.querySelector('.precio').innerText;
            var precio = parseFloat(precioTexto.replace('€', '').replace(',', '.'));
            var imagen = contenedorPlato.querySelector('img').src;

            añadirAlPedido(nombre, precio, imagen);
        });
    }

    // 3. Lógica para el botón de "Menú Completo"
    var btnMenuEspecial = document.querySelector('.btn-añadir-especial');
    if (btnMenuEspecial) {
        btnMenuEspecial.onclick = function() {
            // Datos fijos del menú de oferta
            var nombreMenu = "Menú Completo Bodeguetes";
            var precioMenu = 9.00;
            var imagenMenu = "./img/slider3.png"; // Puedes cambiar por una imagen de pack

            añadirAlPedido(nombreMenu, precioMenu, imagenMenu);
        };
    }

    // 4. Función para guardar en LocalStorage
    function añadirAlPedido(nombre, precio, imagen) {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        var encontrado = false;

        for (var j = 0; j < pedido.length; j++) {
            if (pedido[j].nombre === nombre) {
                pedido[j].cantidad++;
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            pedido.push({
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        }

        localStorage.setItem('pedido', JSON.stringify(pedido));
        actualizarMiniCesta(); 
    }

    // 5. Función para actualizar la interfaz de la minicesta
    function actualizarMiniCesta() {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        var lista = document.getElementById('lista-resumen');
        var panel = document.getElementById('mini-cesta');
        var totalTxt = document.getElementById('total-mini');
        var suma = 0;
        var html = "";

        if (pedido.length > 0) {
            panel.style.display = "block"; 
            for (var k = 0; k < pedido.length; k++) {
                var subtotal = pedido[k].precio * pedido[k].cantidad;
                suma += subtotal;
                html += "<li>" + pedido[k].cantidad + "x " + pedido[k].nombre + " <span>" + subtotal.toFixed(2) + "€</span></li>";
            }
            lista.innerHTML = html;
            totalTxt.innerText = suma.toFixed(2) + "€";
        } else {
            panel.style.display = "none";
        }
    }

    // Carga inicial
    actualizarMiniCesta();
});