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

    const timeCondition = data => {
        return {
            nor: data.colorByRuntime >= 1 && data.colorByRuntime <= 3,
            war: data.colorByRuntime > 3 && data.colorByRuntime <= 5,
            cri:  data.colorByRuntime > 5  && data.colorByRuntime <= 10
        };
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

                this.reqEndX = this.reqX - this.arcDiameter
            };
        };
    };

    class FontPosition extends Position {
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);

            this.startRectX = 0;
            this.startRectY = 0;

            this.lineTick = 1;
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
            if(!this.datas.length) { return; };

            for(let i = 0; i < this.datas.length; i++) {
                const data = this.datas[i];

                this.createBullet(colorData.nor, data[0], 'reqArea');

                if(data[0].x > this.reqEndX) {
                    data.forEach(d => {
                        const {colorByRuntime, runtime, speed} = d;

                        const randomX = Math.random() * (this.area - (this.arcDiameter * 2));
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
                            eySpeed: Math.sign(Math.random() - 0.5) * randomEySpeed
                        });
                    });
                    this.datas.splice(i, 1);
                };
            };
        };

        excuAni() {
            if(!this.excuDatas.length) { return; };
            console.log(this.excuDatas);
            const bounce = data => {
                if(data.ex >= (this.resX - this.arcDiameter)) {
                    data.exSpeed = -data.exSpeed;
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
                this.createBulletByRuntime(data, bounce);
            };
        };

        createBulletByRuntime(data, bounceFn) {
            const area = bounceFn ? 'excuArea' : 'resArea';

            const bullet = color => {
                this.createBullet(color, data, area);
                console.log(data);
                bounceFn && bounce();
            };

            if(timeCondition(data),cri) {
                bullet(colorData.cri);

            } else if(timeCondition(data).war) {
                bullet(colorData.war);

            } else if(timeCondition(data).nor) {
                bullet(colorData.nor);

            } else {
                console.log('check colorByRuntime');
            };
        };

        createBullet(color, data, area) {
            // area별로 분리
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(data.x += data.speed, data.y, this.arcDiameter, 0, Math.PI * 2);
            ctx.fill();
        };
    };
    const animation = new Animation();
    class Background extends FontPosition {
        constructor() {
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
        animation.render();
        
        requestAnimationFrame(render);
    };
    animation.addDatas(); // 나중에 requestAnimationFrame에 들여놔야 함

    render();
};