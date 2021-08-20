const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

class SetDatas{
    constructor(){
        this.datas = [];
        this.dataPerSec = 20;

        this.addDatas();
    };

    addDatas(){
        for(let i = 0; i < this.dataPerSec; i++) {
            const speed = Number(Math.random().toFixed(1)) || 0.1;
            this.datas.push({
                runTime: Math.ceil(Math.random() * 10),
                speed: speed,
                x: 0,
                mx: 300+(Math.random()*100),
                my: Math.random()*100,
                mxSpeed: speed,
                mySpeed: speed
            });
        };
    };
};

const setDatas = new SetDatas();

const middleDatas = [];

const background = () => {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, 900, 200);

    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 200);
    ctx.moveTo(600, 0);
    ctx.lineTo(600, 200);
    ctx.moveTo(0, 120);
    ctx.lineTo(900, 120);
    ctx.stroke();
};

const animate = () => {
    for(let data of setDatas.datas) {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(data.x += data.speed , 120, 20, 0, Math.PI * 2);
        ctx.fill();
        
        if(data.x > (300 - 20)) {
            middleDatas.push(data);
            setDatas.datas = setDatas.datas.filter(data => data.x < (300 - 20)); // 원의 지름 뺌
        };
    };
};

const animate2 = () => {
    if(middleDatas.length) {
        for(let data of middleDatas) {
            if(data.runTime >= 1 && data.runTime < 3){
                ctx.beginPath();
                ctx.fillStyle = 'blue';
                ctx.arc(data.mx += data.mxSpeed , data.my += (data.mySpeed * 0.1), 20, 0, Math.PI * 2);
                ctx.fill();

                if(data.mx >= 600) {
                    data.mxSpeed = -data.mxSpeed;
                };
                if(data.mx <= 300){
                    data.mxSpeed = Math.abs(data.mxSpeed);
                };

                if(data.my >= 200 ) {
                    data.mySpeed = -data.mySpeed
                };
                
                if(data.my <= 0 ) {
                    data.mySpeed = Math.abs(data.mySpeed);
                };

                data.mx += data.mxSpeed
                data.my += data.mySpeed
            };

            if(data.runTime >= 3 && data.runTime <= 5){
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                ctx.arc(data.mx += data.mxSpeed , data.my += (data.mySpeed * 0.1), 20, 0, Math.PI * 2);
                ctx.fill();

                if(data.mx >= 600) {
                    data.mxSpeed = -data.mxSpeed;
                };
                if(data.mx <= 300){
                    data.mxSpeed = Math.abs(data.mxSpeed);
                };

                if(data.my >= 200 ) {
                    data.mySpeed = -data.mySpeed
                };

                if(data.my <= 0 ) {
                    data.mySpeed = Math.abs(data.mySpeed);
                };

                data.mx += data.mxSpeed
                data.my += data.mySpeed
            };

            if(data.runTime > 5 && data.runTime <= 10){
                ctx.beginPath();
                ctx.fillStyle = 'red';
                ctx.arc(data.mx += data.mxSpeed , data.my += (data.mySpeed * 0.1), 20, 0, Math.PI * 2);
                ctx.fill();

                if(data.mx >= 600) {
                    data.mxSpeed = -data.mxSpeed;
                };
                if(data.mx <= 300){
                    data.mxSpeed = Math.abs(data.mxSpeed);
                };

                if(data.my >= 200 ) {
                    data.mySpeed = -data.mySpeed
                };

                if(data.my <= 0 ) {
                    data.mySpeed = Math.abs(data.mySpeed);
                };

                data.mx += data.mxSpeed
                data.my += data.mySpeed
            };
        };
    };
}

const main = () => {
    background();
    animate()
    animate2();
    requestAnimationFrame(main);
};

main();
