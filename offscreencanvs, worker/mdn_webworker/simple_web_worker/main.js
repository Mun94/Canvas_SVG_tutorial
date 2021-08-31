const first = document.querySelector('#number1');
const second = document.querySelector('#number2');

const result = document.querySelector('.result');

if(window.Worker) {
    const myWorker = new Worker('worker.js');

    first.onchange = function() {
        myWorker.postMessage([first.value, second.value]);
        console.log('message posted to worker');
    };

    second.onchange = function() {
        myWorker.postMessage([first.value, second.value]);
        console.log('message posted to worker');
    };

    myWorker.onmessage = function(e) {
        result.textContent = e.data;
        console.log('message received from worker');
    };
} else {
    console.error('웹 워커 지원 x');
};