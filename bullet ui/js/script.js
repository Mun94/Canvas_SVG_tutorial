// const canvas = document.querySelector('.myCanvas');

// const ctx = canvas.getContext('2d');

// class SetDatas{
//     constructor(){
//         this.datas = [];
//         this.dataPerSec = 4; // 초당 몇 개 생성 할 지

//         setInterval(() => this.addDatas(), 1000); // 지금 10초당 4개 생성 됨
//         this.addDatas();
//     };

//     addDatas(){
//         const speed = Number(Math.random().toFixed(1)) || 0.1; // 한 번에 생성되는 4개의 데이터가 모두 같은 속도 임 각각 속도 랜덤하게 할거면 반복문 안으로!
//         for(let i = 0; i < this.dataPerSec; i++) {
//             const runTime = Math.ceil(Math.random() * 10);
//             this.datas.push({
//                 colorByRunTime: runTime,
//                 runTime,
//                 speed: speed,
//                 x: 0,
//                 y: 120,

//                 mx: 320 + (Math.random() * 200),
//                 my: 20 + Math.random() * 150,
//                 mxSpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,
//                 mySpeed: Math.sign(Math.random() - 0.5) > 0 ? speed : -speed,

//                 rx: 620,
//                 ry: 120
//             });
//         };
//     };
// };

// const setDatas = new SetDatas();

// class Animation extends SetDatas {
//     constructor(){
//         super();
        
//         this.middleDatas = [];
//         this.rightDatas = [];

//         this.test = 620;
//     };

//     animationLeft() {
//         for(let data of this.datas) {
//             ctx.beginPath();
//             ctx.fillStyle = 'blue';
//             ctx.arc(data.x += data.speed , data.y, 20, 0, Math.PI * 2);
//             ctx.fill();
            
//             if(data.x > (300 - 20)) {
//                 this.middleDatas.push(data);

//                 this.datas = this.datas.filter(data => data.x < (300 - 20)); // 원의 지름 뺌
//             };
//         };
//     };

//     animationMiddle() {
//         if(!this.middleDatas.length) { return; };

//         const bounce = data => {
//             if(data.mx >= (600 - 20)) {
//                 data.mxSpeed = -data.mxSpeed;
//             };
//             if(data.mx <= (300 + 20)){
//                 data.mxSpeed = Math.abs(data.mxSpeed);
//             };
    
//             if(data.my >= (200 - 20)) {
//                 data.mySpeed = -data.mySpeed
//             };
            
//             if(data.my <= (0 + 20)) {
//                 data.mySpeed = Math.abs(data.mySpeed);
//             };
//         };

//         const createMiddleBullet = (color, data) => {
//             ctx.beginPath();
//             ctx.fillStyle = color;
//             ctx.arc(data.mx += data.mxSpeed , data.my += data.mySpeed, 20, 0, Math.PI * 2);
//             ctx.fill();
//         };
    
//         for(let data of this.middleDatas) {
//             if(data.colorByRunTime >= 1 && data.colorByRunTime < 3){
//                 createMiddleBullet('blue', data);

//                 bounce(data);
//             };

//             if(data.colorByRunTime >= 3 && data.colorByRunTime <= 5){
//                 createMiddleBullet('yellow', data);

//                 bounce(data);
//             };

//             if(data.colorByRunTime > 5 && data.runTime <= 10){
//                 createMiddleBullet('red', data);

//                 bounce(data);
//             };
//         };
//     };

//     excuteRuntime() {
//         if(!this.middleDatas.length) { return; };
//         this.middleDatas.forEach(data => data.runTime--);

//         console.log('this.rightData',this.middleDatas.filter(data => data.runTime <= 0))
//         this.rightDatas.push(this.middleDatas.filter(data => data.runTime <= 0));

//         this.middleDatas = this.middleDatas.filter(data => data.runTime > 0);
        
        
//         // console.log(this.rightDatas)
//         // console.log(this.middleDatas.map(a => a.runTime))
//     };

//     animationRight() {
//         // if(!this.rightDatas.length) { return; };
        
//         // // for(let data of this.rightDatas) {
//         //     // this.rightDatas.shift();
//         //     const top = {
//         //         colorByRunTime: 4,
//         //         mx: 564.5620444180074,
//         //         mxSpeed: -0.6,
//         //         my: 134.8377823090957,
//         //         mySpeed: -0.6,
//         //         runTime: 0,
//         //         rx: 620.6,
//         //         ry: 120,
//         //         speed: 0.6,
//         //         x: 280.1999999999992
//         //     };
//         //     console.log('top', top)
//         //     if(!top) { return; };

//         //     ctx.beginPath();
//         //     ctx.fillStyle = 'pink';
//         //     ctx.arc(top.rx += top.speed , 120, 20, 0, Math.PI * 2);
//         //     ctx.fill();
//         // };
        
            
            
//         // ctx.beginPath();
//         // ctx.fillStyle = 'pink';
//         // ctx.arc(this.test++ , 120, 20, 0, Math.PI * 2);
//         // ctx.fill();
//     };

//     render() {
//         this.animationLeft();
//         this.animationMiddle();
//         this.animationRight();
//     };
// };

// const background = () => {
//     ctx.fillStyle = 'gray';
//     ctx.fillRect(0, 0, 900, 200);

//     ctx.beginPath();
//     ctx.moveTo(300, 0);
//     ctx.lineTo(300, 200);
//     ctx.moveTo(600, 0);
//     ctx.lineTo(600, 200);
//     ctx.moveTo(0, 120);
//     ctx.lineTo(900, 120);
//     ctx.stroke();
// };

// const animation = new Animation();

// setInterval(function(){ animation.excuteRuntime() }, 1000);

// const init = () => {
//     background();
//     animation.render();
//     requestAnimationFrame(init);
// };

// init();

const canvas = document.querySelector('.myCanvas2');

const ctx = canvas.getContext('2d');

let aa = 0;
let topss = 0;
const main = () => {
    // const ty = snow.y += snow.size * 0.5;
    console.log('123123123');
  
    ctx.beginPath();
    ctx.arc(topss , 120, 20, 0, Math.PI * 2);
    topss++

    
};

setInterval(main, 30)