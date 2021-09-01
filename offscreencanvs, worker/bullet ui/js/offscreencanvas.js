onmessage = (e) => {
    const { canvas } = e.data;
    const ctx = canvas.getContext('2d');

    console.log(canvas);
};