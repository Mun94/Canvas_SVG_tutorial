const canvas = document.querySelector('.myCanvas');
const livesDom = document.getElementById('lives');
const scoreDom = document.getElementById('score');
const gameOverDom = document.getElementById('game-over');
const restartDom = document.getElementById('restart');

const ctx = canvas.getContext('2d');

const fighter = {};
fighter.x = 50;
fighter.y = canvas.height / 2;
fighter.speed = 5;

const keysDown = {};

const asteroid = {};
let speed = 0;
asteroid.x = canvas.width;
asteroid.y = Math.floor(Math.random() * 350);
let randScale;
let ang = 0;
const arrScale = [0.4, 0.6, 0.8, 1];

const hitexplosion = {};
let spriteCount = 1;

const bgImage = new Image();
bgImage.src = 'images/space.png';
const fighterImage = new Image();
fighterImage.src = 'images/fighter.png';
const laserImage = new Image();
laserImage.src = 'images/laser.png';
const asteroidImage = new Image();
asteroidImage.src = 'images/asteroid.png';
const explodeImage = new Image();
explodeImage.src = 'images/explode.png';

const lastUpdateTime = 0;
let acDelta = 0;
const msPerFrame = 1000;

let bool_bg = false;
let bool_fighter = false;
let bool_laser = false;
let bool_asteroid = false;
let bool_explode = false;
let bool_hitexplosion = false;
let bool_fighterexplosion = false;

const lasers = [];
const laserTotal = 10;

let score = 0;
let lives = 2;

let isGameOver = false;

bgImage.onload = () => {
    bool_bg = true;
};

fighterImage.onload = () => {
    bool_fighter = true;
};

laserImage.onload = () => {
    bool_laser = true;
};

asteroidImage.onload = () => {
    bool_asteroid = true;
};

explodeImage.onload = () => {
    bool_explode = true;
};

function Background() {
    this.x = 0;
    this.y = 0;

    this.render = function() {
        if(this.x <= -600) {
            this.x = 0;
        };

        ctx.drawImage(bgImage, this.x--, 0);
    };
};
const background = new Background();

const drawLaser = () => {
    if(lasers.length) {
        for(let laser of lasers) {
            ctx.drawImage(laserImage, laser[0], laser[1]);
        };
    };
};

const moveLaser = () => {
    for(let laser of lasers) {
        if(laser[0] > 0) {
            laser[0] += 20;
        };

        if(laser[0] > 600) {
            lasers.shift();
        };
    };
};

const shuffle = arr => {
    const rand = Math.floor((Math.random() * arr.length));
    return arr[rand];
};

const reset = () => {
    speed = Math.floor(Math.random() * 5) + 5;
    asteroid.x = canvas.width;
    asteroid.y = Math.floor(Math.random() * 350);

    if(asteroid.y < 40) {
        asteroid.y = 40;
    };

    if(asteroid.y > 360) {
        asteroid.y = 360;
    };

    randScale = shuffle(arrScale);
};

const moveAstroid = () => {
    const w = asteroidImage.width * randScale;
    const h = asteroidImage.height * randScale;
    const coordX = (asteroidImage.width / 2) * randScale;
    const coordY = (asteroidImage.height / 2) * randScale;

    ctx.save();

    ctx.translate(asteroid.x + coordX, asteroid.y + coordY);
    ctx.rotate(Math.PI / 180 * (ang += 5));
    ctx.translate(-asteroid.x - coordX, -asteroid.y - coordY);
    ctx.drawImage(asteroidImage, asteroid.x -= speed, asteroid.y, w, h);

    ctx.restore();

    if(asteroid.x < -100) {
        reset();
    };
};


const drawExplode = () => {
    ctx.drawImage(explodeImage, 
        spriteCount * 39 , 0, 39, 40,
        hitexplosion.x, hitexplosion.y, 39 * (1 + randScale), 40 * (1 + randScale)
    );

    spriteCount++;

    if(spriteCount > 13) {
        spriteCount = 1;
        bool_hitexplosion = false;
    };
};

const resetFigher = () => {
    fighter.x = 0;
    fighter.y = canvas.height / 2;
};

const gameOver = () => {
    isGameOver = true;
    bool_explode = false;

    gameOverDom.style.display = 'block';
};

const restart = () => {
    isGameOver = false;
    bool_explode = true;

    gameOverDom.style.display = 'none';

    lives = 2;
    score = 0;

    livesDom.innerText = lives;
    scoreDom.innerText = score;
};

const detectCollision = () => {
    const aw = asteroidImage.width * randScale;
    const ah = asteroidImage.height * randScale;
    const fw = fighterImage.width;
    const fh = fighterImage.height;

    if((fighter.x > asteroid.x && fighter.x < asteroid.x + aw
        && fighter.y > asteroid.y && fighter.y < asteroid.y + ah)
        || (fighter.x + fw > asteroid.x && fighter.x + fw < asteroid.x + aw
            && fighter.y > asteroid.y && fighter.y < asteroid.y + ah)
        || (fighter.x > asteroid.x && fighter.x < asteroid.x + aw
            && fighter.y + fh > asteroid.y && fighter.y + fh < asteroid.y + ah)
        || (fighter.x + fw > asteroid.x && fighter.x + fw < asteroid.x + aw
            && fighter.y + fh > asteroid.y && fighter.y + fh < asteroid.y + ah)) {
        bool_hitexplosion = true;
        hitexplosion.x = asteroid.x;
        hitexplosion.y = asteroid.y;
        reset();
        resetFigher();

        if(lives <= 0) {
            lives = 0;
            gameOver();
        } else {
            --lives;
        };
  
        livesDom.innerText = lives;
    };

    if(lasers.length) {
        for(let laser of lasers) {
            if(laser[0] > asteroid.x && laser[0] < asteroid.x + aw &&
               laser[1] > asteroid.y && laser[1] < asteroid.y +ah 
            ) {
                hitexplosion.x = laser[0];
                hitexplosion.y = laser[1];
                bool_hitexplosion = true;
                
                lasers.shift();
                reset();

                scoreDom.innerText = Number(scoreDom.textContent) + 100;
            };
        };
    };
};

const render = () => {
    const delta = Date.now() - lastUpdateTime;

    if(acDelta > msPerFrame) {
        acDelta = 0;

        if(bool_bg) {
            background.render();
        };

        if(bool_fighter) {
            ctx.drawImage(fighterImage, fighter.x, fighter.y);
        };

        if(bool_laser) {
            drawLaser();
            moveLaser();
        };

        if(bool_fighter) {
            if(bool_fighterexplosion) {
                ctx.drawImage(fighterImage, fighter.x += 1, fighter.y);
                
                if(fighter.x >= 50) {
                    bool_fighterexplosion = false;
                };
            }else {
                ctx.drawImage(fighterImage, fighter.x, fighter.y);
            };
        }

        if(bool_asteroid) {
            moveAstroid();
        };

        if(bool_explode && bool_hitexplosion) {
            drawExplode();
        }
    }else {
        acDelta += delta;
    };
};

const update = () => {
    if('W' in keysDown) { fighter.y -= fighter.speed };
    if('S' in keysDown) { fighter.y += fighter.speed };
    if('A' in keysDown) { fighter.x -= fighter.speed };
    if('D' in keysDown) { fighter.x += fighter.speed };

    if(fighter.x <= 0) {
        fighter.x = 0;
    };
    if(fighter.x >= canvas.width - 60) {
        fighter.x = canvas.width - 60;
    };

    if(fighter.y <= 0){
        fighter.y = 0;
    };
    if(fighter.y >= canvas.height - 30) {
        fighter.y = canvas.height - 30;
    };

    detectCollision();
};

document.addEventListener('keydown', e => {
    keysDown[String.fromCharCode(e.keyCode)] = true;

    if(e.keyCode === 32 && lasers.length <= laserTotal) {
        lasers.push([
            fighter.x + 50, fighter.y + 10
        ]);
    };
});

document.addEventListener('keyup', e => {
    delete keysDown[String.fromCharCode(e.keyCode)];
});

restartDom.addEventListener('click', () => {
    restart()
})

const main = () => {
    update();
    requestAnimationFrame(main);

    if(!isGameOver) {
        render();
    }
};

livesDom.innerText = lives;
reset();
main();
