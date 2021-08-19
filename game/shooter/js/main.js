const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

const fighter = {};
fighter.x = 50;
fighter.y = canvas.height / 2;
fighter.speed = 5;

const keysDown = {};

const asteroid = {};

const bgImage = new Image();
bgImage.src = 'images/space.png';
const fighterImage = new Image();
fighterImage.src = 'images/fighter.png';
const laserImage = new Image();
laserImage.src = 'images/laser.png';
const asteroidImage = new Image();
asteroidImage.src = 'images/asteroid.png';

const lastUpdateTime = 0;
let acDelta = 0;
const msPerFrame = 1000;

let bool_bg = false;
let bool_fighter = false;
let bool_laser = false;
let bool_asteroid = false;

const lasers = [];
const laserTotal = 10;

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

        if(bool_asteroid) {
            ctx.drawImage(asteroidImage, 500, 200);
        };
    }else {
        acDelta += delta;
    }
}

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

const main = () => {
    update();
    render();
    requestAnimationFrame(main);
};

main();
