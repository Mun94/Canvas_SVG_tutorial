const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

const fighter = {};
fighter.x = 50;
fighter.y = canvas.height / 2;
fighter.speed = 5;

const keysDown = {};

const bgImage = new Image();
bgImage.src = 'images/space.png';
const fighterImage = new Image();
fighterImage.src = 'images/fighter.png';

const lastUpdateTime = 0;
let acDelta = 0;
const msPerFrame = 1000;

let bool_bg = false;
let bool_fighter = false;

bgImage.onload = () => {
    bool_bg = true;
};

fighterImage.onload = () => {
    bool_fighter = true;
};

const render = () => {
    const delta = Date.now() - lastUpdateTime;

    if(acDelta > msPerFrame) {
        acDelta = 0;

        if(bool_bg) {
            ctx.drawImage(bgImage, 0, 0);
        };

        if(bool_fighter) {
            ctx.drawImage(fighterImage, fighter.x, fighter.y);
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
