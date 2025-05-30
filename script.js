document.addEventListener('DOMContentLoaded', function() {

    const fechaTorneo = new Date(2025, 5, 28, 9, 30, 0).getTime();

    const elementoCuentaAtras = document.getElementById('cuentaAtras');

    if (elementoCuentaAtras) {
        const actualizarCuentaAtras = setInterval(function() {
            const ahora = new Date().getTime();
            const distancia = fechaTorneo - ahora;

            const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

            if (elementoCuentaAtras) {
                elementoCuentaAtras.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
            }

            if (distancia < 0) {
                clearInterval(actualizarCuentaAtras);
                if (elementoCuentaAtras) {
                    elementoCuentaAtras.innerHTML = "¡TORNEO EN MARCHA!";
                    elementoCuentaAtras.style.color = "var(--secondary-color)";
                    elementoCuentaAtras.style.fontSize = "1.8em";
                }
            }
        }, 1000);
    }

    const formularioInscripcion = document.getElementById('formularioInscripcion');
    if (formularioInscripcion) {
        formularioInscripcion.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombreEquipo = document.getElementById('nombreEquipo').value;
            alert(`¡Inscripción de "${nombreEquipo}" enviada con éxito! Nos pondremos en contacto contigo.`);

            formularioInscripcion.reset();
        });
    }
});