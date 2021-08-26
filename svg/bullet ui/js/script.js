const script = () => {
    const g = {
        // svgWrap   : undefined,

        reqLine   : undefined,
        reqBltLine: undefined, // bullet path
        resLine   : undefined,
        resBltLine: undefined // bullet path
    };

    const svgWrap = document.querySelector('.svgWrap');
    g.reqLine     = svgWrap.querySelector('.reqLine');
    g.reqBltLine  = svgWrap.querySelector('.reqBltLine');
    g.resLine     = svgWrap.querySelector('.resLine');
    g.resBltLine  = svgWrap.querySelector('.resBltLine');
    
    class Position {
        constructor() {
            this.svgW = svgWrap.getAttribute('width');
            this.svgH = svgWrap.getAttribute('height');

            this.startX = 0;
            this.startY = 120;

            this.bulletPathY = 240;

            this.area = this.svgW / 3;

            // line 그리는데 필요한 위치 조건 (startX, startY도 필요함)
            this.reqLineX = this.area; // req, excu, res 3 구간으로 나눔
            this.reqLineY = this.svgH;
            // this.reqBltLineX = g.svg
            this.reqBltLineX = this.area;

            this.resLineX = this.area * 2;
            this.resLineY = this.svgH;
        };
    };
    class Background extends Position{
        constructor() {
            super();
        }

        line() { 
            this.setAttribute(g.reqLine, 
                {'x1': this.reqLineX, 'y1': this.startY, 'x2': this.reqLineX, 'y2': this.reqLineY});
            this.setAttribute(g.reqBltLine, 
                {'x1': this.startX, 'y1': this.bulletPathY, 'x2': this.reqBltLineX, 'y2': this.bulletPathY});
            
            this.setAttribute(g.resLine, 
                {'x1': this.resLineX, 'y1': this.startY, 'x2': this.resLineX, 'y2': this.resLineY});
            this.setAttribute(g.resBltLine,
                {'x1': this.resLineX, 'y1':this.bulletPathY, 'x2': this.svgW, 'y2': this.bulletPathY})

        };

        setAttribute(el, obj) {
            if(!el) { return; };

            for(let [key, value] of Object.entries(obj)) {
                el.setAttribute(key, value)
            };
        };

        render() {
            this.line();
        };
    }
    const background = new Background();

    const render = () => {
        background.render();
    };

    render();
}

script();
