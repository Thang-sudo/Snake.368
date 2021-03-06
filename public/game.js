// import {setGameSpeed} from './menu.js';
let lastTime = 0;
// speed variable: how many times does the next move per second
let growRate = 1;
// let speed = SPEED;
// Use window.requestAnimationFrame to handle animations
// Update snake position continously
// With constant SPEED the main function not going to update the animation until it meets a threshold
let snake = [{row: 11, col: 13}];
let apple = {row: 2, col: 13};
let speedUp = {row: 4, col: 5};
let growingPotion = {row: 6, col: 8};
let direction = {row: -1, col: 0};
let speed = 5;
let score = 0;
let secondsFromLasTime = 0;
const gameBoard = document.getElementById('game-board');
const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
let stopped = true;

var themeMusic;
var eatingSoundEffect;
var gameOverSoundEffect;

document.addEventListener('keyup', e =>{
    if(e.code === 'Space'){
        stopped = !stopped;
        if(!stopped){
            startGame();
        }
    }
})

easyButton.addEventListener('click', () => {
    speed = 3; 
    stopped = false;
    easyButton.disabled = true;
    mediumButton.disabled = true;
    hardButton.disabled = true;
    setTimeout(() => startGame(), 2000); 
    
});

mediumButton.addEventListener('click', () => {
    speed = 5; 
    stopped = false;
    easyButton.disabled = true;
    mediumButton.disabled = true;
    hardButton.disabled = true;  
    setTimeout(() => startGame(), 2000);
});

hardButton.addEventListener('click', () => {
    speed = 10; 
    stopped = false; 
    easyButton.disabled = true;
    mediumButton.disabled = true;
    hardButton.disabled = true; 
    setTimeout(() => startGame(), 2000);
});

// Control sound effects 
function sound(src, autoReplay) {
    console.log(autoReplay)
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    if(autoReplay === true){
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("loop", true);
    }
    else{
        this.sound.setAttribute("controls", "none");
    }
    
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }

    this.setVolume = function(volume){
        this.sound.volume = volume;
    }
    
  }

function startGame(){
    themeMusic = new sound("./audio/theme.mp3", true);
    eatingSoundEffect = new sound("./audio/score.mp3", false);
    gameOverSoundEffect = new sound("./audio/over.mp3", false);
    themeMusic.setVolume(0.4);
    themeMusic.play();
    function main(current){
        if(!stopped){
            window.requestAnimationFrame(main);
            // Calculate the seconds after the last render
            secondsFromLasTime = (current - lastTime) / 1000;
            // If the time from the last render and the current render is lower than the threshold, we return at this step
            if(secondsFromLasTime < 1/speed) return;
            lastTime = current;
            updateGame();
            renderGame(gameBoard);
        }
    }
    window.requestAnimationFrame(main)
}


// Update the game logic after each move
function updateGame(){
    if(checkGameOver()){
        stopped = true;
        themeMusic.stop();
        gameOverSoundEffect.play();
        if (confirm('Game Over. Press ok to restart.')) {
            location.reload();
            snake = [{row: 11, col: 11}];
          }
        else{
            window.location = '/'
        }
          
    }

    for (let i = snake.length - 1; i >= 1; i--) {
        snake[i] = { ...snake[i - 1] };
      }
      snake[0].row += direction.row;
      snake[0].col += direction.col;

    if(isOnSnake(apple)){
        eatingSoundEffect.play();
        score += speed;
        increaseSnakeLength();
        apple = createApple();
    }

    if(isOnSnake(speedUp)){
        eatingSoundEffect.play();
        speedUpSnake();
        speedUp = createSpeedUpPotion();
    }

    if(isOnSnake(growingPotion)){
        eatingSoundEffect.play();
        growSnake();
        growingPotion = createGrowingPotion();
    }
    
}

// Print the current state of board 
function renderGame(board){
    gameBoard.innerHTML = "";
    document.getElementById('score').innerHTML = "Score: " + score;
    snake.map(square =>{
        let element = document.createElement('div');
        element.style.gridRowStart = square.row;
        element.style.gridColumnStart = square.col;
        element.classList.add('snake');
        gameBoard.appendChild(element);
    })
    // Render apple
    let appleElement = document.createElement('div');
    appleElement.style.gridRowStart = apple.row;
    appleElement.style.gridColumnStart = apple.col;
    appleElement.classList.add('apple');
    gameBoard.appendChild(appleElement);

    // Render speed-up potion
    let speedUpElement = document.createElement('div');
    speedUpElement.style.gridRowStart = speedUp.row;
    speedUpElement.style.gridColumnStart = speedUp.col;
    speedUpElement.classList.add('speedUp');
    gameBoard.appendChild(speedUpElement);

    // Render growing potion
    let growingElement = document.createElement('div');
    growingElement.style.gridRowStart = growingPotion.row;
    growingElement.style.gridColumnStart = growingPotion.col;
    growingElement.classList.add('growing');
    gameBoard.appendChild(growingElement);
}

// Update snake direction based on keydown event
document.addEventListener('keydown', (e) => {
    // stopped = false;
    switch(e.key){
        case 'ArrowUp':
            if(direction.row === -1 || direction.row === 1) break;
            direction.row = -1;
            direction.col = 0;
            break;
        case 'ArrowRight':
            // stopped = false;
            if(direction.col === -1 || direction.col === 1) break;
            direction.row = 0;
            direction.col = 1;
            break;
        case 'ArrowDown':
            // stopped = false;
            if(direction.row === -1 || direction.row === 1) break;
            direction.row = 1;
            direction.col = 0;
            break;
        case 'ArrowLeft':
            // stopped = false;
            if(direction.col === -1 || direction.col === 1) break;
            direction.row = 0;
            direction.col = -1;
            break;
    }
});

function createApple(){
    let appleRow = 0;
    let appleCol = 0;
    let newApple = null;
    while(newApple === null || isOnSnake(newApple) || (appleRow === speedUp.row && appleCol === speedUp.col) || (appleRow === growingPotion.row && appleCol === growingPotion.col)){
        appleRow = Math.floor(Math.random() * 21 + 1);
        appleCol = Math.floor(Math.random() * 21 + 1);
        newApple = {row: appleRow, col: appleCol}
    };
    return newApple;
}

function createSpeedUpPotion(){
    let SpeedUpPotionRow = 0;
    let SpeedUpPotionCol = 0;
    let newSpeedUpPotion = null;
    while(newSpeedUpPotion === null || isOnSnake(newSpeedUpPotion) || (SpeedUpPotionRow === apple.row && SpeedUpPotionCol === apple.col) || (SpeedUpPotionRow === growingPotion.row && SpeedUpPotionCol === growingPotion.col)){
        SpeedUpPotionRow = Math.floor(Math.random() * 21 + 1);
        SpeedUpPotionCol = Math.floor(Math.random() * 21 + 1);
        newSpeedUpPotion = {row: SpeedUpPotionRow, col: SpeedUpPotionCol}
    };
    return newSpeedUpPotion;
}

function createGrowingPotion(){
    let GrowingPotionRow = 0;
    let GrowingPotionCol = 0;
    let newGrowingPotion = null;
    while(newGrowingPotion === null || isOnSnake(newGrowingPotion) || (GrowingPotionRow === speedUp.row && GrowingPotionCol === speedUp.col) || (GrowingPotionRow === apple.row && GrowingPotionCol === apple.col)){
        GrowingPotionRow = Math.floor(Math.random() * 21 + 1);
        GrowingPotionCol = Math.floor(Math.random() * 21 + 1);
        newGrowingPotion = {row: GrowingPotionRow, col: GrowingPotionCol}
    };
    return newGrowingPotion;
}

function isOnSnake(item){
    return(snake.some(square => {
        return (square.row === item.row && square.col === item.col)
    }));
}

function increaseSnakeLength(){
    let snakeTail = {...snake[length - 1]};
    for(let i = 0; i < growRate; i++){
        snake.push(snakeTail);
    }
}

function speedUpSnake(){
    speed = speed * 2;
    setTimeout(() =>{speed = speed / 2}, 2000);
}

function growSnake(){
    score = score * 2;
    let snakeTail = {...snake[length - 1]};
    for(let i = 0; i < 5; i++){
        snake.push(snakeTail);
    }
   
}

function headIsOnBody(){
    for(let i = 1; i < snake.length; i++){
        if(snake[i].row === snake[0].row && snake[i].col === snake[0].col){
            return true;
        }
    }
    return false;
}

function isOffBorder(){
    return (snake[0].row > 25 || snake[0].row < 1 || snake[0].col > 25 || snake[0].col < 1);
}

function checkGameOver(){
    return (isOffBorder() || headIsOnBody());
}