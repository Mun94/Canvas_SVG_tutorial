onmessage = (e) => {
    const { canvas } = e.data;
    const ctx = canvas.getContext('2d');

    const g = {
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

    class Position{
        constructor(aniPosition) {
            this.canvasW = canvas.width;
            this.canvasH = canvas.height;

            this.bulletPath = 240;

            this.reqX = this.canvasW / 3;
            this.resX = this.canvasW * (2 / 3);

            this.startX = 0;
            this.startY = 120;

            if(aniPosition) {
                this.area = this.canvasW / 3;

                this.arcDiameter = 15;
            };
        };
    };

    class FontPosition extends Position {
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);

            this.startRectX = 0;
            this.startRectY = 0;

            this. lineTick = 1;

        };
    };

    class SetDatas extends Position {
        constructor() {
            const needAniPosition = true;
            super(needAniPosition);

            const dataPerSec = 20;
            const sec = 0.2;

            this.datas = [];
            this.dataPerReq = dataPerSec * sec;
        };

        addDatas() {
            const speed = this.area / (g.excutePerSec * Number(Math.random().toFixed(1)) || 0.1);

            const pck = [];

            for(let i = 0; i < this.dataPerReq; i++) {
                const runtime = Math.ceil(Math.random() * 10); // 수행 시간 1 ~ 10초
                
                pck.push({
                    colorByRuntime: runtime,
                    runtime,
                    speed,

                    x: this.startX,
                    y: this.bulletPath
                });
            };

            this.datas.push(pck);
        };
    };
    class Animation extends SetDatas {
        constructor() {
            super();

            this.excuDatas = [];
            this.resDatas = [];
        };

        render() {
            this.reqAni();
        };

        reqAni() {
            // if(!this.datas.length) { return; };
            // console.log(this.datas)
            this.createBullet(colorData.nor, data[0]);
            for(let data of this.datas) {
                this.createBullet(colorData.nor, data[0]);
                console.log(123)
            };
        };

        createBullet(color, data) {
       
            ctx.fillStyle = 'red';
            ctx.arc(200 ,240, 15, 0, Math.PI * 2);
            ctx.fill();
        };

        createBulletByRuntime() {

        };
    };
    const animation = new Animation();
    class Background extends FontPosition {
        constructor(){
            super();
        };

        render() {
            this.background();

            ctx.beginPath();
            this.line();
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
            ctx.moveTo(this.startX, this.bulletPath);
            ctx.lineTo(this.reqX, this.bulletPath);
            // res 경계
            ctx.moveTo(this.resX, this.startY);
            ctx.lineTo(this.resX, this.canvasH);
            // res 총알 길
            ctx.moveTo(this.resX, this.bulletPath);
            ctx.lineTo(this.canvasW, this.bulletPath);
        };
    };
    const background = new Background();

    const render = () => {
        // ctx.clearRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);

        animation.createBullet();
        background.render();
        requestAnimationFrame(render);
    };
    animation.addDatas(); // 나중에 requestAnimationFrame에 들여놔야 함

    render()

};