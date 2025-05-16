interface WaveViewInitOptions {
  compatibleCanvas: HTMLCanvasElement; // 必填：canvas 元素
  width?: number;
  height?: number;
  scale?: number; // 缩放系数，提升清晰度
  speed?: number; // 波浪移动速度
  phase?: number; // 初始相位偏移
  fps?: number; // 帧率
  keep?: boolean; // 是否保持停止输入时的波形
  lineWidth?: number; // 线宽
  linear1?: [number, string, ...any[]]; // 渐变色配置
  linear2?: [number, string, ...any[]];
  linearBg?: [number, string, ...any[]];
}

class WaveView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private linear1: CanvasGradient;
  private linear2: CanvasGradient;
  private linearBg: CanvasGradient;
  private _phase: number = 0;
  private timer: NodeJS.Timer | null = null;
  private pcmData: Float32Array | null = null;
  private sampleRate: number = 0;
  private drawTime: number = 0;
  private inputTime: number = 0;
  private pcmPos: number = 0;
  private set: Required<WaveViewInitOptions>;

  constructor(set: WaveViewInitOptions) {
    const defaultOptions: Required<WaveViewInitOptions> = {
      compatibleCanvas: set.compatibleCanvas,
      width: set.width || 400,
      height: set.height || 100,
      scale: set.scale || window.devicePixelRatio,
      speed: set.speed || 9,
      phase: set.phase || 21.8,
      fps: set.fps || 20,
      keep: set.keep !== undefined ? set.keep : true,
      lineWidth: set.lineWidth || 3,
      linear1: set.linear1 || [
        0,
        'rgba(150,96,238,1)',
        0.2,
        'rgba(170,79,249,1)',
        1,
        'rgba(53,199,253,1)',
      ],
      linear2: set.linear2 || [
        0,
        'rgba(209,130,255,0.6)',
        1,
        'rgba(53,199,255,0.6)',
      ],
      linearBg: set.linearBg || [
        0,
        'rgba(255,255,255,0.2)',
        1,
        'rgba(54,197,252,0.2)',
      ],
    };

    this.set = defaultOptions;

    if (!this.set.compatibleCanvas) {
      throw new Error('compatibleCanvas is required');
    }

    this.canvas = this.set.compatibleCanvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.width = this.set.width * this.set.scale;
    this.height = this.set.height * this.set.scale;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.linear1 = this.createLinearGradient(
      this.ctx,
      this.width,
      this.set.linear1,
    );
    this.linear2 = this.createLinearGradient(
      this.ctx,
      this.width,
      this.set.linear2,
    );
    this.linearBg = this.createLinearGradient(
      this.ctx,
      this.height,
      this.set.linearBg,
      true,
    );
  }

  private createLinearGradient(
    ctx: CanvasRenderingContext2D,
    size: number,
    colors: any[],
    vertical = false,
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(
      vertical ? 0 : 0,
      vertical ? 0 : size,
      vertical ? size : 0,
      vertical ? size : 0,
    );
    for (let i = 0; i < colors.length; ) {
      gradient.addColorStop(colors[i++], colors[i++] as string);
    }
    return gradient;
  }

  private genPath(
    frequency: number,
    amplitude: number,
    phase: number,
  ): number[] {
    const { width, height, set } = this;
    const maxAmplitude = height / 2;
    const path: number[] = [];

    for (let x = 0; x <= width; x += set.scale!) {
      const scaling = (1 + Math.cos(Math.PI + (x / width) * 2 * Math.PI)) / 2;
      const y =
        scaling *
          maxAmplitude *
          amplitude *
          Math.sin(2 * Math.PI * (x / width) * frequency + phase) +
        maxAmplitude;
      path.push(y);
    }

    return path;
  }

  static PowerLevel(sum: number, length: number): number {
    if (length === 0) return 0;
    return (Math.sqrt(sum / length) / 0.02) * 100; // 归一化到 0-100 范围
  }

  input(pcmData: Float32Array, powerLevel: number, sampleRate: number): void {
    this.sampleRate = sampleRate;
    this.pcmData = pcmData;
    this.pcmPos = 0;
    this.inputTime = Date.now();
    this.schedule();
  }

  schedule(): void {
    const { fps, keep } = this.set;
    const interval = Math.floor(1000 / fps);

    if (!this.timer) {
      this.timer = setInterval(() => this.schedule(), interval);
    }

    const now = Date.now();
    if (now - this.drawTime < interval) return;
    this.drawTime = now;

    const bufferSize = Math.floor(this.sampleRate / fps);
    const pcm = this.pcmData!;
    let pos = this.pcmPos;
    const len = Math.max(0, Math.min(bufferSize, pcm.length - pos));

    let sum = 0;
    for (let i = 0; i < len; i++, pos++) {
      sum += Math.abs(pcm[pos]);
    }
    this.pcmPos = pos;

    if (len || !keep) {
      this.draw(WaveView.PowerLevel(sum, len));
    }

    if (!len && now - this.inputTime > 1300) {
      clearInterval(Number(this.timer));
      this.timer = null;
    }
  }

  draw(powerLevel: number): void {
    const { ctx, width, height, set } = this;
    const { speed, phase, fps } = set;
    const amplitude = powerLevel / 100;

    this._phase -= speed / fps;
    const phase2 = this._phase + (speed / fps) * phase;

    const path1 = this.genPath(2, amplitude, this._phase);
    const path2 = this.genPath(1.8, amplitude, phase2);

    ctx.clearRect(0, 0, width, height);

    // 绘制背景填充
    ctx.beginPath();
    for (let i = 0, x = 0; x <= width; i++, x += set.scale!) {
      if (x === 0) {
        ctx.moveTo(x, path1[i]);
      } else {
        ctx.lineTo(x, path1[i]);
      }
    }
    for (
      let x = width - 1, i = path2.length - 1;
      x >= 0;
      i--, x -= set.scale!
    ) {
      ctx.lineTo(x, path2[i]);
    }
    ctx.closePath();
    ctx.fillStyle = this.linearBg;
    ctx.fill();

    // 绘制波形线条
    this.drawPath(path2, this.linear2);
    this.drawPath(path1, this.linear1);
  }

  private drawPath(path: number[], color: CanvasGradient): void {
    const { ctx, set } = this;
    const { scale } = set;

    ctx.beginPath();
    for (let i = 0, x = 0; x <= this.width; i++, x += scale!) {
      if (x === 0) {
        ctx.moveTo(x, path[i]);
      } else {
        ctx.lineTo(x, path[i]);
      }
    }

    ctx.lineWidth = set.lineWidth! * scale!;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

export default WaveView;
