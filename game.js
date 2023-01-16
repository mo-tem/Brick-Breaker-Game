var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 480;
canvas.height = 320;

// Set ball properties
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballRadius = 10;
var ballColor = "red";
var ballSpeedX = 2;
var ballSpeedY = -2;

// Set paddle properties
var paddleX = canvas.width / 2;
var paddleY = canvas.height - 20;
var paddleWidth = 75;
var paddleHeight = 20;
var paddleColor = "green";
var paddleSpeed = 3;
var rightPaddle = false;
var leftPaddle = false;


// Set brick properties
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

var score = 0;

// variable to check if game is paused or not
let isPaused = false;

var level = 1;

var brickRowCount = 3;
var ballSize = 15;
var paddleWidth = 75;

var gameOver = false;


// Add event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Add event listener for pause and resume
document.addEventListener("keydown", pauseAndResume, false);

function changeLevel() {
    level = document.getElementById("level").value;
    ballSpeedX = ballSpeedX + level*0.5;
    ballSpeedY = ballSpeedY + level*0.5;
    brickRowCount = brickRowCount + 1;
    ballSize = ballSize - 1;
    paddleWidth = paddleWidth - 5;
    switch (level) {
        case "1":
            document.getElementById("game-canvas").style.background = "white";
            break;
        case "2":
            document.getElementById("game-canvas").style.background = "green";
            break;
        case "3":
            document.getElementById("game-canvas").style.background = "blue";
            break;
        case "4":
            document.getElementById("game-canvas").style.background = "orange";
            break;
        case "5":
            document.getElementById("game-canvas").style.background = "purple";
            break;
        case "6":
            document.getElementById("game-canvas").style.background = "pink";
            break;
        case "7":
            document.getElementById("game-canvas").style.background = "brown";
            break;
        case "8":
            document.getElementById("game-canvas").style.background = "black";
            break;
        case "9":
            document.getElementById("game-canvas").style.background = "gray";
            break;
        case "10":
            document.getElementById("game-canvas").style.background = "yellow";
            break;
    }
    drawBricks();
    drawPaddle();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPaddle = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPaddle = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPaddle = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPaddle = false;
    }
}

function pauseAndResume(e) {
    if (e.key === " ") {
        if (!isPaused) {
            cancelAnimationFrame(draw);
            isPaused = true;
        } else {
            requestAnimationFrame(draw);
            isPaused = false;
        }
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            if (!gameOver) {
                alert("GAME OVER");
                gameOver = true;
            }
            document.location.reload();
        }
    }

    if (rightPaddle) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPaddle) {
        paddleX -= paddleSpeed;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    requestAnimationFrame(draw);
}

// Initialize the game
drawBricks();
drawPaddle();
drawBall();
requestAnimationFrame(draw);