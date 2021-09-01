const button = document.querySelector('.overload');

button.addEventListener('click', () => {
    let time = new Date();
    let ms = (new Date()).getMilliseconds();

    console.log((new Date()) - time);
    console.log(ms);
    
    while((new Date()) - time <= ms){};
});