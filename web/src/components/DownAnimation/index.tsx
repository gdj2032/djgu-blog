import DownMoveItem from "./DownMoveItem";

export interface IDownAnimationProps {
  // 最大数量 默认 20
  max?: number;
  // 坠落速度 默认 1
  speed?: number;
  // 大小 默认 20
  size?: number;
}

class DownAnimation {

  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D;
  private data: DownMoveItem[]

  // private requestAnimationFrame = window.requestAnimationFrame ||
  //   window.mozRequestAnimationFrame ||
  //   window.webkitRequestAnimationFrame ||
  //   window.msRequestAnimationFrame ||
  //   window.oRequestAnimationFrame ||
  //   function (callback) { setTimeout(callback, 1000 / 60); };

  // private cancelAnimationFrame = window.cancelAnimationFrame ||
  //   window.mozCancelAnimationFrame ||
  //   window.webkitCancelAnimationFrame ||
  //   window.msCancelAnimationFrame ||
  //   window.oCancelAnimationFrame;
  private max: number;
  private speed: number;
  private size: number;
  private loop: number;

  constructor(props?: IDownAnimationProps) {
    const { max = 20, speed = 1, size = 20 } = props || {};
    this.max = max;
    this.speed = speed;
    this.size = size;
    this.createCanvas()
  }

  // 初始化画布
  private createCanvas() {
    const canvasDom = document.createElement("canvas");
    canvasDom.id = "down-animation";
    canvasDom.width = window.innerWidth;
    canvasDom.height = document.body.clientHeight;
    canvasDom.setAttribute("style", "position:absolute; top: 0; left: 0; z-index: 1; pointer-events: none;");
    document.getElementsByTagName("body")[0].appendChild(canvasDom);
    this.canvas = canvasDom;
    this.ctx = canvasDom.getContext("2d");
    /* 窗口大小改变的处理 */
    window.onresize = function () {
      canvasDom.width = window.innerWidth;
      canvasDom.height = window.innerHeight
    }
  }

  // 初始化数据
  private createData() {
    const max = this.max, data: DownMoveItem[] = [], canvas = this.canvas;
    for (var i = 0; i < max; i++) {
      data.push(new DownMoveItem({
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        size: this.size,
        speed: this.speed,
        canvas: this.canvas,
      }))
    }
    this.data = data;
  }

  // 移动
  private drawMoving() {
    const maxFlake = this.max, flakes = this.data, ctx = this.ctx, canvas = this.canvas, that = this;
    /* 清空 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let e = 0; e < maxFlake; e++) {
      flakes[e].update();
      flakes[e].render(ctx);
    }
    /*  一帧一帧的画 */
    this.loop = requestAnimationFrame(function () {
      that.drawMoving.apply(that);
    });
  }

  start() {
    this.createCanvas()
    this.createData()
    this.drawMoving()
  }
}

export default DownAnimation;
