const script = () => {
    const g = {
        // svgWrap   : undefined,

        reqLine   : undefined,
        reqBltLine: undefined, // bullet path
        resLine   : undefined,
        resBltLine: undefined, // bullet path

        reqWrap   : undefined,
        excuWrap  : undefined
    };

    const svgWrap = document.querySelector('.svgWrap');
    g.reqLine     = svgWrap.querySelector('.reqLine');
    g.reqBltLine  = svgWrap.querySelector('.reqBltLine');
    g.resLine     = svgWrap.querySelector('.resLine');
    g.resBltLine  = svgWrap.querySelector('.resBltLine');
    
    g.reqWrap     = svgWrap.querySelector('.reqWrap');
    g.excuWrap    = svgWrap.querySelector('.excuWrap');

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

                this.reqEndX     = this.reqX - this.arcDiameter;
                this.excuStartX  = this.reqX + this.arcDiameter;
                this.excuEndY    = this.svgH - this.arcDiameter;
                this.resStartX   = this.resX + this.arcDiameter
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

            const pck = [];
            for(let i = 0; i < this.dataPerReq; i++) {
                const runtime = Math.ceil(Math.random() * 10);

                pck.push({
                    colorByRuntime: runtime,
                    runtime,

                    dur           : speed,
                });
            };

            this.datas.push(pck);
        };
    };

    class Animation extends SetDatas {
        constructor() { 
            super();

            this.excuDatas = [];
        };

        reqAni() {
            for(let data of this.datas) { 
                const createCircleEl = document.createElementNS('http://www.w3.org/2000/svg','circle');

                setAttribute(createCircleEl, {
                    'cx': this.startX, 'cy': this.bulletPathY, 'r': this.arcDiameter, 'speed': data[0].dur, 'data-runtime': JSON.stringify(data)
                }); // 0.2초 마다 생기는 4개의 총알 속도가 모두 같으므로 대표로 하나만 돔에 추가하고 나머지(4개의 총알들) 런타임이나 그런 속성은 data-runtime attribute에 추가하고 req에서 exut로 넘어갈 때 분리시키는게 좋을 듯 
       
                g.reqWrap.appendChild(createCircleEl);
            };

            const bulletPck = document.querySelectorAll('.reqWrap')

            bulletPck[0] && [...bulletPck[0].children].forEach(el => {
                const getCx = el.getAttribute('cx');
                const speed = el.getAttribute('speed');

                if(Number(getCx) > this.reqEndX) {
                    this.excuDatas.push(...JSON.parse(el.dataset.runtime).map(data => { return {...data, 
                        mx: this.excuStartX + (Math.random() * (this.area - this.arcDiameter - this.arcDiameter)),
                        my: this.startY + (Math.random() * (this.excuEndY - this.startY)),
                        mxSpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),
                        mySpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1)
                    }})); // excuDatas 배열로 이동
                    // 바로 위에 반복문에서 바로 excuDatas에 하나하나 push해도 되긴 한데 4개를 한번에 push하는게 좋을것 같아서 이렇게 함

                    el.remove();
                };
                
                el.setAttribute('cx', Number(getCx) + Number(speed));
            });

            this.datas.shift();
        };

        excuAni() {
          if(!this.excuDatas.length) { return; };
          
          for(let data of this.excuDatas) {
            const createCircleEl = document.createElementNS('http://www.w3.org/2000/svg','circle');

            if(data.colorByRuntime >= 1 && data.colorByRuntime <= 3) {
                setAttribute(createCircleEl, {
                    'cx': data.mx, 'cy': data.my, 'r': this.arcDiameter, 'mxSpeed': data.mxSpeed, 'mySpeed': data.mySpeed, 'runtime': data.runtime, 'fill': 'blue'
                });
            };

            if(data.colorByRuntime > 3 && data.colorByRuntime <= 5) {
                setAttribute(createCircleEl, {
                    'cx': data.mx, 'cy': data.my, 'r': this.arcDiameter, 'mxSpeed': data.mxSpeed, 'mySpeed': data.mySpeed, 'runtime': data.runtime, 'fill': 'yellow'
                });
            };

            if(data.colorByRuntime > 5 && data.colorByRuntime <= 10) {
                setAttribute(createCircleEl, {
                    'cx': data.mx, 'cy': data.my, 'r': this.arcDiameter, 'mxSpeed': data.mxSpeed, 'mySpeed': data.mySpeed, 'runtime': data.runtime, 'fill': 'red'
                });
            };

            g.excuWrap.appendChild(createCircleEl);
          };

          this.excuDatas.shift();
        };

        render() {
            this.reqAni();
            this.excuAni();
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

        if(i % 60 === 0) {
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
