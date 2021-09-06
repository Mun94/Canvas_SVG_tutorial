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
        resCount  : 0,

        excutePerSec: 60
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
            const speed = (this.area / (g.excutePerSec * ((Number(Math.random().toFixed(1)) || 0.1))));

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
                    })); 

                    el.remove();
                };

                el.setAttribute('d',  `
                M ${move} ${this.bulletPathY - this.arcDiameter}
                A ${this.arcDiameter} ${this.arcDiameter} 0, 1, 1 ${move} ${this.bulletPathY + this.arcDiameter}
                L ${move - this.tailSize} ${this.bulletPathY}
                Z
                `);
                el.setAttribute('cx', move);
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
                const getCx = el.getAttribute('cx');
                const getExSpeed = el.getAttribute('exSpeed');
                const getCy = el.getAttribute('cy');
                const getEySpeed = el.getAttribute('eySpeed');
              
                if(getCx >= (this.resX - this.arcDiameter)) {
                    el.setAttribute('exSpeed', -Math.abs(Number(getExSpeed)));
                };

                if(getCx <= this.excuStartX) {
                    el.setAttribute('exSpeed', Math.abs(Number(getExSpeed)));
                };

                if(getCy >= this.excuEndY) {
                    el.setAttribute('eySpeed', -Math.abs(Number(getEySpeed)));
                };

                if(getCy <= (this.startY + this.arcDiameter)) {
                    el.setAttribute('eySpeed', Math.abs(Number(getEySpeed)));
                };

                el.setAttribute('cx', Number(getCx) + Number(getExSpeed));
                el.setAttribute('cy', Number(getCy) + Number(getEySpeed));
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
                const getCx = el.getAttribute('cx');
                const speed = el.getAttribute('speed');
                const move = Number(getCx) + Number(speed);

                if(Number(getCx) > this.svgW) {
                    el.remove();
                };

                el.setAttribute('d',  `
                M ${move} ${this.bulletPathY - this.arcDiameter}
                A ${this.arcDiameter} ${this.arcDiameter} 0, 1, 1 ${move} ${this.bulletPathY + this.arcDiameter}
                L ${move - this.tailSize} ${this.bulletPathY}
                Z
                `);
                el.setAttribute('cx', move);
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
                    bullet.setAttribute('d', setD(this.startX));
                    bullet.setAttribute('cx', this.startX);
                    bullet.setAttribute('speed', data[0].speed);
                    bullet.setAttribute('data-runtime', JSON.stringify(data));
                   
                    reqWrap.appendChild(bullet);
                    break;
                case 'excuArea':
                    createCircle.setAttribute('cx', data.ex);
                    createCircle.setAttribute('cy', data.ey);
                    createCircle.setAttribute('r', this.arcDiameter);
                    createCircle.setAttribute('exSpeed', data.exSpeed);
                    createCircle.setAttribute('eySpeed', data.eySpeed);
                    createCircle.setAttribute('colorByRuntime', data.colorByRuntime);
                    createCircle.setAttribute('speed', data.speed);

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
                    bullet.setAttribute('d', setD(data.rx));
                    bullet.setAttribute('cx', data.rx);
                    bullet.setAttribute('speed', data.speed);
                    bullet.setAttribute('resBulletCount', data.resBulletCount);
                    
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
                const runtime = el.getAttribute('runtime');

                return runtime <= 0 
            }); 
            const resBulletCount = (runtimeEndBullets || []).length;

            const longestRuntime = (runtimeEndBullets || []).sort((aEl,bEl) => {
                const a = aEl.getAttribute('colorByRuntime'); 
                const b = bEl.getAttribute('colorByRuntime');
            
                return b - a;
            })[0];

            if(longestRuntime) {
                const colorByRuntime = longestRuntime.getAttribute('colorByRuntime');
                const runtime = longestRuntime.getAttribute('runtime');
                const speed = longestRuntime.getAttribute('speed');

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
                const runtime = el.getAttribute('runtime');

                el.setAttribute('runtime', (Number(runtime) - 0.2).toFixed(1));

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
            reqLine.setAttribute('x1', this.startX);
            reqLine.setAttribute('y1', this.bulletPathY);
            reqLine.setAttribute('x2', this.reqX);
            reqLine.setAttribute('y2', this.bulletPathY);

            reqBltLine.setAttribute('x1', this.reqX);
            reqBltLine.setAttribute('y1', this.startY);
            reqBltLine.setAttribute('x2', this.reqX);
            reqBltLine.setAttribute('y2', this.svgH);

            resLine.setAttribute('x1', this.resX);
            resLine.setAttribute('y1', this.startX);
            resLine.setAttribute('x2', this.resX);
            resLine.setAttribute('y2', this.svgH);

            resBltLine.setAttribute('x1', this.resX);
            resBltLine.setAttribute('y1', this.bulletPathY);
            resBltLine.setAttribute('x2', this.svgW);
            resBltLine.setAttribute('y2', this.bulletPathY);
        };

        reqCount() {
            totalTextWrap.setAttribute('x', this.totalCountX);
            totalTextWrap.setAttribute('y', this.totalFontY);

            totalCount.innerHTML = this.count().nor + this.count().war + this.count().cri;

            reqTextWrap.setAttribute('x', this.reqCountX);
            reqTextWrap.setAttribute('y', this.reqFontY);

            reqCount.innerHTML = g.reqCount;
        };

        excuCount() {
            norTextWrap.setAttribute('x', this.norCountX);
            norTextWrap.setAttribute('y', this.excuFontY);
            
            warTextWrap.setAttribute('x', this.warCountX);
            warTextWrap.setAttribute('y', this.excuFontY);
            
            criTextWrap.setAttribute('x', this.criCountX);
            criTextWrap.setAttribute('y',this.excuFontY);

            norCount.innerHTML = this.count().nor;
            warCount.innerHTML = this.count().war;
            criCount.innerHTML = this.count().cri;
        };

        resCount() {
            resTextWrap.setAttribute('x', this.resCountX);
            resTextWrap.setAttribute('y', this.resFontY);
 
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

        g.excutePerSec = Math.floor(1000 / term);
        runCycle = g.excutePerSec / 5; // 1초에 5번 실행

        if(i % runCycle < 1) {
            animation.addDatas();
            animation.excuteRuntime();
        };
    
        background.render();
        animation.render();

        if(i >= g.excutePerSec) {
            i = 0;
        };

        requestAnimationFrame(render);
    };
    
    render();
};

script();
