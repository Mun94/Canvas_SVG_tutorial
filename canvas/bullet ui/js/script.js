const script = () => {

    const g = {
        dataCount: 0,
        resCount : 0,
        reqCount : 0,

        excutePerSec: 60 // default 값
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

    const canvas = document.querySelector('.myCanvas');
    
    const ctx = canvas.getContext('2d');
    class TimeCondition {
        constructor(data) {
            this.norCondition = data.colorByRuntime >= 1 && data.colorByRuntime <= 3;
            this.warCondition = data.colorByRuntime > 3 && data.colorByRuntime <= 5;
            this.criCondition = data.colorByRuntime > 5  && data.colorByRuntime <= 10;
        };
    };
    const timeCondition = data => new TimeCondition(data);
    class Position {
        constructor(aniPosition) {
            this.canvasW     = canvas.width;
            this.canvasH     = canvas.height;
    
            this.bulletPathY = 240;
    
            this.reqX        = this.canvasW / 3;
            this.resX        = this.canvasW * ( 2 / 3 );
    
            this.startY      = 120;
            this.startX      = 0;
    
            if(aniPosition) {
                // 에니메이션 수행에 필요한 조건
                this.arcDiameter = 15;
    
                this.area        = this.canvasW / 3; // left; mid; right 구역 당 width
                this.tailSize    = 150;
    
                this.reqEndX     = this.reqX    - this.arcDiameter;
                this.excuStartX  = this.reqX    + this.arcDiameter;
                this.excuEndY    = this.canvasH - this.arcDiameter;
                this.resStartX   = this.resX    + this.arcDiameter
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
            this.resCountX     = this.canvasW * ( 3 / 4);
            this.resFontY      = 170;
        };
    };
    class SetDatas extends Position{
        constructor(){
            const needAniPosition = true;
            super(needAniPosition);
    
            const dataPerSec = 20; // 1 초 당 20 개
            const sec        = 0.2; // 0.2 초
    
            this.datas       = [];
            this.dataPerReq  = dataPerSec * sec; // 0.2초 마다 발생 할 요청에 생성 될 데이터 수
        };
    
        addDatas(){
            const speed = (this.area / (g.excutePerSec * ((Number(Math.random().toFixed(1)) || 0.1))));
 
            const pck = [];
            for(let i = 0; i < this.dataPerReq; i++) {
                const runtime = Math.ceil(Math.random() * 10); // 0.1 ~ 1초
             
                pck.push({
                    colorByRuntime: runtime,
                    runtime,
    
                    speed,
                    x             : this.startX,
                    y             : this.bulletPathY,
                });
            };
    
            this.datas.push(pck);
        };
    };
    
    // animation
    class Animation extends SetDatas {
        constructor(){
            super();
            
            this.excuDatas = []; // 실행 될 데이터 배열
            this.resDatas  = [];
        };
    
        reqAni() {
            g.reqCount = this.datas.length * this.dataPerReq;

            for(let i = 0; i < this.datas.length; i++) {
                const data = this.datas[i];

                this.createBullet(colorData.nor, data[0], 'reqArea'); // blue
    
                if (data[0].x > this.reqEndX) {
                    data.forEach(d => {
                        const {colorByRuntime, runtime, speed} = d;
                        
                        this.excuDatas.push({
                            colorByRuntime,
                            runtime,
                            speed,
        
                            mx     : this.excuStartX + (Math.random() * (this.area - this.arcDiameter - this.arcDiameter)),
                            my     : this.startY + (Math.random() * (this.excuEndY - this.startY)),
                            mxSpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),
                            mySpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),
                        });
                    });
                    this.datas.splice(i, 1);
                };
            };
                
            g.dataCount  = this.excuDatas;
        };
    
        excuAni() {
            if(!this.excuDatas.length) { return; };
    
            const bounce = data => { // 화살표 함수 대신 일반함수에 bind메서드 사용해도 됨
                if(data.mx >= (this.resX - this.arcDiameter)) {
                    data.mxSpeed = -data.mxSpeed;
                };
                
                if(data.mx <= this.excuStartX) {
                    data.mxSpeed = Math.abs(data.mxSpeed);
                };
        
                if(data.my >= this.excuEndY) {
                    data.mySpeed = -data.mySpeed;
                };
                
                if(data.my <= (this.startY + this.arcDiameter)) {
                    data.mySpeed = Math.abs(data.mySpeed);
                };
            };

            for(let data of this.excuDatas) {
                this.createBulletByRuntime(data, 'excuArea', bounce);
            };
        };
    
        resAni() {    
            g.resCount = this.resDatas.reduce((cur, val) => cur + val.resBulletCount, 0);

            for(let data of this.resDatas) {
                this.createBulletByRuntime(data, 'resArea');
            };
    
            this.resDatas = this.resDatas.filter(data => data.rx < this.canvasW);
        };
    
        createBullet(color, data, area) {
            const bulletGradation = (move, y) => {
                const grad = ctx.createRadialGradient(move, y, 0, move, y, this.arcDiameter)
                grad.addColorStop(0, colorData.background);
                grad.addColorStop(1, color);
    
                return grad;
            };
    
            const bullet = (move, y) => {
                ctx.beginPath();
                ctx.fillStyle = bulletGradation(move, y);
                ctx.arc(move , y, this.arcDiameter, 0, Math.PI * 2);
                ctx.fill();
            };
    
            const tailGradation = x => {
                const tailGrad = ctx.createLinearGradient(x - this.tailSize, this.bulletPathY, x, this.bulletPathY);
                tailGrad.addColorStop(0, colorData.gradation);
                tailGrad.addColorStop(0.5, colorData.background);
                tailGrad.addColorStop(1, color);
    
                return tailGrad;
            };
    
            const tail = x => {
                ctx.beginPath();
                ctx.moveTo(x, this.bulletPathY + this.arcDiameter);
                ctx.fillStyle = tailGradation(x);
                ctx.quadraticCurveTo(x - this.tailSize, this.bulletPathY, x, this.bulletPathY - this.arcDiameter);
                ctx.fill();
            };
    
            switch(area) {
                case 'reqArea':
                    const reqMove = data.x += data.speed;
                
                    tail(reqMove);
    
                    bullet(reqMove, data.y);
                    break;
                case 'excuArea':
                    const excuMove  = data.mx += data.mxSpeed;
                    const excuMoveY = data.my += data.mySpeed;
    
                    bullet(excuMove, excuMoveY);
                    break;
                case 'resArea':
                    const resMove = data.rx += data.speed;
    
                    tail(resMove);
        
                    bullet(resMove, data.ry);
                    break;
                default:
                    break;
            };
        };
    
        createBulletByRuntime(data, area, bounceFn) {
            if(timeCondition(data).norCondition) { // 1에서 3초
                this.createBullet(colorData.nor, data,  area); // blue
    
                bounceFn && bounceFn(data);
            }; 
    
            if(timeCondition(data).warCondition) { // 3에서 5초
                this.createBullet(colorData.war, data, area); // yellow
    
                bounceFn && bounceFn(data);
            };
    
            if(timeCondition(data).criCondition) { // 5에서 10초
                this.createBullet(colorData.cri, data, area); // red
    
                bounceFn && bounceFn(data);
            };
        };
    
        excuteRuntime() {
            if(!this.excuDatas.length) { return; };
    
            this.excuDatas.forEach(data => data.runtime = Number((data.runtime - 0.2).toFixed(1))); // 수행 시간 감소
            
            const runtimeEndBullets = this.excuDatas.filter(data => data.runtime <= 0); // 수행 시간 종료 데이터 필터링
            const resBulletCount = runtimeEndBullets.length;
    
            const longestRuntime = runtimeEndBullets.sort((a, b) => b.colorByRuntime - a.colorByRuntime)[0]; // 동시에 수행 시간이 완료 된 데이터 중 runtime이 가장 길었던 데이터 추출
    
            if(longestRuntime) {
                const {colorByRuntime, runtime, speed} = longestRuntime;
    
                this.resDatas.push({
                    colorByRuntime, 
                    runtime, 
                    rx: this.resStartX, 
                    ry: this.bulletPathY, 
                    speed: Math.abs(speed),
                    resBulletCount
                });
            };
             
            this.excuDatas = this.excuDatas.filter(data => data.runtime > 0); // 수행 시간이 남은 데이터들로 재할당
            g.dataCount = this.excuDatas;
        };
    
        render() {
            this.reqAni();
            this.excuAni();
            this.resAni();
        };
    };
    const animation  = new Animation();
    
    // background
    class Background extends FontPosition{
        constructor() {
            super();
        };
    
        render() {
            ctx.fillStyle = colorData.background; // 배경 색
            ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
        
            ctx.beginPath();
    
            this.line();
    
            this.reqCount();
            this.excuCount();
            this.resCount();
    
            ctx.stroke();
        };
    
        line() {
            ctx.lineWidth   = this.lineTick;
            ctx.strokeStyle = colorData.basicLine;
    
            ctx.moveTo(this.reqX     , this.startY);
            ctx.lineTo(this.reqX     , this.canvasH);
            ctx.moveTo(this.startX   , this.bulletPathY);
            ctx.lineTo(this.reqX     , this.bulletPathY);

            ctx.moveTo(this.resX    , this.startY);
            ctx.lineTo(this.resX    , this.canvasH);
            ctx.moveTo(this.resX    , this.bulletPathY);
            ctx.lineTo(this.canvasW  , this.bulletPathY);
        };
    
        reqCount() {
            const totalCount = this.count().nor + this.count().war + this.count().cri;
    
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
            const nor = (g.dataCount || []).filter(data => 
                    timeCondition(data).norCondition
                ).length;
    
            const war = (g.dataCount || []).filter(data => 
                    timeCondition(data).warCondition
                ).length;
            
            const cri = (g.dataCount || []).filter(data => 
                    timeCondition(data).criCondition
                ).length;
            
            return { nor, war, cri };
        };
    };
    const background = new Background();
    
    let i = 0;
    let runCycle = 0;

    let beforeSec = 0;
    let term = 0;
    const render = () => {
        ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        i++;

        const nowSec = (new Date()).getMilliseconds();

        if(beforeSec !== nowSec) {
            if(nowSec > beforeSec) {
                term = nowSec - beforeSec;
            } else {
                term = beforeSec - nowSec;
            };
            beforeSec = nowSec;
        };
      
        term = term > 900 ? 1000 - term : term;

        g.excutePerSec = 1000 / term; 
        runCycle = g.excutePerSec / 5; // 1초에 5번 실행

        if(i % runCycle < 1) {
            animation.addDatas();
            animation.excuteRuntime();

            i = 0;
        };
    
        background.render();
        animation.render();

        // if(i >= g.excutePerSec) {
        //     i = 0;
        // };

        requestAnimationFrame(render);
    };
    
    render();
};

script();
