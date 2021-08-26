const script = () => {
    const g = {
        // svgWrap   : undefined,

        reqLine   : undefined,
        reqBltLine: undefined, // bullet path
        resLine   : undefined,
        resBltLine: undefined, // bullet path

        reqWrap   : undefined
    };

    const svgWrap = document.querySelector('.svgWrap');
    g.reqLine     = svgWrap.querySelector('.reqLine');
    g.reqBltLine  = svgWrap.querySelector('.reqBltLine');
    g.resLine     = svgWrap.querySelector('.resLine');
    g.resBltLine  = svgWrap.querySelector('.resBltLine');
    
    g.reqWrap     = svgWrap.querySelector('.reqWrap');

    const setAttribute = (el, obj) => {
        if(!el) { return; };

        for(let [key, value] of Object.entries(obj)) {
            el.setAttribute(key, value)
        };
    };
    class Position {
        constructor(aniPosition) {
            this.svgW = svgWrap.getAttribute('width');
            this.svgH = svgWrap.getAttribute('height');

            this.startX = 0;
            this.startY = 120;

            this.bulletPathY = 240;
            this.bulletRadius = 20;

            this.area = this.svgW / 3;

            if(aniPosition) {
                // line 그리는데 필요한 위치 조건 (startX, startY, bulletPathY 도 필요함)
                this.reqLineX = this.area; // req, excu, res 3 구간으로 나눔
                this.reqLineY = this.svgH;
                // this.reqBltLineX = g.svg
                this.reqBltLineX = this.area;

                this.resLineX = this.area * 2;
                this.resLineY = this.svgH;
            };
        };
    };
    class SetDatas extends Position {
        constructor() {
            const needAniPosition = false;
            super(needAniPosition);
            // const needAniPosition = true;
            // super(needAniPosition);
    
            const dataPerSec = 20; // 1 초 당 20 개
            const sec        = 0.2; // 0.2 초
    
            this.datas       = [];
            this.dataPerReq  = dataPerSec * sec; // 0.2초 마다 발생 할 요청에 생성 될 데이터 수

            // this.addDatas();
        };

        addDatas() {
            const speed = Number(Math.random().toFixed(1)) || 0.1;

            for(let i = 0; i < this.dataPerReq; i++) {
                const runtime = Math.ceil(Math.random() * 10);

                this.datas.push({
                    colorByRuntime: runtime,
                    runtime,

                    dur        : (speed*10),
                    // repeatCount: 0,
                    // from       : this.startX,
                    // to         : this.area  
                });
            };
        };
    };

    class Animation extends SetDatas {
        constructor() { 
            super();

            window.setTimeout(() => this.reqAni(),1000)
        };

        reqAni() {

            let el = '';
            for(let data of this.datas) {
                el += `
                <circle cx = ${this.startX-20} cy = ${this.bulletPathY} r = ${this.bulletRadius} fill = "blue">
                    <animate attributeName = "cx" from = "-20" to = "400" dur = ${data.dur} repeatCount = "indefinite">
                </circle>
                `
            //     const createCircleEl = document.createElement('circle');
            //         setAttribute(createCircleEl, 
            //             {'cx':0, 'cy':240, 'r':20, 'fill': 'blue', 'class': 'circle' + i});

            //         g.reqWrap.appendChild(createCircleEl);
            //         i++
            };
            g.reqWrap.innerHTML = el;
        };

         // let i = 0;
            //      for(let data of this.datas) {
            //         const createCircleEl = document.createElement('circle');
            //         setAttribute(createCircleEl, 
            //             {'cx':0, 'cy':240, 'r':20, 'fill': 'blue', 'class': 'circle'+i});

            //         g.reqWrap.appendChild(createCircleEl);

            //         const test = document.querySelector('.circle'+i);

            //         const bbb =test.getAttribute('cx');

            //         let ccc = 0 ;
            //         if( Number(bbb) < 400){
            //             ccc = Number(bbb)+1
            //             test.setAttribute('cx', ccc)
            //         }
            //         i++
            //     //     const aaa = document.querySelector('.test');
            //     //     const bbb = aaa.getAttribute('cx')
            //     //     let ccc = 0;
            //     //     if( Number(bbb) < 400){
            //     //         ccc = Number(bbb)+1
            //     //         aaa.setAttribute('cx', ccc)
            //     //     }
            //     //  };
            // }

        // render() {
        //     this.reqAni()
        // }
    };
    const animation = new Animation();
    class Background extends Position{
        constructor() {
            const needAniPosition = true;
            super(needAniPosition);
        };

        line() { 
            setAttribute(g.reqLine, 
                {'x1': this.reqLineX, 'y1': this.startY, 'x2': this.reqLineX, 'y2': this.reqLineY});
            setAttribute(g.reqBltLine, 
                {'x1': this.startX, 'y1': this.bulletPathY, 'x2': this.reqBltLineX, 'y2': this.bulletPathY});
            
            setAttribute(g.resLine, 
                {'x1': this.resLineX, 'y1': this.startY, 'x2': this.resLineX, 'y2': this.resLineY});
            setAttribute(g.resBltLine,
                {'x1': this.resLineX, 'y1':this.bulletPathY, 'x2': this.svgW, 'y2': this.bulletPathY})

        };

        render() {
            this.line();
        };
    };
    const background = new Background();

    let i = 0;
    const render = () => {
        i++;

        if(i % 12 === 0) {
            animation.addDatas();
        };

        background.render();
        // animation.render();

        if(i === 60) {
            i = 0;
        };

        requestAnimationFrame(render)
    };

    render();
}

script();
