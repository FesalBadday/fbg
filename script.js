const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdX, birdY, birdSpeedY, gravity, jumpForce;
let pipeInterval, pipes, pipeGap, pipeSpeed, score, bestScore, gameOver;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const bestScoreDisplay = document.getElementById('bestScore');
const countdownDisplay = document.getElementById('countdown');

startButton.addEventListener('click', startCountdown);
restartButton.addEventListener('click', startCountdown);

// Initialize the game and best score display on page load
document.addEventListener('DOMContentLoaded', () => {
  bestScore = localStorage.getItem('bestScore') || 0;
  updateBestScoreDisplay();
  showStartButton(); // Show the "Start Game" button initially
});

function startCountdown() {
  disableButtons(); // Disable buttons during countdown
  countdownDisplay.style.opacity = '1'; // Fade in the countdown display
  let countdown = 3;

  countdownDisplay.textContent = countdown;

  // Update countdown display every second
  let countdownInterval = setInterval(() => {
    countdown--;
    if (countdown >= 0) {
      countdownDisplay.textContent = countdown;
    } else {
      clearInterval(countdownInterval);
      countdownDisplay.style.opacity = '0'; // Fade out the countdown display
      setTimeout(() => {
        countdownDisplay.textContent = ''; // Clear countdown text
        startGame(); // Start the game after countdown
        enableButtons(); // Enable buttons after countdown
      }, 500); // Delay before starting game
    }
  }, 1000);
}

function startGame() {
  canvas.style.display = 'block'; // Show the canvas when game starts
  canvas.width = window.innerWidth; // Set canvas width to window width
  canvas.height = window.innerHeight; // Set canvas height to window height

  birdX = 50;
  birdY = canvas.height / 2;
  birdSpeedY = 0;
  gravity = 0.1; // Adjusted gravity for slower descent
  jumpForce = -4; // Adjusted jump force for easier jumps
  pipeInterval = 300; // Increased interval between pipes for slower gameplay
  pipeGap = 250; // Increased pipe gap for easier gameplay
  pipeSpeed = 1; // Slower pipe movement speed
  pipes = [];
  score = 0;
  gameOver = false;

  hideStartButton(); // Hide the "Start Game" button when game starts
  restartButton.style.display = 'none'; // Hide the "Restart Game" button

  // Set up touch event listener for jumping on mobile devices
  canvas.addEventListener('click', jump);

  gameLoop();
}

function restartGame() {
  startCountdown(); // Start countdown on restart
}

function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    birdSpeedY += gravity;
    birdY += birdSpeedY;

    drawBird();
    generatePipes();
    updatePipes();
    checkCollisions();
    displayScore();

    requestAnimationFrame(gameLoop);
  } else {
    endGame();
    showRestartButton(); // Show the "Restart Game" button when game ends
  }
}

function drawBird() {
  ctx.fillStyle = '#f44336';
  ctx.fillRect(birdX, birdY, 20, 20);
}

function jump(event) {
  if (!gameOver) {
    birdSpeedY = jumpForce;
  }
}

function generatePipes() {
  if (pipes.length === 0 || canvas.width - pipes[pipes.length - 1].x >= pipeInterval) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    let pipe = {
      x: canvas.width,
      y: 0,
      height: pipeHeight
    };
    pipes.push(pipe);
  }
}

function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed; // Adjusted pipe speed for slower gameplay

    ctx.fillStyle = '#4caf50';
    ctx.fillRect(pipes[i].x, pipes[i].y, 30, pipes[i].height);
    ctx.fillRect(pipes[i].x, pipes[i].height + pipeGap, 30, canvas.height - pipes[i].height - pipeGap);

    if (pipes[i].x + 30 < 0) {
      pipes.splice(i, 1);
      score++;
      updateBestScore();
    }
  }
}

function checkCollisions() {
  if (birdY + 20 > canvas.height || birdY < 0) {
    gameOver = true;
  }

  for (let pipe of pipes) {
    if (birdX + 20 > pipe.x && birdX < pipe.x + 30) {
      if (birdY < pipe.height || birdY + 20 > pipe.height + pipeGap) {
        gameOver = true;
      }
    }
  }
}

function displayScore() {
  ctx.fillStyle = '#000';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    updateBestScoreDisplay();
  }
}

function updateBestScoreDisplay() {
  bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
}

function endGame() {
  ctx.fillStyle = '#000';
  ctx.font = '36px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function showStartButton() {
  startButton.style.display = 'block';
}

function hideStartButton() {
  startButton.style.display = 'none';
}

function showRestartButton() {
  restartButton.style.display = 'block';
}

function disableButtons() {
  startButton.disabled = true;
  restartButton.disabled = true;
}

function enableButtons() {
  startButton.disabled = false;
  restartButton.disabled = false;
}

// Responsive canvas size for different screen sizes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth; // Set canvas width to window width
  canvas.height = window.innerHeight; // Set canvas height to window height
  if (!gameOver) {
    birdY = canvas.height / 2; // Recenter the bird on screen resize
  }
});
