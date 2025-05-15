interface WaveViewSettings {
  elem?: string | HTMLElement;
  width?: number;
  height?: number;
  compatibleCanvas?: HTMLCanvasElement;
  scale?: number;
  speed?: number;
  phase?: number;
  fps?: number;
  keep?: boolean;
  lineWidth?: number;
  linear1?: any[];
  linear2?: any[];
  linearBg?: any[];
}

export class WaveView {
  private set: WaveViewSettings;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private linear1: CanvasGradient;
  private linear2: CanvasGradient;
  private linearBg: CanvasGradient;
  private _phase = 0;
  private timer: number | null = null;
  private drawTime = 0;
  private pcmData: Float32Array = new Float32Array(0);
  private pcmPos = 0;
  private sampleRate: number = 0;
  private inputTime = 0;

  constructor(set: WaveViewSettings) {
    this.set = {
      scale: window.devicePixelRatio || 2,
      speed: 9,
      phase: 21.8,
      fps: 20,
      keep: true,
      lineWidth: 3,
      linear1: [
        0,
        'rgba(150,96,238,1)',
        0.2,
        'rgba(170,79,249,1)',
        1,
        'rgba(53,199,253,1)',
      ],
      linear2: [0, 'rgba(209,130,255,0.6)', 1, 'rgba(53,199,255,0.6)'],
      linearBg: [0, 'rgba(255,255,255,0.2)', 1, 'rgba(54,197,252,0.2)'],
      ...set,
    };

    const { compatibleCanvas } = this.set;

    if (compatibleCanvas) {
      this.canvas = compatibleCanvas;
    } else {
      // 浏览器环境特定的初始化
      const elem = this.getHTMLElement();
      this.initCanvas(elem);
    }

    this.initContext();
  }

  private getHTMLElement(): HTMLElement | undefined {
    const { elem } = this.set;

    if (!elem) return undefined;

    if (typeof elem === 'string') {
      return document.querySelector(elem) as HTMLElement;
    } else if (elem instanceof HTMLElement) {
      return elem;
    }
    return elem[0] as HTMLElement;
  }

  private initCanvas(elem: HTMLElement | undefined): void {
    if (elem) {
      // 如果提供了元素，使用其尺寸
      if (!this.set.width) this.set.width = elem.offsetWidth;
      if (!this.set.height) this.set.height = elem.offsetHeight;

      // 创建canvas容器
      const container = document.createElement('div');
      container.style.fontSize = '0';
      container.innerHTML = '<canvas style="width:100%;height:100%;"></canvas>';

      this.canvas = container.querySelector('canvas') as HTMLCanvasElement;

      // 将canvas添加到目标元素中
      if (elem) {
        elem.innerHTML = '';
        elem.appendChild(container);
      }
    } else {
      // 没有提供元素，创建一个新的canvas
      this.canvas = document.createElement('canvas');
    }
  }

  private initContext(): void {
    const { width, height, scale = 2 } = this.set;

    if (!width || !height) {
      throw new Error('Width and height must be provided');
    }

    const canvasWidth = width * scale;
    const canvasHeight = height * scale;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    const ctx = (this.ctx = this.canvas.getContext('2d')!);

    // 初始化渐变色
    this.linear1 = this.genLinear(ctx, canvasWidth, this.set.linear1 || []);
    this.linear2 = this.genLinear(ctx, canvasWidth, this.set.linear2 || []);
    this.linearBg = this.genLinear(
      ctx,
      canvasHeight,
      this.set.linearBg || [],
      true,
    );
  }

  private genLinear(
    ctx: CanvasRenderingContext2D,
    size: number,
    colors: any[],
    top: boolean = false,
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(
      0,
      0,
      top ? 0 : size,
      top ? size : 0,
    );

    for (let i = 0; i < colors.length; ) {
      gradient.addColorStop(colors[i++], colors[i++]);
    }

    return gradient;
  }

  public genPath(
    frequency: number,
    amplitude: number,
    phase: number,
  ): number[] {
    const path: number[] = [];
    const { width, height, scale } = this.set;
    const actualWidth = (width || 0) * scale;
    const maxAmplitude = ((height || 0) * scale) / 2;

    for (let x = 0; x <= actualWidth; x += scale) {
      const scaling =
        (1 + Math.cos(Math.PI + (x / actualWidth) * 2 * Math.PI)) / 2;
      const y =
        scaling *
          maxAmplitude *
          amplitude *
          Math.sin(2 * Math.PI * (x / actualWidth) * frequency + phase) +
        maxAmplitude;
      path.push(y);
    }

    return path;
  }

  public input(
    pcmData: Float32Array,
    powerLevel: number,
    sampleRate: number,
  ): void {
    this.sampleRate = sampleRate;
    this.pcmData = pcmData;
    this.pcmPos = 0;

    this.inputTime = Date.now();
    this.schedule();
  }

  private schedule(): void {
    const interval = Math.floor(1000 / (this.set.fps || 20));

    if (!this.timer) {
      this.timer = window.setInterval(() => {
        this.schedule();
      }, interval) as unknown as number;
    }

    const now = Date.now();

    if (now - this.drawTime < interval) {
      // 没到间隔时间，不绘制
      return;
    }

    this.drawTime = now;

    // 切分当前需要的绘制数据
    const bufferSize = this.sampleRate / (this.set.fps || 20);
    const pcm = this.pcmData;
    let pos = this.pcmPos;
    const len = Math.max(0, Math.min(bufferSize, pcm.length - pos));

    let sum = 0;
    for (let i = 0; i < len; i++, pos++) {
      sum += Math.abs(pcm[pos]);
    }

    this.pcmPos = pos;

    // 推入绘制
    if (len || !(this.set.keep || false)) {
      this.draw(sum / (len || 1));
    }

    if (!len && now - this.inputTime > 1300) {
      // 超时没有输入，清除定时器
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  public draw(powerLevel: number): void {
    const { width, height, scale, speed, phase, lineWidth } = this.set;
    const actualWidth = (width || 0) * (scale || 2);
    const actualHeight = (height || 0) * (scale || 2);

    const ctx = this.ctx;
    const speedx = (speed || 0) / (this.set.fps || 20);
    const amplitude = powerLevel / 100;

    this._phase -= speedx; // 位移速度

    const path1 = this.genPath(2, amplitude, this._phase);
    const path2 = this.genPath(
      1.8,
      amplitude,
      this._phase + speedx * (phase || 0),
    );

    // 清除画布
    ctx.clearRect(0, 0, actualWidth, actualHeight);

    // 绘制包围背景
    ctx.beginPath();
    for (let i = 0, x = 0; x <= actualWidth; i++, x += scale || 2) {
      if (x === 0) {
        ctx.moveTo(x, path1[i]);
      } else {
        ctx.lineTo(x, path1[i]);
      }
    }

    let i = path1.length - 1;
    for (let x = actualWidth - 1; x >= 0; i--, x -= scale || 2) {
      ctx.lineTo(x, path2[i]);
    }

    ctx.closePath();
    ctx.fillStyle = this.linearBg;
    ctx.fill();

    // 绘制线
    this.drawPath(path2, this.linear2);
    this.drawPath(path1, this.linear1);
  }

  private drawPath(path: number[], linear: CanvasGradient): void {
    const { width, scale, lineWidth } = this.set;
    const actualWidth = (width || 0) * (scale || 2);

    const ctx = this.ctx;

    ctx.beginPath();
    for (let i = 0, x = 0; x <= actualWidth; i++, x += scale || 2) {
      if (x === 0) {
        ctx.moveTo(x, path[i]);
      } else {
        ctx.lineTo(x, path[i]);
      }
    }

    ctx.lineWidth = (lineWidth || 0) * (scale || 2);
    ctx.strokeStyle = linear;
    ctx.stroke();
  }
}
