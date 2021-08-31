onmessage = function(e) {
    console.log('worker: message received from main script');

    const result = e.data[0] * e.data[1];

    if(isNaN(result)) {
        postMessage('please write two numbers');
    } else {
        const workerResult = 'result:' + result;

        console.log('worker: posting message back to main script');
        postMessage(workerResult);
    };
};