onmessage = (e) => {
    const { canvas } = e.data;
    const ctx = canvas.getContext('2d');

    const g = {};

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

            if(aniPosition) {};
        };
    };

    class FontPosition extends Position {
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);

            this.startRectX = 0;
            this.startRectY = 0;

            this. lineTick = 1;

        }
    }
    class Animation{

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
        ctx.clearRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);

        background.render();
        requestAnimationFrame(render);
    };

    render()

};