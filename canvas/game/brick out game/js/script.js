const script = () => {
    const canvas = document.querySelector('.myCanvas');
    const ctx = canvas.getContext('2d');

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    const ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;

    const drawScore = () => {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Score:' + score, 8, 20);
    };

    const bricks = [];
    for(let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        };
    };

    const collisionDetection = () => {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if( x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;

                    if(score === brickRowCount * brickColumnCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    };
                };
            };
        };
    };

    const drawBricks = () => {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status === 1) {
                    const brickX = ( c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = ( r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStlye = '#0095DD';
                    ctx.fill();
                };
            };
        };
    };

    const keyDownHandler = e => {
        if(e.keyCode === 39) {
            rightPressed = true;
        } else if(e.keyCode === 37) {
            leftPressed = true;
        };
    };

    const keyUpHandler = e => {
        if(e.keyCode === 39) {
            rightPressed = false;
        } else if(e.keyCode === 37) {
            leftPressed = false;
        };
    };

    const mouseMoveHandler = e => {
        const relativeX = e.clientX - canvas.offsetLeft;

        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        };
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);

    const drawPaddle = () => {
        if(rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        };

        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
    };

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPaddle();
        collisionDetection();
        drawBricks();
        drawScore();

        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        };

        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height - ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert('GAME OVER');
                document.location.reload();
            }
        }

        if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        };

        x += dx;
        y += dy;
    };

    setInterval(draw, 100);
};

script();