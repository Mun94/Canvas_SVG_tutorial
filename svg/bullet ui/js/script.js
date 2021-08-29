const script = () => {
    const g = {
        // svgWrap   : undefined,

        reqLine   : undefined,
        reqBltLine: undefined, // bullet path
        resLine   : undefined,
        resBltLine: undefined, // bullet path

        reqWrap   : undefined,
        excuWrap  : undefined,
        resWrap   : undefined


    };

    const colorData = {
        // background : '#303437', // 배경 색
    
        nor        : '#4D8BD5', // 정상 색
        war        : '#B8A605', // 경고 색
        cri        : '#B40E0A', // 심각 색
        // gradation  : 'rgba(38, 36, 28, 0.5)',//'#26241C' // 그라데이션 색
    
        // basicFont  : '#C6C9CD', // 기본 폰트 색
    
        // basicLine  : '#C6C9CD', // 라인 색
    };

    const svgWrap = document.querySelector('.svgWrap');
    g.reqLine     = svgWrap.querySelector('.reqLine');
    g.reqBltLine  = svgWrap.querySelector('.reqBltLine');
    g.resLine     = svgWrap.querySelector('.resLine');
    g.resBltLine  = svgWrap.querySelector('.resBltLine');
    
    g.reqWrap     = svgWrap.querySelector('.reqWrap');
    g.excuWrap    = svgWrap.querySelector('.excuWrap');
    g.resWrap     = svgWrap.querySelector('.resWrap');

    const setAttribute = (el, obj) => {
        if(!el) { return; };

        for(let [key, value] of Object.entries(obj)) {
            el.setAttribute(key, value)
        };
    };

    const getAttribute = (el, key) => {
        if(!el) { return; };

        if(typeof key === 'object') {
            return key.map(k => el.getAttribute(String(k)));
        }else {
            return el.getAttribute(key);
        };
    };  

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
            this.resDatas  = [];
        };

        reqAni() {
            for(let data of this.datas) { 
                this.createBullet(colorData.nor, data, 'reqArea');
            };

            const bulletPck = svgWrap.querySelectorAll('.reqWrap');

            bulletPck[0] && [...bulletPck[0].children].forEach(el => {
                const [getCx, speed] = getAttribute(el, ['cx', 'speed']);

                if(Number(getCx) > this.reqEndX) {
                    this.excuDatas.push(...JSON.parse(el.dataset.runtime).map(data => { return {...data, 
                        ex: this.excuStartX + (Math.random() * (this.area - this.arcDiameter - this.arcDiameter)),
                        ey: this.startY + (Math.random() * (this.excuEndY - this.startY)),
                        exSpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),
                        eySpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),

                        speed
                    }})); // excuDatas 배열로 이동
                    // 바로 위에 반복문에서 바로 excuDatas에 하나하나 push해도 되긴 한데 4개를 한번에 push하는게 좋을것 같아서 이렇게 함

                    el.remove();
                };
                
                setAttribute(el, {
                    'cx': Number(getCx) + Number(speed) 
                });
            });

            this.datas.shift();
        };

        excuAni() { 
          const excuPck = svgWrap.querySelectorAll('.excuWrap');

          excuPck[0] && [...excuPck[0].children].forEach(el => {
                const [getCx, getExSpeed, getCy, getEySpeed] = getAttribute(el, ['cx', 'exSpeed', 'cy', 'eySpeed']);
              
                if(getCx >= (this.resX - this.arcDiameter)) {
                    setAttribute(el, {'exSpeed':  -Math.abs(Number(getExSpeed))});
                };

                if(getCx <= this.excuStartX) {
                    setAttribute(el, {'exSpeed': Math.abs(Number(getExSpeed))});
                };

                if(getCy >= this.excuEndY) {
                    setAttribute(el, {'eySpeed': -Math.abs(Number(getEySpeed))});
                };

                if(getCy <= (this.startY + this.arcDiameter)) {
                    setAttribute(el, {'eySpeed': Math.abs(Number(getEySpeed))});
                };

                setAttribute(el,{
                    'cx': Number(getCx) + Number(getExSpeed),
                    'cy': Number(getCy) + Number(getEySpeed)
                });
          });

          if(!this.excuDatas.length) { return; };

          for(let data of this.excuDatas) {
            this.createBulletByRuntime(data, 'excuArea');
          };

          this.excuDatas.splice(0, 4);
        };

        resAni() {
            for(let data of this.resDatas) {
                this.createBulletByRuntime(data, 'resArea');
            }; 

            const resPck = svgWrap.querySelectorAll('.resWrap');

            resPck[0] && [...resPck[0].children].forEach(el => {
                const [getCx, speed] = getAttribute(el, ['cx', 'speed']);

                if(Number(getCx) > this.svgW) {
                    el.remove();
                };

                setAttribute(el, {
                    'cx': Number(getCx) + Number(speed)
                });
            });

            this.resDatas.shift();
        };

        createBullet(color, data, area) {
            const createCircleEl = document.createElementNS('http://www.w3.org/2000/svg','circle');

            switch(area) {
                case 'reqArea':
                    setAttribute(createCircleEl, {
                        'cx': this.startX, 
                        'cy': this.bulletPathY, 
                        'r' : this.arcDiameter, 
                        'speed': data[0].dur, 
                        'data-runtime': JSON.stringify(data)
                    });
                     // 0.2초 마다 생기는 4개의 총알 속도가 모두 같으므로 대표로 하나만 돔에 추가하고 나머지(4개의 총알들) 런타임이나 그런 속성은 data-runtime attribute에 추가하고 req에서 exut로 넘어갈 때 분리시키는게 좋을 듯 
                    g.reqWrap.appendChild(createCircleEl);
                    break;
                case 'excuArea':
                    setAttribute(createCircleEl, {
                        'cx': data.ex, 
                        'cy': data.ey, 
                        'r' : this.arcDiameter, 
                        'exSpeed': data.exSpeed, 
                        'eySpeed': data.eySpeed, 
                        'runtime': data.runtime, 
                        'colorByRuntime': data.colorByRuntime, 
                        'speed': data.speed, 
                        'fill': color
                    });
                    g.excuWrap.appendChild(createCircleEl);
                    break;
                case 'resArea':
                    setAttribute(createCircleEl, {
                        'cx': data.rx, 
                        'cy': data.ry, 
                        'r':this.arcDiameter,
                        
                        'speed': data.speed, 
                        'fill': color
                    });
                    g.resWrap.appendChild(createCircleEl);
                    break;
            };
        };

        excuteRuntime() {
            const excuPck = svgWrap.querySelectorAll('.excuWrap');

            const runtimeEndBullets = excuPck[0] && [...excuPck[0].children].filter(el => {
                const runtime = getAttribute(el, 'runtime');

                return runtime <= 0 
            });

            const longestRuntime = runtimeEndBullets.sort((aEl,bEl) => {
                const a = getAttribute(aEl, 'colorByRuntime'); 
                const b = getAttribute(bEl, 'colorByRuntime');
            
                return b - a;
            })[0]

            if(longestRuntime) {
                const [ colorByRuntime, runtime, speed ] = getAttribute(longestRuntime, ['colorByRuntime', 'runtime', 'speed']);

                this.resDatas.push({colorByRuntime: Number(colorByRuntime), runtime, rx: this.resStartX, ry: this.bulletPathY, speed: Math.abs(Number(speed))});
            };

            excuPck[0] && [...excuPck[0].children].forEach(el => {
                const runtime = getAttribute(el, 'runtime');

                setAttribute(el, {
                    'runtime': Number(runtime) - 0.2
                });

                if(runtime <= 0) {
                    el.remove();
                };
            });
        };

        createBulletByRuntime(data, area) {
            if(timeCondition(data).norCondition) { // 1에서 3초
                this.createBullet(colorData.nor, data,  area); // blue
            }; 
    
            if(timeCondition(data).warCondition) { // 3에서 5초
                this.createBullet(colorData.war, data, area); // yellow
            };
    
            if(timeCondition(data).criCondition) { // 5에서 10초
                this.createBullet(colorData.cri, data, area); // red
            };
        };

        render() {
            this.reqAni();
            this.excuAni();
            this.resAni();
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
    let beforePerformance = 0;
    let excutePerSec = 0;
    let runCycle = 0;

    const render = () => {
        i++;

        const nowPerformance = performance.now();
        if(beforePerformance !== nowPerformance) {
            const culPerformance = nowPerformance - beforePerformance;

            if(culPerformance >= 25) {
                excutePerSec = 20;
                runCycle = 4;
            };

            if(culPerformance <= 24) {
                excutePerSec = 60;
                runCycle = 12;
            };

            beforePerformance = nowPerformance;
        };
     
        if(i % runCycle === 0) { // 0.2초마다 실행
            animation.addDatas();
            animation.excuteRuntime();
        };
        animation.render();
        background.render();

        if(i === excutePerSec) {
            i = 0;
        };

        requestAnimationFrame(render);
    };

    render();
};

script();
