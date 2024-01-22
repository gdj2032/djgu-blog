export interface IDownMoveItemProps {
  canvasWidth: number;
  canvasHeight: number;
  size: number;
  speed: number;
  canvas: HTMLCanvasElement
}

export default class DownMoveItem {
  x: number;
  y: number;
  size: number;
  maxSize: any;
  speed: any;
  fallSpeed: any;
  velY: any;
  velX: number;
  stepSize: number;
  step: number;
  canvas: HTMLCanvasElement
  constructor(props: IDownMoveItemProps) {
    const { canvasWidth, canvasHeight, size, speed, canvas } = props;
    this.x = Math.floor(Math.random() * canvasWidth);   /* x坐标 */
    this.y = Math.floor(Math.random() * canvasHeight);  /* y坐标 */
    this.size = Math.random() * props.size + 2;          /* 形状 */
    this.maxSize = size;                           /* 最大形状 */
    this.speed = Math.random() * 1 + speed;         /* 坠落速度 */
    this.fallSpeed = speed;                         /* 坠落速度 */
    this.velY = this.speed;                             /* Y方向速度 */
    this.velX = 0;                                      /* X方向速度 */
    this.stepSize = Math.random() / 30;                 /* 步长 */
    this.step = 0                                       /* 步数 */
    this.canvas = canvas;
  }

  update() {
    /* 左右摆动(余弦) */
    this.velX *= 0.98;
    if (this.velY <= this.speed) {
      this.velY = this.speed
    }
    this.velX += Math.cos(this.step += .05) * this.stepSize;

    this.y += this.velY;
    this.x += this.velX;
    /* 飞出边界的处理 */
    if (this.x >= this.canvas.width || this.x <= 0 || this.y >= this.canvas.height || this.y <= 0) {
      this.reset(this.canvas.width, this.canvas.height)
    }
  };

  /* 飞出边界-放置最顶端继续坠落 */
  reset(width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = 0;
    this.size = Math.random() * this.maxSize + 2;
    this.speed = Math.random() * 1 + this.fallSpeed;
    this.velY = this.speed;
    this.velX = 0;
  };

  // 渲染-随机形状（此处可修改雪花颜色！！！）
  async render(ctx: CanvasRenderingContext2D) {
    const snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");  /* 此处是雪花颜色，默认是白色 */
    snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)"); /* 若要改为其他颜色，请自行查 */
    snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");    /* 找16进制的RGB 颜色代码。 */
    ctx.save();
    ctx.fillStyle = snowFlake;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

}
