document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del Contador Regresivo ---
    // Fecha del Torneo: 28 de Junio de 2025, 09:30:00 (Meses son 0-11, así que Junio es 5)
    const tournamentDate = new Date(2025, 5, 28, 9, 30, 0).getTime();

    const countdownElement = document.getElementById('countdown');

    if (countdownElement) {
        const updateCountdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = tournamentDate - now;

            // Cálculos para días, horas, minutos y segundos
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Mostrar el resultado en el elemento
            if (countdownElement) {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }

            // Si el conteo regresivo ha terminado
            if (distance < 0) {
                clearInterval(updateCountdown);
                if (countdownElement) {
                    countdownElement.innerHTML = "¡TORNEO EN MARCHA!";
                    countdownElement.style.color = "var(--secondary-color)";
                    countdownElement.style.fontSize = "1.8em";
                }
            }
        }, 1000); // Actualiza cada 1 segundo (1000ms)
    }

    // --- Lógica del Formulario de Inscripción ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

            const teamName = document.getElementById('teamName').value;
            alert(`¡Inscripción de "${teamName}" enviada con éxito! Nos pondremos en contacto contigo.`);

            registrationForm.reset(); // Limpia el formulario
        });
    }
});