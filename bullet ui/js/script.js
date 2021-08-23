const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

let dataCount = 0;
let resCount  = 0;
let reqCount  = 0;
class Color {
    constructor() {
        this.background = '#393C43'; // 배경 색

        this.normal   = '#4D8BD5'; // 정상 색
        this.warning  = '#B8A605'; // 경고 색
        this.critical = '#B40E0A'; // 심각 색

        this.basicFont = '#C6C9CD'; // 기본 폰트 색

        this.basicLine = '#C6C9CD'; // 라인 색
    };
};

class TimeCondition {
    constructor(data) {
        this.normalCondition   = data.colorByRunTime >= 1 && data.colorByRunTime < 3;
        this.warningCondition  = data.colorByRunTime >= 3 && data.colorByRunTime <= 5;
        this.criticalCondition = data.colorByRunTime > 5  && data.colorByRunTime <= 10;
    };
};

const color = new Color();
const timeCondition = (data) => new TimeCondition(data);
class Size {
    constructor() {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        this.startRectX = 0;
        this.startRectY = 0;

        this.arcDiameter = 20;

        this.bulletPathY = 240;

        this.startY = 0;
        this.startX = 0;

        this.area = this.canvasW / 3; // left; mid; right 구역 당 width
        this.left = this.canvasW / 3;
        this.mid  = this.canvasW * ( 2 / 3 );

        this.leftEndX  = this.left - this.arcDiameter;
        this.startMidX = this.left + this.arcDiameter;
        this.endMidX   = this.mid - this.arcDiameter;

        this.startMidY = 120;
        this.endMidY   = this.canvasH - this.arcDiameter;

        this.startRightX = this.mid + this.arcDiameter

        // 글자 영역에 공통으로 필요한 조건
        this.countTitleGap = 35;

        // left 글자 영역에 필요한 위치 조건
        this.totalCountX = 30; 
        this.leftTotalFontY = 80;
        this.reqCountX = 130;
        this.leftReqFontY = 170;

        // mid 글자 영역에 필요한 위치 조건
        this.midFontY = 80;

        this.normalCountX   = 320;
        this.warningCountX  = 420;
        this.criticalCountX = 520;

        // right 글자 영역에 필요한 위치 조건
        this.resCountX = 690;
        this.rightResFontY = 170;
    };
};

class SetDatas extends Size{
    constructor(){
        super();
        const dataPerSec = 20; // 1 초 당 20 개
        const req = (dataPerSec / 5); // 0.2초에 한 번씩 요청이 발생 함(4개)

        this.datas     = [];
        this.dataPerReq = req; // 0.2초 마다 발생 할 요청에 생성 될 데이터 수

        // this.addDatas();
        reqCount = dataPerSec;
        setInterval(() => this.addDatas(), (1000 / 5)); // 지금 0.2 초당 4개 생성 됨
    };

    addDatas(){
        const speed = Number(Math.random().toFixed(1)) || 0.1; // 한 번에 생성되는 4개의 데이터가 모두 같은 속도 임 각각 속도 랜덤하게 할거면 반복문 안으로!
        
        for(let i = 0; i < this.dataPerReq; i++) {
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
            this.createBullet('#4D8BD5', data, 'left'); // blue

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

                dataCount = this.middleDatas;
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
        ctx.fillStyle = color;

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
        if(timeCondition(data).normalCondition) { // 1에서 3초
            this.createBullet(color.normal, data,  area); // blue

            bounceFn && bounceFn(data);
        }; 

        if(timeCondition(data).warningCondition) { // 3에서 5초
            this.createBullet(color.warning, data, area); // yellow

            bounceFn && bounceFn(data);
        };

        if(timeCondition(data).criticalCondition) { // 5에서 10초
            this.createBullet(color.critical, data, area); // red

            bounceFn && bounceFn(data);
        };
    };

    excuteRuntime() {
        if(!this.middleDatas.length) { return; };
        this.middleDatas.forEach(data => data.runTime--);

        const runTimeEndBullets = this.middleDatas.filter(data => 
            data.runTime <= 0
        );

        resCount = runTimeEndBullets.length;

        const longestRunTime = runTimeEndBullets.sort((a, b) => b.colorByRunTime - a.colorByRunTime)[0];

        if(longestRunTime) {
            const {colorByRunTime, runTime, mxSpeed} = longestRunTime;

            this.rightDatas.push({colorByRunTime, runTime, rx: this.startRightX, ry: this.bulletPathY, speed: Math.abs(mxSpeed)});
        };
         
        this.middleDatas = this.middleDatas.filter(data => data.runTime > 0);
        dataCount = this.middleDatas;
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
        ctx.fillStyle = color.background; // 배경 색
        ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
    
        ctx.beginPath();

        this.line();

        this.leftCount();
        this.midCount();
        this.rightCount();

        ctx.stroke();
    };

    line() {
        ctx.strokeStyle = color.basicLine;

        ctx.moveTo(this.left   , this.startMidY);
        ctx.lineTo(this.left   , this.canvasH);
        ctx.moveTo(this.mid    , this.startMidY);
        ctx.lineTo(this.mid    , this.canvasH);
        ctx.moveTo(this.startX , this.bulletPathY);
        ctx.lineTo(this.left   , this.bulletPathY);
        ctx.moveTo(this.mid    , this.bulletPathY);
        ctx.lineTo(this.canvasW, this.bulletPathY);
    };

    leftCount() {
        const totalCount = this.count().normal + this.count().warning + this.count().critical;

        ctx.font = '30px Arial';

        ctx.fillStyle = color.basicFont;
        ctx.fillText('현재 전체 건수', this.totalCountX + this.countTitleGap, this.leftTotalFontY);
        ctx.fillText(totalCount, this.totalCountX, this.leftTotalFontY);
        
        ctx.font = '25px Arial';

        ctx.fillText('요청/초', this.reqCountX, this.leftReqFontY);
        ctx.fillText(reqCount, this.reqCountX - this.countTitleGap, this.leftReqFontY)

    };

    midCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = color.basicFont;
        ctx.fillText('정상', this.normalCountX + this.countTitleGap, this.midFontY);
        ctx.fillText('경고', this.warningCountX + this.countTitleGap, this.midFontY);
        ctx.fillText('심각', this.criticalCountX + this.countTitleGap, this.midFontY);

        ctx.fillStyle = color.normal;
        ctx.fillText(this.count().normal, this.normalCountX, this.midFontY);
        
        ctx.fillStyle = color.warning;
        ctx.fillText(this.count().warning, this.warningCountX, this.midFontY);
   
        ctx.fillStyle = color.critical;
        ctx.fillText(this.count().critical, this.criticalCountX, this.midFontY);
    };

    rightCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = color.basicFont;
        ctx.fillText('응답/초', this.resCountX, this.rightResFontY);
        ctx.fillText(resCount, this.resCountX + (this.countTitleGap * 3), this.rightResFontY);
    };

    count() {
        const normal = (dataCount || []).filter(data => 
                timeCondition(data).normalCondition
            ).length;

        const warning = (dataCount || []).filter(data => 
                timeCondition(data).warningCondition
            ).length;
        
        const critical = (dataCount || []).filter(data => 
                timeCondition(data).criticalCondition
            ).length;
        
        return { normal, warning, critical };
    };
};

const animation  = new Animation();
const background = new Background();
setInterval(() => animation.excuteRuntime(), 1000);

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