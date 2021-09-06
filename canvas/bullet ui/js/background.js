const canvas = document.querySelector('.background');
const ctx = canvas.getContext('2d');

const g = {
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

class Position{
    constructor(aniPosition) {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        this.bulletPathY = 240;

        this.reqX = this.canvasW / 3;
        this.resX = this.canvasW * (2 / 3);

        this.startX = 0;
        this.startY = 120;

        if(aniPosition) {
            this.area = this.canvasW / 3;

            this.arcRadius = 15;

            this.tailSize = 150;

            this.reqEndX     = this.reqX    - this.arcRadius;
            this.excuStartX  = this.reqX    + this.arcRadius;
            this.excuEndY    = this.canvasH - this.arcRadius;
            this.resStartX   = this.resX    + this.arcRadius
        };
    };
};

class FontPosition extends Position {
    constructor() {
        const needAniPosition = false;
        super(needAniPosition);

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

class Background extends FontPosition {
    constructor() {
        super();
    };

    render() {
        this.background();

        ctx.beginPath();
        this.line();

        this.reqCount();
        this.excuCount();
        this.resCount();
        ctx.stroke();
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

        ctx.font = '30px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('현재 전체 건수', this.totalCountX + this.countTitleGap + 13, this.totalFontY);

        ctx.font = '45px Arial';

        ctx.fillText(totalCount, this.totalCountX, this.totalFontY);
        
        ctx.font = '25px Arial';

        ctx.fillText('요청/초', this.reqCountX, this.reqFontY);
        ctx.fillText(g.reqCount, this.reqCountX - this.countTitleGap, this.reqFontY);
    };

    excuCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('정상', this.norCountX + this.countTitleGap, this.excuFontY);
        ctx.fillText('경고', this.warCountX + this.countTitleGap, this.excuFontY);
        ctx.fillText('심각', this.criCountX + this.countTitleGap, this.excuFontY);

        ctx.font = 'bold 35px Arial';

        ctx.fillStyle = colorData.nor;
        ctx.fillText(this.count().nor, this.norCountX, this.excuFontY);
        ctx.fillStyle = colorData.war;
        ctx.fillText(this.count().war, this.warCountX, this.excuFontY);
        ctx.fillStyle = colorData.cri;
        ctx.fillText(this.count().cri, this.criCountX, this.excuFontY);
    };

    resCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('응답/초', this.resCountX, this.resFontY);
        ctx.fillText(g.resCount, this.resCountX + (this.countTitleGap * 3), this.resFontY);
    };

    count() {
        const nor = g.dataCount.filter(data => timeCondition(data).nor).length;
        const war = g.dataCount.filter(data => timeCondition(data).war).length;
        const cri = g.dataCount.filter(data => timeCondition(data).cri).length;

        const totalCount = g.dataCount.length;

        return { nor, war, cri, totalCount };
    };
};
const background = new Background();

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.render();

    requestAnimationFrame(render);
};

render();