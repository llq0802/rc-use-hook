/**
 * 波形视图配置选项接口
 */
interface WaveViewOptions {
  /** 必填：用于绘制的 canvas 元素 */
  compatibleCanvas: HTMLCanvasElement;

  /** 可选：canvas 绘制区域的宽度，默认为 canvas 元素的 clientWidth */
  width?: number;

  /** 可选：canvas 绘制区域的高度，默认为 canvas 元素的 clientHeight */
  height?: number;

  /** 可选：缩放比例，通常用于高分辨率屏幕，默认为 window.devicePixelRatio */
  scale?: number;

  /**
   * 可选：波浪移动速度，值越大越快。
   *
   * 默认值为 `9`
   */
  speed?: number;

  /**
   * 可选：初始相位偏移。
   *
   * 调整了速度后，调整这个值得到一个看起来舒服的波形。
   */
  phase?: number;

  /**
   * 可选：每秒帧数，控制绘图频率。
   *
   * 默认为系统自动计算
   */
  fps?: number;

  /**
   * 可选：是否保持停止输入时的波形。
   *
   * 如果为 true，则在没有新数据输入时保持当前波形不消失。
   */
  keep?: boolean;

  /**
   * 可选：波形线条宽度。
   *
   * 默认为 `1`
   */
  lineWidth?: number;

  /**
   * 可选：波形上半部分的颜色渐变配置数组。
   *
   * 格式为 [位置, CSS 颜色, ...]；
   * 位置取值范围 0.0-1.0 之间。
   */
  linear1?: [number, string, ...any[]];

  /**
   * 可选：波形下半部分的颜色渐变配置数组。
   *
   * 格式为 [位置, CSS 颜色, ...]；
   * 位置取值范围 0.0-1.0 之间。
   */
  linear2?: [number, string, ...any[]];

  /**
   * 可选：背景颜色渐变配置数组。
   *
   * 格式为 [位置, CSS 颜色, ...]；
   * 位置取值范围 0.0-1.0 之间。
   */
  linearBg?: [number, string, ...any[]];
}

export class WaveView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private linear1: CanvasGradient;
  private linear2: CanvasGradient;
  private linearBg: CanvasGradient;
  private _phase: number = 0;
  private timer: NodeJS.Timer | null = null;
  private pcmData: number[] | null = null;
  private sampleRate: number = 0;
  private drawTime: number = 0;
  private inputTime: number = 0;
  private pcmPos: number = 0;
  private set: Required<WaveViewOptions>;
  private currentAmplitude: number = 0; // 添加这个属性来跟踪当前振幅
  constructor(set: WaveViewOptions) {
    const defaultOptions: Required<WaveViewOptions> = {
      compatibleCanvas: set.compatibleCanvas,
      width: set.width || 0,
      height: set.height || 0,
      scale: set.scale || window.devicePixelRatio,
      speed: set.speed || 9,
      phase: set.phase || 21.8,
      fps: set.fps || 20,
      keep: set.keep || true,
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
    this.width = (this.set.width || this.canvas.clientWidth) * this.set.scale;
    this.height =
      (this.set.height || this.canvas.clientHeight) * this.set.scale;
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
    const maxAmplitude = height / 2.5; // 将最大振幅改为height的1/3，避免波形过大
    const path: number[] = [];

    for (let x = 0; x <= width; x += set.scale!) {
      const scaling = (1 + Math.cos(Math.PI + (x / width) * 2 * Math.PI)) / 2;
      const y =
        scaling *
          maxAmplitude *
          amplitude *
          Math.sin(2 * Math.PI * (x / width) * frequency + phase) +
        height / 2; // 将基线移到canvas中间
      path.push(y);
    }

    return path;
  }

  private schedule(): void {
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

  private draw(powerLevel: number): void {
    const { ctx, width, height, set } = this;
    const { speed, phase, fps } = set;
    // const amplitude = powerLevel / 100;
    // this._phase -= speed / fps;
    // const phase2 = this._phase + (speed / fps) * phase;

    // const path1 = this.genPath(2, amplitude, this._phase);
    // const path2 = this.genPath(1.8, amplitude, phase2);

    // 添加平滑过渡
    const targetAmplitude = powerLevel / 100;
    const smoothFactor = 0.5; // 调整这个值可以控制平滑程度（0-1之间）
    this.currentAmplitude +=
      (targetAmplitude - this.currentAmplitude) * smoothFactor;

    this._phase -= speed / fps;
    const phase2 = this._phase + (speed / fps) * phase;

    const path1 = this.genPath(2, this.currentAmplitude, this._phase);
    const path2 = this.genPath(1.8, this.currentAmplitude, phase2);

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
  static PowerLevel(sum: number, length: number): number {
    if (length === 0) return 0;
    return Math.min((Math.sqrt(sum / length) / 0.02) * 100, 100); // 限制最大值为100
  }
  input(pcmData: number[], powerLevel: number, sampleRate: number): void {
    this.sampleRate = sampleRate;
    this.pcmData = pcmData;
    this.pcmPos = 0;
    this.inputTime = Date.now();
    this.schedule();
  }

  reset(): void {
    // 重置所有状态
    this.pcmData = null;
    this.sampleRate = 0;
    this.pcmPos = 0;
    this.currentAmplitude = 0;
    this._phase = 0;

    // 清除定时器
    if (this.timer) {
      clearInterval(Number(this.timer));
      this.timer = null;
    }

    // 清空画布
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
