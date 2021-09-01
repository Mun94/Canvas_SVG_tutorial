const canvas = () => {
    const canvas = document.querySelector('.normalCanvas');
    const ctx = canvas.getContext('2d');

    const g = {
        x : 40,
        xSpeed: 3,
    };
    ctx.lineWidth = 1;

    const animation = () => {
        if(g.x > 300) {
            g.xSpeed = -3
        };

        if(g.x < 40) {
            g.xSpeed = 3
        };

        ctx.beginPath();
        ctx.arc(g.x += g.xSpeed, 150, 10, 0, Math.PI * 2);
        ctx.stroke();
    };

    const render = () => {
        ctx.clearRect(20,20,300,300);

        animation();

        requestAnimationFrame(render);
    };

    ctx.fillStyle = '#6495ED';
    ctx.font = 'italic bold 25px Arial, sans-self';
    ctx.fillText('normal canvas', 20, 20);

    ctx.strokeRect(20, 20, 300, 300);
    
    render();
};

canvas();
