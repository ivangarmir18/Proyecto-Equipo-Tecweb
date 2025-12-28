document.addEventListener('DOMContentLoaded', function() {
    
    var inputFecha = document.getElementById('fecha');
    var selectHora = document.getElementById('hora');
    
    // 1. LIMITAR FECHA MÍNIMA
    var hoy = new Date().toISOString().split('T')[0];
    inputFecha.min = hoy;

    // 2. GENERAR LAS HORAS EXCLUSIVAS (11:00 a 16:00)
    function cargarHoras() {
        var opciones = "";
        for (var h = 11; h <= 16; h++) {
            opciones += "<option value='" + h + ":00'>" + h + ":00</option>";
            if (h < 16) {
                opciones += "<option value='" + h + ":30'>" + h + ":30</option>";
            }
        }
        selectHora.innerHTML = opciones;
    }

    cargarHoras();

    document.getElementById('ir-paso-2').onclick = function() {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        if (pedido.length === 0) return alert("Cesta vacía");

        document.getElementById('paso-1').className = 'contenedor-paso paso-oculto';
        document.getElementById('paso-2').className = 'contenedor-paso';
        
        document.getElementById('ind-paso-1').className = 'paso-indicador completado';
        document.getElementById('ind-paso-2').className = 'paso-indicador activo';
        window.scrollTo(0,0);
    };

    document.getElementById('volver-paso-1').onclick = function() {
        document.getElementById('paso-2').className = 'contenedor-paso paso-oculto';
        document.getElementById('paso-1').className = 'contenedor-paso';

        document.getElementById('ind-paso-1').className = 'paso-indicador activo';
        document.getElementById('ind-paso-2').className = 'paso-indicador';
    };

    function dibujarTabla() {
        var pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        var cuerpo = document.getElementById('cuerpo-tabla');
        var totalTxt = document.getElementById('precio-total');
        var suma = 0;
        var html = "";

        for (var i = 0; i < pedido.length; i++) {
            var sub = pedido[i].precio * pedido[i].cantidad;
            suma += sub;

            html += "<tr>" +
                "<td><img src='" + pedido[i].imagen + "' class='img-mini'></td>" +
                "<td><span class='nombre-plato'>" + pedido[i].nombre + "</span><span class='precio-plato'>" + pedido[i].precio + "€</span></td>" +
                "<td>" +
                    "<div class='selector-cantidad'>" +
                        "<button class='btn-qty' onclick='cambiar(" + i + ", -1)'>-</button> " +
                        "<span>" + pedido[i].cantidad + "</span> " +
                        "<button class='btn-qty' onclick='cambiar(" + i + ", 1)'>+</button>" +
                    "</div>" +
                "</td>" +
                "<td><strong>" + sub.toFixed(2) + "€</strong></td>" +
                "<td><button class='btn-borrar' onclick='borrar(" + i + ")'>🗑</button></td>" +
            "</tr>";
        }
        cuerpo.innerHTML = html || "<tr><td colspan='5' style='text-align:center; padding:30px;'>Cesta vacía</td></tr>";
        totalTxt.innerHTML = suma.toFixed(2) + "€";
    }

    window.cambiar = function(i, v) {
        var p = JSON.parse(localStorage.getItem('pedido'));
        p[i].cantidad += v;
        if (p[i].cantidad < 1) p[i].cantidad = 1;
        localStorage.setItem('pedido', JSON.stringify(p));
        dibujarTabla();
    };

    window.borrar = function(i) {
        var p = JSON.parse(localStorage.getItem('pedido'));
        p.splice(i, 1);
        localStorage.setItem('pedido', JSON.stringify(p));
        dibujarTabla();
    };

    dibujarTabla();

    document.getElementById('form-comanda').onsubmit = function(e) {
        e.preventDefault();
        var nombre = document.getElementById('nombre').value;
        var fecha = document.getElementById('fecha').value;
        var hora = selectHora.value;

        document.getElementById('paso-2').className = 'paso-oculto';
        var exito = document.getElementById('seccion-exito');
        exito.className = 'mensaje-exito';
        exito.innerHTML = "<h2>¡Reserva Confirmada, " + nombre + "!</h2>" +
                          "<p>Te esperamos el <strong>" + fecha + "</strong> a las <strong>" + hora + "</strong>.</p>" +
                          "<button class='btn-primario' onclick='location.reload()'>Volver</button>";
        localStorage.removeItem('pedido');
    };
});