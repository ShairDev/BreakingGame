const gameContainer = document.getElementById('game-container');
const chef = document.getElementById('chef');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');    
const backgroundMusic = document.getElementById('background-music');
const collisionSound = document.getElementById('collision-sound');
const rareSound = document.getElementById('rare-sound');
const harmfulSound = document.getElementById('harmful_sound');
const lifeSound = document.getElementById('life_sound');
const fallSpeed = 2;
const level = 10000;
let score = 0;
let lives = 3;

	
    




// Creamos la línea colisionadora
const collisionLine = document.createElement('div');
collisionLine.classList.add('collision-line');
collisionLine.style.top = `${gameContainer.clientHeight - 20}px`; // Posición de la línea
gameContainer.appendChild(collisionLine);

function moveChef(x) {
	backgroundMusic.volume = 0.2;
	backgroundMusic.play();
	const rect = gameContainer.getBoundingClientRect();
	let positionX = x - rect.left;
	if (positionX < 50) positionX = 50;
	if (positionX > rect.width - 50) positionX = rect.width - 50;
	chef.style.left = `${positionX}px`;
}

document.addEventListener('mousemove', (event) => {
	moveChef(event.clientX);
});

document.addEventListener('touchmove', (event) => {
	moveChef(event.touches[0].clientX);
});

function createMeta() {
    createFallingItem('meta', collisionSound, 1, 500);
}

function createRareItem() {
    createFallingItem('rare-item', rareSound, 5, Math.random() * 15000 + 15000);
}

function createHarmfulItem() {
    createFallingItem('harmful-item', harmfulSound, 0, Math.random() * level + 5000, loseLifeharmful, true);
}

function createLifeItem() {
    createFallingItem('life-item', lifeSound, 0, Math.random() * 20000 + 30000, gainLife);
}

function createFallingItem(className, sound, scoreIncrement, delay, callback = null, damage = false) {
    const item = document.createElement('div');
    item.classList.add(className);
    const maxLeftPosition = gameContainer.clientWidth - 30;
    let leftPosition;

    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, item.clientWidth));

    item.style.left = `${leftPosition}px`;
    item.style.top = '0px';
    gameContainer.appendChild(item);

    function fall() {
        const top = parseInt(item.style.top);
        if (top < gameContainer.clientHeight) {
            item.style.top = `${top + fallSpeed}px`;
            if (isCollision(chef, item)) {
				if(className == 'meta'){
					sound.volume = 0.2;
				}
                sound.currentTime = 0;
                sound.play();
                score += scoreIncrement;
                scoreDisplay.textContent = `Score: ${score}`;
                gameContainer.removeChild(item);
                if (callback) callback(); 
            } else if (top >= gameContainer.clientHeight - 20) {
                if (damage && !isCollision(chef, item)) 
				{
                    loseLife();
                }
				else if (className == 'meta' && !isCollision(chef, item)) 
				{
					loseLife();
				}
                gameContainer.removeChild(item);
            } else {
                requestAnimationFrame(fall);
            }
        } else {
            gameContainer.removeChild(item);
        }
    }

    requestAnimationFrame(fall);
    setTimeout(() => createFallingItem(className, sound, scoreIncrement, delay, callback, damage), delay);
}


function isOverlapping(leftPosition, metaWidth) {
    const metas = document.querySelectorAll('.meta');
    for (let i = 0; i < metas.length; i++) {
        const existingMeta = metas[i];
        const existingLeft = parseInt(existingMeta.style.left || 0);
        const existingWidth = existingMeta.clientWidth;
        if (Math.abs(leftPosition - existingLeft) < (metaWidth + existingWidth)) {
            return true; // Se superponen
        }
    }
    return false; // No se superponen
}

function isCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(bRect.top > aRect.bottom || 
             bRect.bottom < aRect.top || 
             bRect.right < aRect.left || 
             bRect.left > aRect.right);

}

/* function loseLife() {
    let lifeLost = false; // Variable para controlar si se ha perdido una vida
    const metas = document.querySelectorAll('.meta');
    let bottomCollision = false; // Variable para verificar si hay alguna meta en el borde inferior
    for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        const top = parseInt(meta.style.top);
        const bottom = top + meta.clientHeight;
        if (!lifeLost && bottom >= gameContainer.clientHeight - 20) {
            bottomCollision = true;
            if (!isCollision(chef, meta)) {
                lives--;
                lifeLost = true; // Indicar que se ha perdido una vida
                if (lives >= 0) {
                    livesDisplay.innerHTML = 'Lives: ' + '&hearts;'.repeat(lives) + '<span style="color: gray;">&hearts;</span>'.repeat(3 - lives);
                }
                if (lives === 0) {
                    gameOver();
                }
            }
        }
    }
    // Si no hay colisión con una meta en el borde inferior, perder vida
    if (!lifeLost && bottomCollision) {
        lives--;
        if (lives >= 0) {
            livesDisplay.innerHTML = 'Lives: ' + '&hearts;'.repeat(lives) + '<span style="color: gray;">&hearts;</span>'.repeat(3 - lives);
        }
        if (lives === 0) {
            gameOver();
        }
    }
} */

	
	/* function increaseLevel(){
		fallSpeed += 2;
		if(level > 1000)
		{
			level -= 1000;
		}
		setTimeout(increaseLevel, Math.random() * 5000); // Harmful item appears every 10-20 seconds
	} */

function loseLife() {
    let lifeLost = false; // Variable para controlar si se ha perdido una vida
    const metas = document.querySelectorAll('.meta');
    let bottomCollision = false; // Variable para verificar si hay alguna meta en el borde inferior
    for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        const top = parseInt(meta.style.top);
        const bottom = top + meta.clientHeight;
        if (!lifeLost && bottom >= gameContainer.clientHeight - 20) {
            bottomCollision = true;
            if (!isCollision(chef, meta)) {
                lives--;
                lifeLost = true; // Indicar que se ha perdido una vida
                if (lives >= 0) {
                    updateLivesDisplay();
                }
                if (lives === 0) {
                    gameOver();
                }
            }
        }
    }
    // Si no hay colisión con una meta en el borde inferior, perder vida
    if (!lifeLost && bottomCollision) {
        lives--;
        if (lives >= 0) {
            updateLivesDisplay();
        }
        if (lives === 0) {
            gameOver();
        }
    }
	// Add animation class to the chef
    chef.classList.add('chef.damage');
    // Remove the animation class after the animation ends
    chef.addEventListener('animationend', () => {
        chef.classList.remove('chef.damage');
    }, { once: true });
}

function updateLivesDisplay() {
    const hearts = livesDisplay.querySelectorAll('span');
    hearts.forEach((heart, index) => {
        if (index >= lives) {
            heart.style.display = 'none'; // Oculta los corazones perdidos
        } else {
            heart.style.display = 'inline'; // Asegura que los corazones ganados sean visibles
        }
        heart.classList.toggle('gray', index >= lives);
    });
}

function loseLifeharmful(){
	lives--;
	
	// Add animation class to the chef
    chef.classList.add('chef.damage');
    // Remove the animation class after the animation ends
    chef.addEventListener('animationend', () => {
        chef.classList.remove('chef.damage');
    }, { once: true });
	if (lives >= 0) {
		updateLivesDisplay();
	}
	if (lives === 0) {
		gameOver();
	}
}

function gainLife() {
		if (lives < 3) {
			lives++;
			updateLivesDisplay();
		} else {
			score += 10; // If lives are full, give points instead
			scoreDisplay.textContent = `Score: ${score}`;
		}
	}







function gameOver() {
    alert("Game Over. Your final score is: " + score);
    // Limpiar cualquier meta que pueda estar presente en el contenedor del juego
    const items = document.querySelectorAll('.meta, .rare-item');
    items.forEach(item => gameContainer.removeChild(item));
    // Reiniciar vidas y puntaje
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.innerHTML = 'Lives: ' + '&#x2665;'.repeat(lives) + '<span style="color: red;">&#x2665;</span>'.repeat(3 - lives); // Volver a mostrar los corazones en rojo
    // Reiniciar el juego
	// Detener música de fondo
	backgroundMusic.pause();
	backgroundMusic.currentTime = 0;
	level = 10000;
	fallSpeed = 2;
    createMeta();// Inicia la generación del elemento raro al cargar el juego
	setTimeout(createRareItem, Math.random() * 15000 + 15000);
}



setTimeout(createRareItem, Math.random() * 15000 + 15000); // Iniciar rare item en un tiempo aleatorio entre 15-30 segundos // Inicia la generación del elemento raro al cargar el juego
createMeta();
setTimeout(createHarmfulItem, Math.random() * 5000 + 5000); // Start harmful item at a random time between 10-20 seconds
setTimeout(createLifeItem, Math.random() * 20000 + 10000); // Life item appears every 20-40 seconds
/* setTimeout(increaseLevel, Math.random() * 5000); // Harmful item appears every 10-20 seconds */
setInterval(() => {
	if(level > 0)
	{
		fallSpeed += 1;
		level -= 500;
	}
}, level);

