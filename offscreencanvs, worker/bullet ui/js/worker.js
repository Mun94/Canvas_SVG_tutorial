const canvas = document.querySelector('.background');
const ctx = canvas.getContext('2d');
const countCanvas = document.querySelector('.count');
const countCtx = countCanvas.getContext('2d');

let global = {
    reqCount: 0,
    dataCount: [],
    resCount: 0,

    excutePerSec : 60 // default 값
};

const colorData = {
    background : '#303437', // 배경 색

    nor        : '#4D8BD5', // 정상 색
    war        : '#B8A605', // 경고 색
    cri        : '#B40E0A', // 심각 색
    gradation  : 'rgba(38, 36, 28, 0.5)',//'#26241C' // 그라데이션 색

    basicFont  : '#C6C9CD', // 기본 폰트 색

    basicLine  : '#C6C9CD', // 라인 색
};

const timeCondition = data => {
    return {
        nor: data.colorByRuntime >= 1 && data.colorByRuntime <= 3,
        war: data.colorByRuntime > 3 && data.colorByRuntime <= 5,
        cri: data.colorByRuntime > 5  && data.colorByRuntime <= 10
    };
};

class BackgroundPosition {
    constructor() {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        this.bulletPathY = 240;

        this.reqX = this.canvasW / 3;
        this.resX = this.canvasW * (2 / 3);

        this.startX = 0;
        this.startY = 120;

        this.startRectX    = 0;
        this.startRectY    = 0;

        this.lineTick      = 1;

        // 글자 영역에 공통으로 필요한 조건
        this.countTitleGap = 60;

        // req 글자 위치
        this.totalCountX   = 70; 
        this.totalFontY    = 80;
        this.reqCountX     = 130;
        this.reqFontY      = 170;

        // excu 글자 위치
        this.excuFontY     = 80;
        this.norWarCriGap  = 150;

        this.norCountX     = (this.canvasW / 3) + 20;
        this.warCountX     = this.norCountX + this.norWarCriGap;
        this.criCountX     = this.warCountX + this.norWarCriGap;

        // res 글자 위치
        this.resCountX     = this.canvasW * ( 3 / 4 );
        this.resFontY      = 170;
    };
};

class Background extends BackgroundPosition {
    constructor() {
        super();
    };

    render() {
        this.background();

        ctx.beginPath();
        this.line();
        ctx.stroke();
    };

    renderCount() {
        countCtx.beginPath();
        this.reqCount();
        this.excuCount();
        this.resCount();
        countCtx.stroke();
    };

    background() {
        ctx.fillStyle = colorData.background;
        ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
    };  

    line() {
        ctx.lineWidth = this.lineTick;
        ctx.strokeStyle = colorData.basicLine;
        // req 경계
        ctx.moveTo(this.reqX, this.startY);
        ctx.lineTo(this.reqX, this.canvasH);
        // req 총알 길
        ctx.moveTo(this.startX, this.bulletPathY);
        ctx.lineTo(this.reqX, this.bulletPathY);
        // res 경계
        ctx.moveTo(this.resX, this.startY);
        ctx.lineTo(this.resX, this.canvasH);
        // res 총알 길
        ctx.moveTo(this.resX, this.bulletPathY);
        ctx.lineTo(this.canvasW, this.bulletPathY);
    };

    reqCount() {
        const { totalCount } = this.count();

        countCtx.font = '30px Arial';

        countCtx.fillStyle = colorData.basicFont;
        countCtx.fillText('현재 전체 건수', this.totalCountX + this.countTitleGap + 13, this.totalFontY);

        countCtx.font = '45px Arial';

        countCtx.fillText(totalCount, this.totalCountX, this.totalFontY);
        
        countCtx.font = '25px Arial';

        countCtx.fillText('요청/초', this.reqCountX, this.reqFontY);
        countCtx.fillText(global.reqCount, this.reqCountX - this.countTitleGap, this.reqFontY);
    };

    excuCount() {
        countCtx.font = '25px Arial';

        countCtx.fillStyle = colorData.basicFont;
        countCtx.fillText('정상', this.norCountX + this.countTitleGap, this.excuFontY);
        countCtx.fillText('경고', this.warCountX + this.countTitleGap, this.excuFontY);
        countCtx.fillText('심각', this.criCountX + this.countTitleGap, this.excuFontY);

        countCtx.font = 'bold 35px Arial';

        countCtx.fillStyle = colorData.nor;
        countCtx.fillText(this.count().nor, this.norCountX, this.excuFontY);
        countCtx.fillStyle = colorData.war;
        countCtx.fillText(this.count().war, this.warCountX, this.excuFontY);
        countCtx.fillStyle = colorData.cri;
        countCtx.fillText(this.count().cri, this.criCountX, this.excuFontY);
    };

    resCount() {
        countCtx.font = '25px Arial';

        countCtx.fillStyle = colorData.basicFont;
        countCtx.fillText('응답/초', this.resCountX, this.resFontY);
        countCtx.fillText(global.resCount, this.resCountX + (this.countTitleGap * 3), this.resFontY);
    };

    count() {
        const nor = global.dataCount.filter(data => timeCondition(data).nor).length;
        const war = global.dataCount.filter(data => timeCondition(data).war).length;
        const cri = global.dataCount.filter(data => timeCondition(data).cri).length;

        const totalCount = global.dataCount.length;

        return { nor, war, cri, totalCount };
    };
};
const background = new Background();

background.render();
const render = () => {
    countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
    background.renderCount();

    requestAnimationFrame(render);
};

render();

const worker = () => {
    if(window.Worker) {
        const bulletCanvas = document.querySelector('.offscreenCanvas');
        const offscreen = bulletCanvas.transferControlToOffscreen();

        const wk = new Worker('./js/offscreencanvas.js');
        
        wk.postMessage({offscreen, colorData, g: global}, [offscreen]);

        wk.onmessage = (e) => {
            const { g } = e.data
           
            global = g;
        }
    } else {
        console.error('worker 지원 x');
    };
};

worker();