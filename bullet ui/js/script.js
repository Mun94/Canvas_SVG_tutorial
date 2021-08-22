const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');
class Size {
    constructor(){
        this.canvasW = canvas.width,
        this.canvasH = canvas.height,

        this.startRectX = 0,
        this.startRectY = 0,

        this.arcDiameter = 20,

        this.bulletPathY = 240,

        this.startY = 0,
        this.startX = 0,

        this.area = this.canvasW / 3, // left, mid, right 구역 당 width
        this.left = this.canvasW / 3,
        this.mid  = this.canvasW * ( 2 / 3 ),

        this.leftEndX  = this.left - this.arcDiameter,
        this.startMidX = this.left + this.arcDiameter,
        this.endMidX   = this.mid - this.arcDiameter,

        this.startMidY = 120,
        this.endMidY   = this.canvasH - this.arcDiameter,

        this.startRightX = this.mid + this.arcDiameter
    };
};

class SetDatas extends Size{
    constructor(){
        super();

        this.datas = [];
        this.dataPerSec = 4; // 초당 몇 개 생성 할 지

        setInterval(() => this.addDatas(), 1000); // 지금 1초당 4개 생성 됨
    };

    addDatas(){
        const speed = Number(Math.random().toFixed(1)) || 0.1; // 한 번에 생성되는 4개의 데이터가 모두 같은 속도 임 각각 속도 랜덤하게 할거면 반복문 안으로!
        
        for(let i = 0; i < this.dataPerSec; i++) {
            const runTime = Math.ceil(Math.random() * 10); // 0.1 ~ 1초
            this.datas.push({
                colorByRunTime: runTime,
                runTime,

                speed,
                x: this.startX,
                y: this.bulletPathY,
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
    };

    animationLeft() {
        for(let data of this.datas) {
            this.createBullet('blue', data, 'left');

            const {colorByRunTime, runTime, speed} = data;

            if(data.x > this.leftEndX) {
                this.middleDatas.push({
                    colorByRunTime,
                    runTime,

                   mx: this.startMidX + (Math.random() * (this.area - this.arcDiameter - this.arcDiameter)),
                   my: this.startMidY + (Math.random() * (this.endMidY - this.startMidY)),
                   mxSpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,
                   mySpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,
                });

                this.datas = this.datas.filter(data => data.x < this.leftEndX); // 원의 지름 뺌
            };
        };
    };

    animationMiddle() {
        if(!this.middleDatas.length) { return; };

        function bounce(data) { // 일반 함수에 bind 안 사용하고 화살표 함수 사용해도 됨
            if(data.mx >= (this.mid - this.arcDiameter)) {
                data.mxSpeed = -data.mxSpeed;
            };
            
            if(data.mx <= this.startMidX) {
                data.mxSpeed = Math.abs(data.mxSpeed);
            };
    
            if(data.my >= this.endMidY) {
                data.mySpeed = -data.mySpeed
            };
            
            if(data.my <= (this.startMidY + this.arcDiameter)) {
                data.mySpeed = Math.abs(data.mySpeed);
            };
        }
    
        for(let data of this.middleDatas) {
            this.createBulletByRunTime(data, 'mid', bounce.bind(this));
        };
    };

    animationRight() {    
        for(let data of this.rightDatas) {
            this.createBulletByRunTime(data, 'right');
        };
    };

    createBullet(color, data, area) {
        ctx.beginPath();
        ctx.fillStyle= color;

        switch(area) {
            case 'left':
                ctx.arc(data.x += data.speed , data.y, this.arcDiameter, 0, Math.PI * 2);
                break;
            case 'mid':
                ctx.arc(data.mx += data.mxSpeed , data.my += data.mySpeed, this.arcDiameter, 0, Math.PI * 2);
                break;
            case 'right':
                ctx.arc(data.rx += data.speed, data.ry, this.arcDiameter, 0, Math.PI * 2);
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

        const runTimeEndBullets = this.middleDatas.filter(data => 
            data.runTime <= 0
        );
        const longestRunTime = runTimeEndBullets.sort((a, b) => b.colorByRunTime - a.colorByRunTime)[0];

        if(longestRunTime) {
            const {colorByRunTime, runTime, mxSpeed} = longestRunTime;

            this.rightDatas.push({colorByRunTime, runTime, rx: this.startRightX, ry: this.bulletPathY, speed: Math.abs(mxSpeed)});
        };
         
        this.middleDatas = this.middleDatas.filter(data => data.runTime > 0);
        
        // console.log(this.rightDatas)
        // console.log(this.middleDatas.map(a => a.runTime))
    };

    render() {
        this.animationLeft();
        this.animationMiddle();
        this.animationRight();
    };
};

class Background extends Size{
    constructor(){
        super();
    };

    render() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
    
        ctx.beginPath();
        ctx.moveTo(this.left   , this.startY);
        ctx.lineTo(this.left   , this.canvasH);
        ctx.moveTo(this.mid    , this.startY);
        ctx.lineTo(this.mid    , this.canvasH);
        ctx.moveTo(this.startX , this.bulletPathY);
        ctx.lineTo(this.canvasW, this.bulletPathY);
        ctx.stroke();
    };
};

const animation  = new Animation();
const background = new Background();
setInterval(function(){ animation.excuteRuntime() }, 1000);

const init = () => {
    background.render();
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