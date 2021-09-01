const worker = () => {
    if(window.Worker) {
    const canvas = document.querySelector('.offscreenCanvas');
    const offscreen = canvas.transferControlToOffscreen();

    const wk = new Worker('./js/offscreencanvas.js');

    wk.postMessage({canvas: offscreen}, [offscreen]);
    } else {
        console.error('worker 지원 x');
    };
};

worker();