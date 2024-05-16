const gameContainer = document.getElementById('game-container');
const chef = document.getElementById('chef');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const backgroundMusic = document.getElementById('background-music');
const collisionSound = document.getElementById('collision-sound');
const rareSound = document.getElementById('rare-sound');
const harmfulSound = document.getElementById('harmful-sound');
const lifeSound = document.getElementById('life-sound');
let fallSpeed = 2;
let score = 0;
let lives = 3;
let level = 10000;

function moveChef(x) {
    backgroundMusic.volume = 0.2;
    backgroundMusic.play();
    const rect = gameContainer.getBoundingClientRect();
    let positionX = x - rect.left;
    if (positionX < 50) positionX = 50;
    if (positionX > rect.width - 50) positionX = rect.width - 50;
    chef.style.left = `${positionX}px`;
}

document.addEventListener('mousemove', (event) => moveChef(event.clientX));
document.addEventListener('touchmove', (event) => moveChef(event.touches[0].clientX));

function createMeta() {
    const meta = document.createElement('div');
    meta.classList.add('meta');
    const maxLeftPosition = gameContainer.clientWidth - 30;
    let leftPosition;
    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, meta.clientWidth));

    meta.style.left = `${leftPosition}px`;
    gameContainer.appendChild(meta);
    meta.style.top = '0px';

    function fall() {
        const top = parseInt(meta.style.top || 0);
        if (top < gameContainer.clientHeight) {
            meta.style.top = `${top + fallSpeed}px`;
            if (isCollision(chef, meta)) {
                collisionSound.currentTime = 0;
                collisionSound.play();
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                gameContainer.removeChild(meta);
            } else if (top >= gameContainer.clientHeight - 20) {
                loseLife();
                gameContainer.removeChild(meta);
            } else {
                requestAnimationFrame(fall);
            }
        } else {
            gameContainer.removeChild(meta);
        }
    }

    requestAnimationFrame(fall);
    setTimeout(createMeta, 500);
}

function createRareItem() {
    const rareItem = document.createElement('div');
    rareItem.classList.add('rare-item');
    const maxLeftPosition = gameContainer.clientWidth - 30;
    let leftPosition;
    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, rareItem.clientWidth));

    rareItem.style.left = `${leftPosition}px`;
    gameContainer.appendChild(rareItem);
    rareItem.style.top = '0px';

    function fall() {
        const top = parseInt(rareItem.style.top || 0);
        if (top < gameContainer.clientHeight) {
            rareItem.style.top = `${top + fallSpeed}px`;
            if (isCollision(chef, rareItem)) {
                rareSound.currentTime = 0;
                rareSound.play();
                score += 5;
                scoreDisplay.textContent = `Score: ${score}`;
                gameContainer.removeChild(rareItem);
            } else {
                requestAnimationFrame(fall);
            }
        } else {
            gameContainer.removeChild(rareItem);
        }
    }

    requestAnimationFrame(fall);
    setTimeout(createRareItem, Math.random() * 15000 + 15000);
}

function createHarmfulItem() {
    const harmfulItem = document.createElement('div');
    harmfulItem.classList.add('harmful-item');
    const maxLeftPosition = gameContainer.clientWidth - 30;
    let leftPosition;
    do {
        leftPosition = Math.random() * maxLeftPosition;
    } while (isOverlapping(leftPosition, harmfulItem.clientWidth));

    harmfulItem.style.left = `${leftPosition}px`;
    gameContainer.appendChild(harmfulItem);
    harmfulItem.style.top = '0px';

    function fall() {
        const top = parseInt(harmfulItem.style.top || 0);
        if (top < gameContainer.clientHeight) {
            harmfulItem.style.top = `${top + fallSpeed}px`;
            if (isCollision(chef, harmfulItem)) {
                harmfulSound.currentTime = 0;
                harmfulSound.play();
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
    setTimeout(createHarmfulItem, Math.random() * 8000 + 8000);
}

function createLifeItem() {
    const lifeItem = document.createElement('div');
    lifeItem.classList.add('life-item');
    const maxLeftPosition = gameContainer.clientWidth - 30;
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
                lifeSound.currentTime = 0;
                lifeSound.play();
                gainLife();
                gameContainer.removeChild(lifeItem);
            } else {
                requestAnimationFrame(fall);
            }
        } else {
            gameContainer.removeChild(lifeItem);
        }
    }

    requestAnimationFrame(fall);
    setTimeout(createLifeItem, Math.random() * 20000 + 20000);
}

function loseLife() {
    lives--;
    updateLivesDisplay();
    chef.classList.add('damage');
    setTimeout(() => chef.classList.remove('damage'), 500);
    if (lives === 0) {
        gameOver();
    }
}

function gainLife() {
    if (lives < 3) {
        lives++;
        updateLivesDisplay();
    }
}

function updateLivesDisplay() {
    const hearts = livesDisplay.querySelectorAll('span');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('gray', index >= lives);
    });
}

function gameOver() {
    backgroundMusic.pause();
    alert('Game Over');
    window.location.reload();
}

function isCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function isOverlapping(leftPosition, width) {
    const items = gameContainer.children;
    for (let item of items) {
        if (item.classList.contains('meta') || item.classList.contains('rare-item') || item.classList.contains('harmful-item') || item.classList.contains('life-item')) {
            const itemRect = item.getBoundingClientRect();
            if (leftPosition + width > itemRect.left && leftPosition < itemRect.right) {
                return true;
            }
        }
    }
    return false;
}

function increaseLevel(){
		fallSpeed += 2;
		if(level > 1000)
		{
			level -= 1000;
		}
		setTimeout(increaseLevel, Math.random() * 5000); // Harmful item appears every 10-20 seconds
	}

setTimeout(createRareItem, Math.random() * 15000 + 15000);
setTimeout(createMeta, Math.random() * 1000); // Inicia la generación de meta después de un segundo
setTimeout(createHarmfulItem, Math.random() * 5000 + 5000);
setTimeout(createLifeItem, Math.random() * 20000 + 10000);
setTimeout(increaseLevel, Math.random() * 5000);

setInterval(() => {
    fallSpeed += 0.2;
    level -= 500;
}, level);
