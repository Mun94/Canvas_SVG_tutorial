const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

class SetDatas{
    constructor(){
        this.datas = [];
        this.dataPerSec = 20;

        this.addDatas();
    };

    addDatas(){
        for(let i = 0; i < this.dataPerSec; i++) {
            const speed = Number(Math.random().toFixed(1)) || 0.1;

            this.datas.push({
                runTime: Math.ceil(Math.random() * 10),
                speed: speed,
                x: 0,
                y: 120,

                mx: 320 + (Math.random() * 200),
                my: 20 + Math.random() * 150,
                mxSpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,
                mySpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed
            });
        };
    };
};

const setDatas = new SetDatas();

class Animation extends SetDatas {
    constructor(){
        super();
        
        this.middleDatas = [];
    };

    animationLeft() {
        for(let data of this.datas) {
            ctx.beginPath();
            ctx.fillStyle = 'blue';
            ctx.arc(data.x += data.speed , data.y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            if(data.x > (300 - 20)) {
                this.middleDatas.push(data);
                this.datas = this.datas.filter(data => data.x < (300 - 20)); // 원의 지름 뺌
            };
        };
    };

    animationMiddle() {
        if(!this.middleDatas.length) { return; };

        const bounce = data => {
            if(data.mx >= (600 - 20)) {
                data.mxSpeed = -data.mxSpeed;
            };
            if(data.mx <= (300 + 20)){
                data.mxSpeed = Math.abs(data.mxSpeed);
            };
    
            if(data.my >= (200 - 20)) {
                data.mySpeed = -data.mySpeed
            };
            
            if(data.my <= (0 + 20)) {
                data.mySpeed = Math.abs(data.mySpeed);
            };
        };
    
        const createMiddleBullet = (color, data) => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(data.mx += data.mxSpeed , data.my += data.mySpeed, 20, 0, Math.PI * 2);
            ctx.fill();
        };
    
        for(let data of this.middleDatas) {
            if(data.runTime >= 1 && data.runTime < 3){
                createMiddleBullet('blue', data);

                bounce(data);
            };

            if(data.runTime >= 3 && data.runTime <= 5){
                createMiddleBullet('yellow', data);

                bounce(data);
            };

            if(data.runTime > 5 && data.runTime <= 10){
                createMiddleBullet('red', data);

                bounce(data);
            };
        };
    };

    render(){
        this.animationLeft();
        this.animationMiddle();
    };
};

const background = () => {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, 900, 200);

    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 200);
    ctx.moveTo(600, 0);
    ctx.lineTo(600, 200);
    ctx.moveTo(0, 120);
    ctx.lineTo(900, 120);
    ctx.stroke();
};

const animation = new Animation();

const init = () => {
    background();

    animation.render();
    requestAnimationFrame(init);
};

init();
