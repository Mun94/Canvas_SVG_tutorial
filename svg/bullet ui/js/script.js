const script = () => {
    const g = {
        // svgWrap   : undefined,

        reqLine   : undefined,
        reqBltLine: undefined, // bullet path
        resLine   : undefined,
        resBltLine: undefined, // bullet path

        reqWrap   : undefined
    };

    const svgWrap = document.querySelector('.svgWrap');
    g.reqLine     = svgWrap.querySelector('.reqLine');
    g.reqBltLine  = svgWrap.querySelector('.reqBltLine');
    g.resLine     = svgWrap.querySelector('.resLine');
    g.resBltLine  = svgWrap.querySelector('.resBltLine');
    
    g.reqWrap     = svgWrap.querySelector('.reqWrap');

    const setAttribute = (el, obj) => {
        if(!el) { return; };

        for(let [key, value] of Object.entries(obj)) {
            el.setAttribute(key, value)
        };
    };
    class Position {
        constructor(aniPosition) {
            this.svgW = svgWrap.getAttribute('width');
            this.svgH = svgWrap.getAttribute('height');

            this.bulletPathY = 240;

            this.reqX        = this.svgW / 3;
            this.resX        = this.svgW * ( 2 / 3 );

            this.startX = 0;
            this.startY = 120;

            if(aniPosition) {
                this.arcDiameter = 15;

                this.area = this.svgW / 3;

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
    
            this.norCountX     = (this.svgW / 3) + 20;
            this.warCountX     = this.norCountX + this.norWarCriGap;
            this.criCountX     = this.warCountX + this.norWarCriGap;
    
            // res 글자 위치
            this.resCountX     = this.svgW * (3 / 4);
            this.redFontY      = 170;
        }
    }

    class SetDatas extends Position {
        constructor() {
            const needAniPosition = true;
            super(needAniPosition);
    
            const dataPerSec = 20; // 1 초 당 20 개
            const sec        = 0.2; // 0.2 초
    
            this.datas       = [];
            this.dataPerReq  = dataPerSec * sec; // 0.2초 마다 발생 할 요청에 생성 될 데이터 수
        };

        addDatas() {
            const speed = (this.area / (60 * ((Number(Math.random().toFixed(1)) || 0.1))));

            for(let i = 0; i < this.dataPerReq; i++) {
                const runtime = Math.ceil(Math.random() * 10);

                this.datas.push({
                    colorByRuntime: runtime,
                    runtime,

                    dur           : speed,
                });
            };
        };
    };

    class Animation extends SetDatas {
        constructor() { 
            super();
        };

        reqAni() {
            for(let data of this.datas) { 
                const createCircleEl = document.createElementNS('http://www.w3.org/2000/svg','circle');

                setAttribute(createCircleEl, {
                    'cx': this.startX, 'cy': this.bulletPathY, 'r': this.arcDiameter, 'speed': data.dur
                });
       
                g.reqWrap.appendChild(createCircleEl)
            };

            const bulletPck = document.querySelectorAll('.reqWrap')

            bulletPck[0] && [...bulletPck[0].children].forEach(ele => {
                const getCx = ele.getAttribute('cx');
                const speed = ele.getAttribute('speed');

                if(Number(getCx) > this.reqEndX) {
                    ele.remove();
                };

                ele.setAttribute('cx', Number(getCx) + Number(speed));
            });

            this.datas.splice(0, this.dataPerReq);
        };

        render() {
            this.reqAni();
        };
    };
    const animation = new Animation();
    class Background extends FontPosition{
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);
        };

        line() { 
            setAttribute(g.reqLine, 
                {'x1': this.startX, 'y1': this.bulletPathY, 
                 'x2': this.reqX  , 'y2': this.bulletPathY});
            setAttribute(g.reqBltLine, 
                {'x1': this.reqX  , 'y1': this.startY, 
                 'x2': this.reqX  , 'y2': this.svgH});
            
            setAttribute(g.resLine, 
                {'x1': this.resX  , 'y1': this.startY, 
                 'x2': this.resX  , 'y2': this.svgH});
            setAttribute(g.resBltLine,
                {'x1': this.resX  , 'y1':this.bulletPathY, 
                 'x2': this.svgW  , 'y2': this.bulletPathY})
        };

        render() {
            this.line();
        };
    };
    const background = new Background();

    let i = 0;
    const render = () => {
        i++;

        if(i % 12 === 0) {
            animation.addDatas();
        };
        animation.render();
        background.render();

        if(i === 60) {
            i = 0;
        };

        requestAnimationFrame(render)
    };

    render();
}

script();
