/**
Responsable: Iván García Miranda
Funcionalidad: Gestión de reservas y validación de formulario
 */

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-comanda');
    const contenedorItems = document.getElementById('contenedor-items');

    // Simulación de carga de platos (en el futuro vendrán de 'Carta')
    // Esto hace que la página no se vea vacía hoy.
    const cargarPlatosSimulados = () => {
        const platos = ["Paella Valenciana", "Croquetas Caseras"];
        if (platos.length > 0) {
            contenedorItems.innerHTML = '<ul>' + 
                platos.map(p => `<li>${p}</li>`).join('') + 
                '</ul>';
        }
    };

    cargarPlatosSimulados();

    // 2. Procesamiento del formulario (6.d de la guía)
    formulario.addEventListener('submit', (evento) => {
        // Evitamos que la página se refresque (comportamiento por defecto)
        evento.preventDefault();

        // Captura de datos
        const datos = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value
        };

        confirmarReserva(datos);
    });

    /**
     * Función para mostrar la confirmación al cliente
     */
    function confirmarReserva(datos) {
        
        const seccionForm = document.getElementById('formulario-reserva');
        
        seccionForm.innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb;">
                <h3>¡Reserva Confirmada, ${datos.nombre}!</h3>
                <p>Tu pedido estará listo el día <strong>${datos.fecha}</strong> a las <strong>${datos.hora}</strong>.</p>
                <p>Te avisaremos al teléfono ${datos.telefono} si hay algún cambio.</p>
                <button onclick="window.location.reload()">Hacer otra reserva</button>
            </div>
        `;
        
        console.log("Datos de la reserva procesados:", datos);
    }
});