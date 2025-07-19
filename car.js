document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameSpeed = 2;
    let gameInterval;
    let obstacleInterval;
    let isGameOver = false;
    
    highScoreDisplay.textContent = highScore;
    
    // Car properties
    const car = document.createElement('div');
    car.classList.add('car');
    gameBoard.appendChild(car);
    
    let carLeft = 125;
    const carWidth = 50;
    const carHeight = 80;
    const roadWidth = 300;
    
    // Initialize car position
    car.style.left = carLeft + 'px';
    car.style.bottom = '20px';
    
    // Event listeners for buttons
    leftBtn.addEventListener('click', moveLeft);
    rightBtn.addEventListener('click', moveRight);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        }
    });
    
    function moveLeft() {
        if (carLeft > 0) {
            carLeft -= 25;
            car.style.left = carLeft + 'px';
        }
    }
    
    function moveRight() {
        if (carLeft < roadWidth - carWidth) {
            carLeft += 25;
            car.style.left = carLeft + 'px';
        }
    }
    
    function startGame() {
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = score;
        
        // Clear any existing obstacles
        document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
        
        // Move obstacles
        gameInterval = setInterval(moveObstacles, 20);
        
        // Create new obstacles
        obstacleInterval = setInterval(createObstacle, 2000);
    }
    
    function createObstacle() {
        if (isGameOver) return;
        
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        
        // Random position
        const randomLeft = Math.floor(Math.random() * (roadWidth - 50));
        obstacle.style.left = randomLeft + 'px';
        obstacle.style.top = '-50px';
        
        gameBoard.appendChild(obstacle);
    }
    
    function moveObstacles() {
        const obstacles = document.querySelectorAll('.obstacle');
        
        obstacles.forEach(obstacle => {
            const obstacleTop = parseInt(obstacle.style.top);
            const newTop = obstacleTop + gameSpeed;
            obstacle.style.top = newTop + 'px';
            
            // Check if obstacle is out of bounds
            if (obstacleTop > 500) {
                obstacle.remove();
                increaseScore();
            }
            
            // Check for collision
            if (
                obstacleTop + 50 > 500 - carHeight - 20 && 
                obstacleTop < 500 - 20 &&
                parseInt(obstacle.style.left) < carLeft + carWidth &&
                parseInt(obstacle.style.left) + 50 > carLeft
            ) {
                gameOver();
            }
        });
    }
    
    function increaseScore() {
        score++;
        scoreDisplay.textContent = score;
        
        // Increase difficulty
        if (score % 5 === 0) {
            gameSpeed += 0.5;
        }
    }
    
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
    
    // Button event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});