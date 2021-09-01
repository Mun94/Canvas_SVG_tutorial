const offscreenCanvas = () => {
    const canvas = document.querySelector('.offscreenCanvas');
    const offscreen = canvas.transferControlToOffscreen();
    
    const worker = new  Worker('worker.js');

    worker.postMessage({canvas: offscreen}, [offscreen]);
};

offscreenCanvas();