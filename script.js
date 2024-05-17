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
    const meta = document.createElement('div');
    meta.classList.add('meta');
    meta.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    const maxLeftPosition = gameContainer.clientWidth - 30; // El ancho máximo es el ancho del contenedor menos el ancho de la meta
    let leftPosition;
    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, meta.clientWidth));

    meta.style.left = `${leftPosition}px`; // Ajustar la posición horizontal para que esté dentro de los límites del contenedor
	gameContainer.appendChild(meta);
    meta.style.top = '0px';
    //const fallSpeed = 2; // You can adjust the speed here

    function fall() {
        const top = parseInt(meta.style.top);
        if (top < gameContainer.clientHeight) {
            meta.style.top = `${top + fallSpeed}px`;
            if (isCollision(chef, meta)) {
				collisionSound.volume = 0.5;
				collisionSound.currentTime = 0; // Reiniciar el sonido para reproducirlo desde el principio
				collisionSound.play(); // Reproducir el sonido de la colisión
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                gameContainer.removeChild(meta);
            } else if (top >= gameContainer.clientHeight - 20 && !isCollision(chef, meta)) {
                loseLife();
                gameContainer.removeChild(meta);
            }
            requestAnimationFrame(fall);
        } else {
            gameContainer.removeChild(meta);
        }
    }

    requestAnimationFrame(fall);
    setTimeout(createMeta, 500);
}

function createRareItem() 
{
	const rareItem = document.createElement('div');
	rareItem.classList.add('rare-item');
	const maxLeftPosition = gameContainer.clientWidth - 30;
	rareItem.style.left = `${Math.random() * maxLeftPosition}px`;
	let leftPosition;
    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, rareItem.clientWidth));
	rareItem.style.left = `${leftPosition}px`;
	gameContainer.appendChild(rareItem);
	rareItem.style.top = '0px';
	//const fallSpeed = 2;
	function fall() {
		const top = parseInt(rareItem.style.top);
		if (top < gameContainer.clientHeight) {
			rareItem.style.top = `${top + fallSpeed}px`;
			if (isCollision(chef, rareItem)) {
				rareSound.currentTime = 0; // Reiniciar el sonido para reproducirlo desde el principio
				rareSound.play(); // Reproducir el sonido de la colisión
				score += 5; // Rare items give more points
				scoreDisplay.textContent = `Score: ${score}`;
				gameContainer.removeChild(rareItem);
			} else if (top >= gameContainer.clientHeight - 20) {
				if (!isCollisionLine(chef, collisionLine)) {
					loseLife();
				}
				gameContainer.removeChild(rareItem);
			} else {
				requestAnimationFrame(fall);
			}
		} else {
			gameContainer.removeChild(rareItem);
		}
	}

	requestAnimationFrame(fall);
	setTimeout(createRareItem, Math.random() * 15000 + 15000); // Rare item appears every 15-30 seconds
}

function createHarmfulItem() {
		const harmfulItem = document.createElement('div');
		harmfulItem.classList.add('harmful-item');
		const maxLeftPosition = gameContainer.clientWidth - 30;
		harmfulItem.style.left = `${Math.random() * maxLeftPosition}px`;
		gameContainer.appendChild(harmfulItem);
		let leftPosition;
		do {
			leftPosition = Math.random() * maxLeftPosition;
		} while (isOverlapping(leftPosition, harmfulItem.clientWidth));
		harmfulItem.style.left = `${leftPosition}px`;
		gameContainer.appendChild(harmfulItem);
		harmfulItem.style.top = '0px';

		function fall() {
		const top = parseInt(harmfulItem.style.top);
		if (top < gameContainer.clientHeight) {
			harmfulItem.style.top = `${top + fallSpeed}px`;
			if (isCollision(chef, harmfulItem)) {
				chef.classList.add('damage');
				setTimeout(() => chef.classList.remove('damage'), 500); // Remove animation class after it completes
				harmfulSound.currentTime = 0; // Reiniciar el sonido para reproducirlo desde el principio
				harmfulSound.play(); // Reproducir el sonido de la colisión
				loseLife();
				gameContainer.removeChild(harmfulItem);
			} else {
				requestAnimationFrame(fall);
			}
		} else {
			gameContainer.removeChild(harmfulItem);
		}
	}

		requestAnimationFrame(fall);
		setTimeout(createHarmfulItem, Math.random() * level + 10000); // Harmful item appears every 10-20 seconds
	}
	
	/* function increaseLevel(){
		fallSpeed += 2;
		if(level > 1000)
		{
			level -= 1000;
		}
		setTimeout(increaseLevel, Math.random() * 5000); // Harmful item appears every 10-20 seconds
	} */
	
function createLifeItem() {
		const lifeItem = document.createElement('div');
		lifeItem.classList.add('life-item');
		const maxLeftPosition = gameContainer.clientWidth - 30;
		lifeItem.style.left = `${Math.random() * maxLeftPosition}px`;
		gameContainer.appendChild(lifeItem);
		//const fallSpeed = 2;
		let leftPosition;
		do {
			leftPosition = Math.random() * maxLeftPosition;
		} while (isOverlapping(leftPosition, lifeItem.clientWidth));
		lifeItem.style.left = `${leftPosition}px`;
		gameContainer.appendChild(lifeItem);
		lifeItem.style.top = '0px';

		function fall() {
			const top = parseInt(lifeItem.style.top || 0);
			if (top < gameContainer.clientHeight) {
				lifeItem.style.top = `${top + fallSpeed}px`;
				if (isCollision(chef, lifeItem)) {
					lifeSound.currentTime = 0; // Reiniciar el sonido para reproducirlo desde el principio
					lifeSound.play(); // Reproducir el sonido de la colisión
					gainLife();
					gameContainer.removeChild(lifeItem);
				} else if (top >= gameContainer.clientHeight - 20) {
					gameContainer.removeChild(lifeItem);
				} else {
					requestAnimationFrame(fall);
				}
			} else {
				gameContainer.removeChild(lifeItem);
			}
		}

		requestAnimationFrame(fall);
		setTimeout(createLifeItem, Math.random() * 20000 + 30000); // Life item appears every 20-40 seconds
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

function isCollision(chef, meta) {
    const chefRect = chef.getBoundingClientRect();
    const metaRect = meta.getBoundingClientRect();
    return !(metaRect.top > chefRect.bottom || 
             metaRect.bottom < chefRect.top || 
             metaRect.right < chefRect.left || 
             metaRect.left > chefRect.right);

}

function isCollisionRare(chef, rareItem) {
    const chefRect = chef.getBoundingClientRect();
    const rareRect = rareItem.getBoundingClientRect();
    return !(rareRect.top > chefRect.bottom || 
             rareRect.bottom < chefRect.top || 
             rareRect.right < chefRect.left || 
             rareRect.left > chefRect.right);

}

function isCollisionLine(chef, line) {
    const chefRect = chef.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();

    return !(lineRect.top > chefRect.bottom || 
             lineRect.bottom < chefRect.top || 
             lineRect.right < chefRect.left || 
             lineRect.left > chefRect.right);
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
}

function updateLivesDisplay() {
    const hearts = livesDisplay.querySelectorAll('span');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('gray', index >= lives);
    });
}

function loseLifeharmful(){
	lives--;
	if (lives >= 0) {
		livesDisplay.innerHTML = 'Lives: ' + '&#x2665;'.repeat(lives) + '<span style="color: gray;">&#x2665;</span>'.repeat(3 - lives);
	}
	if (lives === 0) {
		gameOver();
	}
}

function gainLife() {
		if (lives < 3) {
			lives++;
			livesDisplay.innerHTML = 'Lives: ' + '&#x2665;'.repeat(lives) + '<span style="color: gray;">&#x2665;</span>'.repeat(3 - lives);
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
    fallSpeed += 0.2;
    level -= 500;
}, level);

