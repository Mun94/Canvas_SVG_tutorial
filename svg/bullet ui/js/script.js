const script = () => {
    const svgWrap     = document.querySelector('.svgWrap');
    
    const reqLine     = svgWrap.querySelector('.reqLine');
    const reqBltLine  = svgWrap.querySelector('.reqBltLine'); // bullet path
    const resLine     = svgWrap.querySelector('.resLine');
    const resBltLine  = svgWrap.querySelector('.resBltLine'); // bullet path
    
    const reqWrap     = svgWrap.querySelector('.reqWrap');

    const excuNorWrap = svgWrap.querySelector('.excuNorWrap');
    const excuWarWrap = svgWrap.querySelector('.excuWarWrap');
    const excuCriWrap = svgWrap.querySelector('.excuCriWrap');

    const resNorWrap = svgWrap.querySelector('.resNorWrap');
    const resWarWrap = svgWrap.querySelector('.resWarWrap');
    const resCriWrap = svgWrap.querySelector('.resCriWrap');

    const totalTextWrap = svgWrap.querySelector('.totalTextWrap');
    const totalCount    = svgWrap.querySelector('.totalCount');
    const reqTextWrap   = svgWrap.querySelector('.reqTextWrap');
    const reqCount      = svgWrap.querySelector('.reqCount');
    const norTextWrap   = svgWrap.querySelector('.norTextWrap');
    const norCount      = svgWrap.querySelector('.norCount');
    const warTextWrap   = svgWrap.querySelector('.warTextWrap');
    const warCount      = svgWrap.querySelector('.warCount');
    const criTextWrap   = svgWrap.querySelector('.criTextWrap');
    const criCount      = svgWrap.querySelector('.criCount');
    const resTextWrap   = svgWrap.querySelector('.resTextWrap');
    const resCount      = svgWrap.querySelector('.resCount');
   
    const g = {
        dataCount : 0,
        reqCount  : 0,
        resCount  : 0
    };

    const setAttribute = (el, obj) => {
        if(!el) { return; };

        for(let [key, value] of Object.entries(obj)) {
            el.setAttribute(key, value);
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

            this.reqX = this.svgW / 3;
            this.resX = this.svgW * ( 2 / 3 );

            this.startX = 0;
            this.startY = 120;

            if(aniPosition) {
                this.arcDiameter = 15;

                this.area = this.svgW / 3;

                this.tailSize = 100;

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
            this.resFontY      = 170;
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

                    speed,
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
                this.createBullet(data, 'reqArea');
            };

            const reqPck = svgWrap.querySelectorAll('.reqWrap');

            g.reqCount = reqPck[0].children.length * this.dataPerReq;
            
            reqPck[0] && [...reqPck[0].children].forEach(el => {
                const [getCx, speed] = getAttribute(el, ['cx', 'speed']);
                const move = Number(getCx) + Number(speed);

                if(Number(getCx) > this.reqEndX) {
                    this.excuDatas.push(...JSON.parse(el.dataset.runtime).map(data => { 
                        
                        return {...data, 
                            ex     : this.excuStartX + (Math.random() * (this.area - this.arcDiameter - this.arcDiameter)), 
                            ey     : this.startY + (Math.random() * (this.excuEndY - this.startY)), 
                            exSpeed: Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1), 
                            eySpeed:  Math.sign(Math.random() - 0.5) * (Number(Math.random().toFixed(1)) || 0.1),
                        };
                    })); // excuDatas 배열로 이동
                    // 바로 위에 반복문에서 바로 excuDatas에 하나하나 push해도 되긴 한데 4개를 한번에 push하는게 좋을것 같아서 이렇게 함
                    el.remove();
                };

                setAttribute(el, {
                    'd': `
                        M ${move} ${this.bulletPathY - this.arcDiameter}
                        A ${this.arcDiameter} ${this.arcDiameter} 0, 1, 1 ${move} ${this.bulletPathY + this.arcDiameter}
                        L ${move - this.tailSize} ${this.bulletPathY}
                        Z
                        `,
                    'cx': move
                });
            });

            this.datas.shift();
        };

        excuAni() {
          const norPck = svgWrap.querySelectorAll('.excuNorWrap');
          const warPck = svgWrap.querySelectorAll('.excuWarWrap');
          const criPck = svgWrap.querySelectorAll('.excuCriWrap');

          const excuPck = [...norPck[0].children, ...warPck[0].children, ...criPck[0].children];
    
          g.dataCount = excuPck.map(el => { return {'colorByRuntime': Number(el.getAttribute('colorByRuntime'))}});
          
          excuPck[0] && excuPck.forEach(el => {
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

            const norPck = svgWrap.querySelectorAll('.resNorWrap');
            const warPck = svgWrap.querySelectorAll('.resWarWrap');
            const criPck = svgWrap.querySelectorAll('.resCriWrap');

            const resPck = [...norPck[0].children, ...warPck[0].children, ...criPck[0].children];

            g.resCount = resPck.reduce((cur, val) => cur + Number(val.getAttribute('resBulletCount')), 0);

            resPck[0] && resPck.forEach(el => {
                const [getCx, speed] = getAttribute(el, ['cx', 'speed']);
                const move = Number(getCx) + Number(speed);

                if(Number(getCx) > this.svgW) {
                    el.remove();
                };

                setAttribute(el, {
                    'd': `
                    M ${move} ${this.bulletPathY - this.arcDiameter}
                    A ${this.arcDiameter} ${this.arcDiameter} 0, 1, 1 ${move} ${this.bulletPathY + this.arcDiameter}
                    L ${move - this.tailSize} ${this.bulletPathY}
                    Z
                    `,
                    'cx': move
                });
            });

            this.resDatas.shift();
        };

        createBullet(data, area) {
            const createCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const bullet = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            const setD = startX => {
                return `
                M${startX} ${this.bulletPathY - this.arcDiameter}
                A${this.arcDiameter} ${this.arcDiameter} 0, 1, 1 ${startX} ${this.bulletPathY + this.arcDiameter}
                L ${startX - this.tailSize} ${this.bulletPathY}
                Z`;
            };

            switch(area) {
                case 'reqArea':
                    setAttribute(bullet, {
                        'd': setD(this.startX),

                        'cx': this.startX,
                        'speed': data[0].speed,
                        'data-runtime': JSON.stringify(data)
                    });
                     // 0.2초 마다 생기는 4개의 총알 속도가 모두 같으므로 대표로 하나만 돔에 추가하고 나머지(4개의 총알들) 런타임이나 그런 속성은 data-runtime attribute에 추가하고 req에서 exut로 넘어갈 때 분리시키는게 좋을 듯 
                   
                    reqWrap.appendChild(bullet);
                    break;
                case 'excuArea':
                    setAttribute(createCircle, {
                        'cx': data.ex, 
                        'cy': data.ey, 
                        'r' : this.arcDiameter, 
                        
                        'exSpeed': data.exSpeed, 
                        'eySpeed': data.eySpeed, 
                        'runtime': data.runtime, 
                        'colorByRuntime': data.colorByRuntime, 
                        'speed': data.speed, 
                    });

                    if(timeCondition(data).norCondition) {
                        excuNorWrap.appendChild(createCircle);
                    };

                    if(timeCondition(data).warCondition) {
                         excuWarWrap.appendChild(createCircle);
                    };

                    if(timeCondition(data).criCondition) {
                        excuCriWrap.appendChild(createCircle);
                    };
                    break;
                case 'resArea':
                    setAttribute(bullet, {
                        'd': setD(data.rx),

                        'cx': data.rx,
                        'speed': data.speed,
                        'resBulletCount': data.resBulletCount
                    });
                    
                    if(timeCondition(data).norCondition) {
                        resNorWrap.appendChild(bullet);
                    };

                    if(timeCondition(data).warCondition) {
                        resWarWrap.appendChild(bullet);
                    };

                    if(timeCondition(data).criCondition) {
                        resCriWrap.appendChild(bullet);
                    };
                    break;
            };
        };

        excuteRuntime() {
            const norPck = svgWrap.querySelectorAll('.excuNorWrap');
            const warPck = svgWrap.querySelectorAll('.excuWarWrap');
            const criPck = svgWrap.querySelectorAll('.excuCriWrap');

            const excuPck = [...norPck[0].children, ...warPck[0].children, ...criPck[0].children];

            const runtimeEndBullets = excuPck[0] && excuPck.filter(el => {
                const runtime = getAttribute(el, 'runtime');

                return runtime <= 0 
            }); 
            const resBulletCount = (runtimeEndBullets || []).length;

            const longestRuntime = (runtimeEndBullets || []).sort((aEl,bEl) => {
                const a = getAttribute(aEl, 'colorByRuntime'); 
                const b = getAttribute(bEl, 'colorByRuntime');
            
                return b - a;
            })[0];

            if(longestRuntime) {
                const [ colorByRuntime, runtime, speed ] = getAttribute(longestRuntime, ['colorByRuntime', 'runtime', 'speed']);

                this.resDatas.push({
                    colorByRuntime: Number(colorByRuntime), 
                    runtime, 
                    rx: this.resStartX, 
                    ry: this.bulletPathY, 
                    speed: Math.abs(Number(speed)),

                    resBulletCount
                });
            };

            excuPck[0] && excuPck.forEach(el => {
                const runtime = getAttribute(el, 'runtime');

                setAttribute(el, {
                    'runtime': (Number(runtime) - 0.2).toFixed(1)
                });

                if(Number(runtime) <= 0) {
                    el.remove();
                };
            });
        };

        createBulletByRuntime(data, area) {
            if(timeCondition(data).norCondition) { // 1에서 3초
                this.createBullet(data,  area); // blue
            }; 
    
            if(timeCondition(data).warCondition) { // 3에서 5초
                this.createBullet(data, area); // yellow
            };
    
            if(timeCondition(data).criCondition) { // 5에서 10초
                this.createBullet(data, area); // red
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

        render() {
            this.line();

            this.reqCount();
            this.excuCount();
            this.resCount();
        };

        line() { 
            setAttribute(reqLine, 
                {'x1': this.startX, 'y1': this.bulletPathY, 
                 'x2': this.reqX  , 'y2': this.bulletPathY});
            setAttribute(reqBltLine, 
                {'x1': this.reqX  , 'y1': this.startY, 
                 'x2': this.reqX  , 'y2': this.svgH});
            
            setAttribute(resLine, 
                {'x1': this.resX  , 'y1': this.startY, 
                 'x2': this.resX  , 'y2': this.svgH});
            setAttribute(resBltLine,
                {'x1': this.resX  , 'y1':this.bulletPathY, 
                 'x2': this.svgW  , 'y2': this.bulletPathY})
        };

        reqCount() {
            setAttribute(totalTextWrap , {
                'x': this.totalCountX, 'y': this.totalFontY
            });
            totalCount.innerHTML = this.count().nor + this.count().war + this.count().cri;

            setAttribute(reqTextWrap, {
                'x': this.reqCountX, 'y': this.reqFontY
            });
            reqCount.innerHTML = g.reqCount;
        };

        excuCount() {
            setAttribute(norTextWrap, {
                'x': this.norCountX, 'y': this.excuFontY
            });
            setAttribute(warTextWrap, {
                'x': this.warCountX, 'y': this.excuFontY
            });
            setAttribute(criTextWrap, {
                'x': this.criCountX, 'y': this.excuFontY
            });

            norCount.innerHTML = this.count().nor;
            warCount.innerHTML = this.count().war;
            criCount.innerHTML = this.count().cri;
        };

        resCount() {
            setAttribute(resTextWrap, {
                'x': this.resCountX, 'y': this.resFontY
            });
            resCount.innerHTML = g.resCount;
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
    let excutePerSec = 0;
    let runCycle = 0;

    let beforeSec = 0;
    let term = 0;
    const render = () => {
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

        excutePerSec = Number((1000 / term).toFixed(0)); 
        runCycle = Math.floor(excutePerSec / 5); // 1초에 5번 실행

        if(i % runCycle === 0) {
            animation.addDatas();
            animation.excuteRuntime();
        };
    
        background.render();
        animation.render();

        if(i === excutePerSec) {
            i = 0;
        };

        requestAnimationFrame(render);
    };
    
    render();
};

script();
