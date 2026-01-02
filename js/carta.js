// 1. Función GLOBAL para cambiar entre pestañas
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

// 2. Función GLOBAL para eliminar productos
window.eliminarDeCesta = function(nombre) {
    var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
    var nuevoPedido = pedido.filter(function(item) {
        return item.nombre !== nombre;
    });
    localStorage.setItem('pedido', JSON.stringify(nuevoPedido));
    actualizarMiniCestaUI();
};

var actualizarMiniCestaUI;

document.addEventListener('DOMContentLoaded', function() {

    // 3. LÓGICA PARA GIRAR LAS CARTAS (FLIP CARDS)
    var platos = document.querySelectorAll('.Plato');
    platos.forEach(function(plato) {
        plato.addEventListener('click', function(e) {
            // Si hacemos clic en el botón "Añadir", no queremos que la carta gire
            if (e.target.tagName === 'BUTTON') return;
            
            this.classList.toggle('girado');
        });
    });

    // 4. Lógica para botones de añadir platos individuales
    var botonesAñadir = document.querySelectorAll('.Plato button');
    botonesAñadir.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que la carta gire al añadir
            
            // Buscamos los datos dentro de la cara frontal de la carta
            var contenedorPlato = this.closest('.Plato');
            var nombre = contenedorPlato.querySelector('h5').innerText;
            var precioTexto = contenedorPlato.querySelector('.precio').innerText;
            var precio = parseFloat(precioTexto.replace('€', '').replace(',', '.'));
            var imagen = contenedorPlato.querySelector('img').src;

            añadirAlPedido(nombre, precio, imagen);
        });
    });

    // 5. NUEVA LÓGICA PARA EL MENÚ (RADIO BUTTONS)
    var btnMenuEspecial = document.querySelector('.btn-añadir-especial');
    if (btnMenuEspecial) {
        btnMenuEspecial.onclick = function() {
            // Buscamos el radio button marcado para cada categoría
            var entranteSel = document.querySelector('input[name="entrante"]:checked');
            var principalSel = document.querySelector('input[name="principal"]:checked');
            var postreSel = document.querySelector('input[name="postre"]:checked');

            if(!entranteSel || !principalSel || !postreSel) {
                alert("Por favor, selecciona una foto de cada sección antes de añadir el menú.");
                return;
            }

            var nombreMenuDetallado = "Menú: " + entranteSel.value + ", " + principalSel.value + " y " + postreSel.value;
            var precioMenu = 9.00;
            var imagenMenu = "./img/slider3.png"; 

            añadirAlPedido(nombreMenuDetallado, precioMenu, imagenMenu);
            
            // Desmarcamos los radios tras añadir
            document.querySelectorAll('.menu-configurador input[type="radio"]').forEach(r => r.checked = false);
        };
    }

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
            pedido.push({ nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
        }

        localStorage.setItem('pedido', JSON.stringify(pedido));
        actualizarMiniCestaUI(); 
    }

    actualizarMiniCestaUI = function() {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        var lista = document.getElementById('lista-resumen');
        var panel = document.getElementById('mini-cesta');
        var totalTxt = document.getElementById('total-mini');
        var suma = 0;
        var html = "";

        if (pedido && pedido.length > 0) {
            panel.style.display = "block"; 
            for (var k = 0; k < pedido.length; k++) {
                var subtotal = pedido[k].precio * pedido[k].cantidad;
                suma += subtotal;

                html += "<li>" + 
                            "<div class='nombre-item-cesta'><strong>" + pedido[k].cantidad + "x</strong> " + pedido[k].nombre + "</div>" +
                            "<div style='display:flex; align-items:center; gap:8px;'>" +
                                "<span style='font-weight:bold; color:#c0392b;'>" + subtotal.toFixed(2) + "€</span>" +
                                "<button class='btn-borrar-mini' onclick='eliminarDeCesta(\"" + pedido[k].nombre + "\")'>🗑</button>" +
                            "</div>" +
                        "</li>";
            }
            lista.innerHTML = html;
            totalTxt.innerText = suma.toFixed(2) + "€";
        } else {
            panel.style.display = "none";
        }
    };

    actualizarMiniCestaUI();
});