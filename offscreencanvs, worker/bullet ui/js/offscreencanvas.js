onmessage = e => {
    const { offscreen, colorData, g } = e.data;
    const bulletCtx = offscreen.getContext('2d');
    
    const timeCondition = data => {
        return {
            nor: data.colorByRuntime >= 1 && data.colorByRuntime <= 3,
            war: data.colorByRuntime > 3 && data.colorByRuntime <= 5,
            cri: data.colorByRuntime > 5  && data.colorByRuntime <= 10
        };
    };

    class Position{
        constructor() {
            this.canvasW = offscreen.width;
            this.canvasH = offscreen.height;
    
            this.bulletPathY = 240;
    
            this.reqX = this.canvasW / 3;
            this.resX = this.canvasW * (2 / 3);
    
            this.startX = 0;
            this.startY = 120;
    
            this.area = this.canvasW / 3;

            this.arcRadius = 15;

            this.tailSize = 150;

            this.reqEndX     = this.reqX    - this.arcRadius;
            this.excuStartX  = this.reqX    + this.arcRadius;
            this.excuEndY    = this.canvasH - this.arcRadius;
            this.resStartX   = this.resX    + this.arcRadius
        };
    };
    class SetDatas extends Position {
        constructor() {
            super();

            const dataPerSec = 20;
            const sec        = 0.2;

            this.datas      = [];
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
                    y: this.bulletPathY
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
            this.excuAni();
            this.resAni();
        };

        reqAni() {
            g.reqCount = this.datas.length * this.dataPerReq;

            if(!this.datas.length) { return; };

            for(let data of this.datas) {
                this.createBullet(colorData.nor, data[0], 'reqArea');
            };

            for(let i = 0; i < this.datas.length; i++) {
                const data = this.datas[i];

                if(data[0].x > this.reqEndX) {
                    data.forEach(d => {
                        const { colorByRuntime, runtime, speed } = d;

                        const randomX = Math.random() * (this.area - (this.arcRadius * 2));
                        const randomY = Math.random() * (this.excuEndY - this.startY);
                        const randomExSpeed = (Number(Math.random().toFixed(1)) || 0.1);
                        const randomEySpeed = (Number(Math.random().toFixed(1)) || 0.1);
                        
                        this.excuDatas.push({
                            colorByRuntime,
                            runtime,
                            speed,

                            ex: this.excuStartX + randomX,
                            ey: this.startY + randomY,
                            exSpeed: Math.sign(Math.random() - 0.5) * randomExSpeed,
                            eySpeed: Math.sign(Math.random() - 0.5) * randomEySpeed,

                            opacity: 0
                        });
                    });
                    
                    this.datas.splice(i, 1);
                };
            };
        };

        excuAni() {
            g.dataCount = this.excuDatas;

            if(!this.excuDatas.length) { return; };

            const bounce = data => {
                if(data.ex >= (this.resX - this.arcRadius) || 
                data.ex <= this.excuStartX) {
                    data.exSpeed = -data.exSpeed;
                };

                if(data.ey >= this.excuEndY || 
                    data.ey <= (this.startY + this.arcRadius)) {
                        data.eySpeed = -data.eySpeed;
                };
            };

            for(let data of this.excuDatas) {
                this.createBulletByRuntime(data, bounce);
            };
        };

        resAni() {
            g.resCount = this.resDatas.reduce((cur, val) => cur + val.resBulletCount, 0);

            if(!this.resDatas.length) { return; };

            for(let data of this.resDatas) {
                this.createBulletByRuntime(data);
            };

            this.resDatas = this.resDatas.filter(data => data.rx < this.canvasW);
        };

        createBulletByRuntime(data, bounceFn) {
            const area = bounceFn ? 'excuArea' : 'resArea';

            const bullet = color => {
                this.createBullet(color, data, area);
                
                bounceFn && bounceFn(data);
            };

            if(timeCondition(data).cri) {
                bullet(colorData.cri);
            } else if(timeCondition(data).war) {
                bullet(colorData.war);
            } else if(timeCondition(data).nor) {
                bullet(colorData.nor);
            } else {
                alert('check colorByRuntime');
            };
        };

        createBullet(color, data, area) {
            const bulletGradation = (move, y, opacity) => {
                const grad = bulletCtx.createRadialGradient(move, y, 0, move, y, this.arcRadius);
                grad.addColorStop(0, colorData.background);
                if(area === 'excuArea') {
                    grad.addColorStop(1, this.setOpacity(color, opacity));
                } else {
                    grad.addColorStop(1, color);
                };

                return grad;
            };

            const bullet = (move, y, opacity) => {
                bulletCtx.beginPath();
                bulletCtx.fillStyle = bulletGradation(move, y, opacity);
                bulletCtx.arc(move, y, this.arcRadius, 0, Math.PI * 2);
                bulletCtx.fill();
            }; 

            const tailGradation = x => {
                const tailGrad = bulletCtx.createLinearGradient(x - this.tailSize, this.bulletPathY, x, this.bulletPathY);
                tailGrad.addColorStop(0, colorData.gradation);
                tailGrad.addColorStop(0.5, colorData.background);
                tailGrad.addColorStop(1, color);

                return tailGrad;
            };

            const tail = x => {
                bulletCtx.beginPath();
                bulletCtx.moveTo(x, this.bulletPathY + this.arcRadius);
                bulletCtx.fillStyle = tailGradation(x);
                bulletCtx.quadraticCurveTo(x - this.tailSize, this.bulletPathY, x,  this.bulletPathY - this.arcRadius);
                bulletCtx.fill();
            };

            switch(area) {
                case 'reqArea':
                    const reqMove = data.x += data.speed;

                    tail(reqMove);

                    bullet(reqMove, data.y);
                    break;
                case 'excuArea':
                    const excuMove  = data.ex += data.exSpeed;
                    const excuMoveY = data.ey += data.eySpeed;

                    let opacity;
                    if(data.opacity < 1) {
                        const increase = 0.04;
                        opacity = data.opacity += increase;
                    };

                    bullet(excuMove, excuMoveY, opacity || 1);
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

        setOpacity(color, a) {
            switch(color) {
                case colorData.nor:
                    return `rgba(77, 139, 213, ${a})`;
                case colorData.war:
                    return `rgba(184, 166, 5, ${a})`;
                case colorData.cri:
                    return `rgba(180, 14, 10, ${a})`;
                default:
                    break;
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
        };
    };
    const animation = new Animation();

    let i = 0;
    let runCycle = 0;

    let beforeSec = 0;
    let term = 0;
    const render = () => {
        i++;
        bulletCtx.clearRect(0, 0, 1200, 300);
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

        postMessage({ g });
        animation.render();

        requestAnimationFrame(render);
    };

    render();
};adasdasd