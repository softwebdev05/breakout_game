const canvas = document.getElementById('breakout');
const ctx = canvas.getContext('2d');

const paddle = {
    height: 23,
    width: 114,
    speed: 15,
    x: 0,
    y: 0
}
const ball = {
    x: 0,
    y: 0,
    speed: 9,
    radius: 10,
    dx: 0,
    dy: 0
}
const brick = {
    rows: 5,
    cols: 8,
    width: 90,
    height: 30,
    margin: 10,
}

const ballImage = new Image();
ballImage.src = 'ball.png';
ballImage.width = 2* ball.radius;
ballImage.height = 2*  ball.radius;

const paddleImage = new Image();
paddleImage.src = 'paddle.png';
paddleImage.width = paddle.width;
paddleImage.height = paddle.height;

const background = new Image();
background.src = 'bg-space.png';
background.width = canvas.width;
background.height = canvas.height;

let bricks = [];

let requestId;
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function play() {   
    init(); 
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    animate();
}

function init() {
    ball.x = canvas.width/2;
    ball.y = canvas.height-30;
    ball.dx = ball.speed;
    ball.dy = -ball.speed;
    paddle.x = canvas.width / 2;
    paddle.y = canvas.height - paddle.height;
    initBricks();
}

function initBricks() {
    const wallMargin = 5;
    const colors = ['red', 'blue', 'yellow', 'green', 'orange'];
    for(let c = 0; c < brick.cols; c++) {
        bricks[c] = [];
        for(let r = 0; r < brick.rows; r++) {
            let x = c * (brick.width + brick.margin) + wallMargin;
            let y = r * (brick.height + brick.margin) + wallMargin;
            bricks[c][r] = { x, y, color: colors[r] };
        }
    }
}

function animate() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    detectCollission();
    detectBrickCollision();
    update();
    if (ball.y - ball.radius > canvas.height) {
        gameOver();
        return;
    }

    requestId = requestAnimationFrame(animate);
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if(rightPressed) {
        paddle.x += paddle.speed;
        if (paddle.x + paddle.width > canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    }
    else if(leftPressed) {
        paddle.x -= paddle.speed;
        if (paddle.x < 0){
            paddle.x = 0;
        }
    }
}


function drawBall() {
    ctx.drawImage(background, 0, 0, background.width, background.height);
    ctx.drawImage(ballImage, ball.x, ball.y, 2*ball.radius, 2*ball.radius);
    ctx.fill();
    /*ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.closePath();*/
}

function drawPaddle() {
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
    /*ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "red";
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.closePath();
    ctx.closePath();*/
}

function drawBricks() {
    for (let row = 0; row < brick.rows; row++) {
        for(let col = 0; col < brick.cols; col++) {       
            let b = bricks[col][row];
            if (b) {            
                ctx.beginPath();
                ctx.fillStyle = b.color;
                ctx.rect(b.x, b.y, brick.width, brick.height);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

function detectCollission() { 
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Paddle
    if (ball.y + ball.radius > canvas.height - paddle.height && ball.y + ball.radius < canvas.height) {
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        }
    }
}

function detectBrickCollision() {
    for(let c=0; c<brick.cols; c++) {
        for(let r=0; r<brick.rows; r++) {
            let b = bricks[c][r];

            if(b && ball.x > b.x && ball.x < b.x+brick.width && ball.y > b.y && ball.y < b.y+brick.height) {
                ball.dy = -ball.dy;
                bricks[c][r] = null;
            }
        }
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function gameOver() {
    cancelAnimationFrame(requestId);
    console.log('GAME OVER');
}
}
