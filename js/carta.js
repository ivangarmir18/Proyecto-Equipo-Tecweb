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

window.eliminarDeCesta = function(nombre) {
    var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
    var nuevoPedido = [];

    for (var i = 0; i < pedido.length; i++) {
        if (pedido[i].nombre !== nombre) {
            nuevoPedido.push(pedido[i]);
        }
    }
    
    localStorage.setItem('pedido', JSON.stringify(nuevoPedido));
    actualizarMiniCestaUI();
};

var actualizarMiniCestaUI;

document.addEventListener('DOMContentLoaded', function() {

    // 3. Lógica para girar las cartas
    var platos = document.querySelectorAll('.Plato');
    for (var i = 0; i < platos.length; i++) {
        platos[i].onclick = function(e) {
            // Si el clic es en el botón, no giramos
            if (e.target.tagName === 'BUTTON') {
                return;
            }
            // Usamos toggle para anadir/quitar la clase que gira
            this.classList.toggle('girado');
        };
    }

    // 4. Lógica para anadir platos
    var botonesanadir = document.querySelectorAll('.btn-anadir');
    for (var j = 0; j < botonesanadir.length; j++) {
        botonesanadir[j].onclick = function(e) {
            // Evitamos que el clic llegue a la tarjeta y la gire
            e.stopPropagation(); 
            
            // Subimos por el DOM hasta llegar al contenedor principal .Plato
            var card = this.parentElement.parentElement; 
            
            var nombre = card.querySelector('h5').innerText;
            var precioTexto = card.querySelector('.precio').innerText;
            var precio = parseFloat(precioTexto.replace('€', '').replace(',', '.'));
            var imagen = card.querySelector('img').src;

            anadirAlPedido(nombre, precio, imagen);
        };
    }

    var btnMenuEspecial = document.querySelector('.btn-anadir-especial');
    if (btnMenuEspecial) {
        btnMenuEspecial.onclick = function() {
            // Buscamos el radio button marcado para cada categoría
            var entranteSel = document.querySelector('input[name="entrante"]:checked');
            var principalSel = document.querySelector('input[name="principal"]:checked');
            var postreSel = document.querySelector('input[name="postre"]:checked');

            if(!entranteSel || !principalSel || !postreSel) {
                alert("Por favor, selecciona una foto de cada sección antes de anadir el menú.");
                return;
            }

            var nombreMenuDetallado = "Menú: " + entranteSel.value + ", " + principalSel.value + " y " + postreSel.value;
            var precioMenu = 9.00;
            var imagenMenu = "../html/img/menu.jpg"; 

            anadirAlPedido(nombreMenuDetallado, precioMenu, imagenMenu);
            
            // Desmarcamos los radios tras anadir
            document.querySelectorAll('.menu-configurador input[type="radio"]').forEach(r => r.checked = false);
        };
    }

    function anadirAlPedido(nombre, precio, imagen) {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || []; // Busca Pedido, si no existe manda un array vacío para evitar null
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