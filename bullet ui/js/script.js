const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

class SetDatas{
    constructor(){
        this.datas = [];
        this.dataPerSec = 4; // 초당 몇 개 생성 할 지

        setInterval(() => this.addDatas(), 200); // 지금 0.2초당 4개 생성 됨
        this.addDatas();
    };

    addDatas(){
        const speed = Number(Math.random().toFixed(1)) || 0.1; // 한 번에 생성되는 4개의 데이터가 모두 같은 속도 임 각각 속도 랜덤하게 할거면 반복문 안으로!
        for(let i = 0; i < this.dataPerSec; i++) {
            const runTime = Math.ceil(Math.random() * 10);
            this.datas.push({
                colorByRunTime: runTime,
                runTime,
                speed: speed,
                x: 0,
                y: 120,

                mx: 320 + (Math.random() * 200),
                my: 20 + Math.random() * 150,
                mxSpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,
                mySpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,

                rx: 620,
                ry: 120
            });
        };
    };
};

const setDatas = new SetDatas();

class Animation extends SetDatas {
    constructor(){
        super();
        
        this.middleDatas = [];
        this.rightDatas = [];

        this.test = 620;
    };

    animationLeft() {
        for(let data of this.datas) {
            this.createBullet('blue', data, 'left');

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
    
        for(let data of this.middleDatas) {
            this.createBulletByRunTime(data, 'mid', bounce);
        };
    };

    createBullet(color, data, area) {
        ctx.beginPath();
        ctx.fillStyle= color;

        switch(area) {
            case 'left':
                ctx.arc(data.x += data.speed , data.y, 20, 0, Math.PI * 2);
                break;
            case 'mid':
                ctx.arc(data.mx += data.mxSpeed , data.my += data.mySpeed, 20, 0, Math.PI * 2);
                break;
            case 'right':
                ctx.arc(data.rx += data.speed, data.ry, 20, 0, Math.PI * 2);
                break;
            default:
                break;
        };

        ctx.fill();
    };

    createBulletByRunTime(data, area, bounceFn) {
        if(data.colorByRunTime >= 1 && data.colorByRunTime < 3){
            this.createBullet('blue', data,  area);

            bounceFn && bounceFn(data);
        };

        if(data.colorByRunTime >= 3 && data.colorByRunTime <= 5){
            this.createBullet('yellow', data, area);

            bounceFn && bounceFn(data);
        };

        if(data.colorByRunTime > 5 && data.runTime <= 10){
            this.createBullet('red', data, area);

            bounceFn && bounceFn(data);
        };
    };

    excuteRuntime() {
        if(!this.middleDatas.length) { return; };
        this.middleDatas.forEach(data => data.runTime--);

        const filter = this.middleDatas.filter(data => 
            data.runTime <= 0
        )
        const sortTop = filter.sort((a, b) => b.colorByRunTime - a.colorByRunTime)[0];
        sortTop && this.rightDatas.push(sortTop);

        this.middleDatas = this.middleDatas.filter(data => data.runTime > 0);
        
        
        // console.log(this.rightDatas)
        // console.log(this.middleDatas.map(a => a.runTime))
    };

    animationRight() {    
        for(let data of this.rightDatas) {
            this.createBulletByRunTime(data, 'right');
        };
    };

    render() {
        this.animationLeft();
        this.animationMiddle();
        this.animationRight();
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

setInterval(function(){ animation.excuteRuntime() }, 1000);

const init = () => {
    background();
    animation.render();
    requestAnimationFrame(init);
};

init();


// 테스트 영역
const canvas2 = document.querySelector('.myCanvas2');

const ctx2 = canvas2.getContext('2d');

let aa = 0;
let topss = 0;
const main = () => {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
    // const ty = snow.y += snow.size * 0.5;
    ctx2.beginPath();
    ctx2.fillStyle = 'red';
    ctx2.arc(topss++ , 120, 20, 0, Math.PI * 2);
    ctx2.fill()
    ctx2.closePath();
    // topss = topss++

    if(topss > 900){
        topss = 0;
    }
};

setInterval(main, 30)