// Obtener referencia al botón "Play"
const playButton = document.getElementById('play-button');

// Agregar un evento de clic al botón "Play"
playButton.addEventListener('click', () => {
    // Redireccionar al usuario al HTML del juego
    window.location.href = "game.html"; // Reemplaza "game.html" con la ruta de tu archivo HTML del juego
});
