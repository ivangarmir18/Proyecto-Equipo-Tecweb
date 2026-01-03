document.addEventListener('DOMContentLoaded', function() {
    var tablaCuerpo = document.getElementById('cuerpo-tabla');
    var totalCesta = document.getElementById('precio-total');
    var resumenCant = document.getElementById('resumen-cantidad');
    var resumenTotal = document.getElementById('resumen-total');
    var inputFecha = document.getElementById('fecha');

    // 1. Configuración de fecha (buscado en tutorial)
    var hoy = new Date().toISOString().split('T')[0];
    if (inputFecha) inputFecha.min = hoy;

    function cargarHoras() {
        var selectHora = document.getElementById('hora');
        if (!selectHora) return;
        var opciones = "";
        for (var h = 12; h <= 16; h++) {
            opciones += "<option value='" + h + ":00'>" + h + ":00</option>";
            if (h < 16) {
                opciones += "<option value='" + h + ":30'>" + h + ":30</option>";
            }
        }
        selectHora.innerHTML = opciones;
    }

    function obtenerPedido() {
        return JSON.parse(localStorage.getItem('pedido')) || []; // Busca Pedido, si no existe manda un array vacío para evitar null
    }

    function guardarPedido(pedido) {
        localStorage.setItem('pedido', JSON.stringify(pedido)); // Lo almacena como si fuera una caché para guardar entre páginas o en F5
    }

    function dibujarCesta() {
        var pedido = obtenerPedido();
        var suma = 0;
        var cantTotal = 0;
        var htmlContenido = "";

        if (pedido.length === 0) {
            tablaCuerpo.innerHTML = 
                "<tr>" +
                    "<td colspan='5' style='text-align:center; padding:50px 20px;'>" +
                        "<p style='font-size: 20px; color: #111; margin-bottom: 25px;'>(cesta vacía)</p>" +
                        "<a href='carta.html' class='btn-primario' style='text-decoration: none; display: inline-block;'>" +
                            "VER CARTA" +
                        "</a>" +
                    "</td>" +
                "</tr>";
            
            // También ponemos a cero los totales por si acaso
            totalCesta.innerText = "0.00€";
            if (resumenCant) resumenCant.innerText = "0";
            if (resumenTotal) resumenTotal.innerText = "0.00€";
            return;
    }

        // Bucle for tradicional para mayor claridad
        for (var i = 0; i < pedido.length; i++) {
            var plato = pedido[i];
            var subtotal = plato.precio * plato.cantidad;
            suma += subtotal;
            cantTotal += plato.cantidad;

            htmlContenido += "<tr>" +
                "<td><img src='" + plato.imagen + "' class='img-mini'></td>" +
                "<td>" +
                    "<span class='nombre-plato'>" + plato.nombre + "</span>" +
                    "<span class='precio-plato'>" + plato.precio + "€</span>" +
                "</td>" +
                "<td>" +
                    "<div class='selector-cantidad'>" +
                        "<button class='btn-qty' onclick='actualizarCantidad(" + i + ", -1)'>-</button>" +
                        "<span>" + plato.cantidad + "</span>" +
                        "<button class='btn-qty' onclick='actualizarCantidad(" + i + ", 1)'>+</button>" +
                    "</div>" +
                "</td>" +
                "<td><strong>" + subtotal.toFixed(2) + "€</strong></td>" +
                "<td><button class='btn-borrar' onclick='eliminarPlato(" + i + ")'>🗑</button></td>" +
            "</tr>";
        }

        tablaCuerpo.innerHTML = htmlContenido;
        totalCesta.innerText = suma.toFixed(2) + "€";
        if (resumenCant) resumenCant.innerText = cantTotal;
        if (resumenTotal) resumenTotal.innerText = suma.toFixed(2) + "€";
    }

    window.actualizarCantidad = function(index, valor) {
        var pedido = obtenerPedido();
        pedido[index].cantidad = Math.max(1, pedido[index].cantidad + valor);
        guardarPedido(pedido);
        dibujarCesta();
    };

    window.eliminarPlato = function(index) {
        var pedido = obtenerPedido();
        pedido.splice(index, 1);
        guardarPedido(pedido);
        dibujarCesta();
    };

    // Navegación
    var btnPaso2 = document.getElementById('ir-paso-2');
    if (btnPaso2) {
        btnPaso2.onclick = function() {
            if (obtenerPedido().length === 0) return alert("Añade algún plato primero");
            document.getElementById('paso-1').classList.add('paso-oculto');
            document.getElementById('paso-2').classList.remove('paso-oculto');
            document.getElementById('ind-paso-1').className = 'paso-indicador completado';
            document.getElementById('ind-paso-2').className = 'paso-indicador activo';
        };
    }

    // Envío formulario
    var formComanda = document.getElementById('form-comanda');
    if (formComanda) {
        formComanda.onsubmit = function(e) {
            e.preventDefault();
            var datos = new FormData(e.target);
            var tipoServicio = datos.get('tipo_entrega') === 'recoger' ? "Recogida" : "En restaurante";

            document.getElementById('paso-2').classList.add('paso-oculto');
            var exito = document.getElementById('seccion-exito');
            exito.classList.remove('paso-oculto');
            exito.className = 'mensaje-exito';

            exito.innerHTML = "<h2>¡Reserva Confirmada!</h2>" +
                "<p>Hola <strong>" + datos.get('nombre') + "</strong>, tu pedido para <strong>" + tipoServicio + "</strong> ha sido registrado.</p>" +
                "<p>Te esperamos el <strong>" + datos.get('fecha') + "</strong> a las <strong>" + datos.get('hora') + "</strong>.</p>" +
                "<div style='margin-top:20px;'>" + "<button class='btn-primario' onclick='location.reload()'>Volver</button>" + "</div>";
            
            localStorage.removeItem('pedido');
        };
    }

    cargarHoras();
    dibujarCesta();
});