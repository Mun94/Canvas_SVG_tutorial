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

            if(aniPosition) {};
        };
    };

    class FontPosition extends Position {
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);

            this.startRectX = 0;
            this.startRectY = 0;
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
        };

        background() {
            ctx.fillStyle = colorData.background;
            ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
        };  

        line() {

        };
    };
    const background = new Background();

    const render = () => {

        background.render();
        requestAnimationFrame(render);
    };

    render()

};