class DrawToolbar {
    constructor(canvas, ctx) {
        this.strokeColor = 'red';	//默认选中红色触发颜色
        this.fillColor = 'green';	//默认选中绿色填充色
        this.style = 'tablet';	//默认选中直线形状
        this.type = 'stroke';	//默认的绘制方式是划
        this.ctx = ctx;	//默认为绘图环境
        this.canvas = canvas;		//默认画布
        this.canvasW = canvas.width;	//默认画布宽
        this.canvasH = canvas.height;		//默认画布高
        this.history = [];	//默认的历史记录为数组
        this.edges = '3';	//默认的边数为3
    }

    //	绘画初始化
    init() {
        // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式。
        this.ctx.strokeStyle = this.strokeColor;
        // fillStyle 属性设置或返回用于填充绘画的颜色、渐变或模式。
        this.ctx.fillStyle = this.fillColor;
    }

    //	绘制直线
    drawLine(x1, y1, x2, y2) {
        // beginPath() 方法开始一条路径，或重置当前的路径
        this.ctx.beginPath();
        // moveTo() 方法可把窗口的左上角移动到一个指定的坐标。
        this.ctx.moveTo(x1 - 0.5, y1 - 0.5);
        // lineTo() 方法添加一个新点，然后创建从该点到画布中最后指定点的线条（该方法并不会创建线条）。
        this.ctx.lineTo(x2 - 0.5, y2 - 0.5);
        // closePath() 方法创建从当前点到开始点的路径。
        this.ctx.closePath();
        // stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
        this.ctx.stroke();
    }

    //绘制矩形
    drawRect(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.rect(x1 - 0.5, y1 - 0.5, x2 - x1, y2 - y1);
        this.ctx.closePath();
        this.ctx[this.type]();
    }

    //	绘制写字板
    drawTablet(x2, y2) {
        this.ctx.lineTo(x2, y2);
        this.ctx[this.type]();
    }

    //	橡皮擦
    eraser(x2, y2) {
        this.ctx.clearRect(x2, y2, 10, 10);
    }
    //	保存
    save() {
        location.href = this.canvas.toDataURL().replace('image/png', 'image/stream');
    }
    //	撤回
    withdraw() {
        if (this.history.length == 0) {
            return;
        }
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        this.history.pop();
        if (this.history.length == 0) {
            return;
        }
        this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
    }
    // 绘制函数
    drawing() {
        var that = this;
        // 鼠标移动画布的函数
        this.canvas.onmousedown = function (e) {
            // 获取鼠标起始位置
            // 获取鼠标到时间源的宽度
            var sx = e.offsetX;
            // 获取鼠标到时间源的高度
            var sy = e.offsetY;
            //初始化样式
            that.init();
            if (that.style == 'drawTablet') {
                // beginPath() 方法开始一条路径，或重置当前的路径
                that.ctx.beginPath();
                // moveTo() 方法可把窗口的左上角移动到一个指定的坐标。
                that.ctx.moveTo(sx, sy);
            }
            // 获取鼠标移动时的坐标
            this.onmousemove = function (e) {
                var mx = e.offsetX;
                var my = e.offsetY;
                if (that.style != 'eraser') {
                    that.ctx.clearRect(0, 0, that.canvasW, that.canvasH);
                    // 清除鼠标在画布移动的填充色
                    if (that.history.length > 0) {	// 注：只能是that.history数组的长度大于0，才可以putImageData()
                        that.ctx.putImageData(that.history[that.history.length - 1], 0, 0);
                        // putImageData() 方法将图像数据（从指定的 ImageData 对象）放回画布上。
                    }
                }
                that[that.style](sx, sy, mx, my);
            };
            // 获取鼠标移走的坐标
            this.onmouseup = function () {
                // getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。
                that.history.push(that.ctx.getImageData(0, 0, that.canvasW, that.canvasH));
                // 清空鼠标移动事件
                this.onmousemove = null;
                // 清空鼠标移出事件
                this.onmouseup = null;
            };
        };
    }
}
export default DrawToolbar;