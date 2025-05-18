// FFT 相关类型定义
interface FFTInstance {
  transform: (inBuffer: Int16Array) => Float64Array;
  bufferSize: number;
}

// FFT 实现
class FFT {
  private FFT_N_LOG: number;
  private FFT_N: number;
  private MINY: number;
  private real: number[];
  private imag: number[];
  private sintable: number[];
  private costable: number[];
  private bitReverse: number[];

  constructor(bufferSize: number) {
    this.FFT_N_LOG = Math.round(Math.log(bufferSize) / Math.log(2));
    this.FFT_N = 1 << this.FFT_N_LOG;
    this.MINY = (this.FFT_N << 2) * Math.sqrt(2);

    this.real = [];
    this.imag = [];
    this.sintable = [0];
    this.costable = [0];
    this.bitReverse = [];

    let i, j, k, reve;
    for (i = 0; i < this.FFT_N; i++) {
      k = i;
      for (j = 0, reve = 0; j != this.FFT_N_LOG; j++) {
        reve <<= 1;
        reve |= k & 1;
        k >>>= 1;
      }
      this.bitReverse[i] = reve;
    }

    const dt = (2 * Math.PI) / this.FFT_N;
    for (i = (this.FFT_N >> 1) - 1; i > 0; i--) {
      const theta = i * dt;
      this.costable[i] = Math.cos(theta);
      this.sintable[i] = Math.sin(theta);
    }
  }

  public transform(inBuffer: Int16Array): Float64Array {
    let i,
      j,
      k,
      ir,
      j0 = 1,
      idx = this.FFT_N_LOG - 1;
    let cosv, sinv, tmpr, tmpi;

    for (i = 0; i < this.FFT_N; i++) {
      this.real[i] = inBuffer[this.bitReverse[i]];
      this.imag[i] = 0;
    }

    for (i = this.FFT_N_LOG; i != 0; i--) {
      for (j = 0; j != j0; j++) {
        cosv = this.costable[j << idx];
        sinv = this.sintable[j << idx];
        for (k = j; k < this.FFT_N; k += j0 << 1) {
          ir = k + j0;
          tmpr = cosv * this.real[ir] - sinv * this.imag[ir];
          tmpi = cosv * this.imag[ir] + sinv * this.real[ir];
          this.real[ir] = this.real[k] - tmpr;
          this.imag[ir] = this.imag[k] - tmpi;
          this.real[k] += tmpr;
          this.imag[k] += tmpi;
        }
      }
      j0 <<= 1;
      idx--;
    }

    const outLength = this.FFT_N >> 1;
    const outBuffer = new Float64Array(outLength);
    sinv = this.MINY;
    cosv = -this.MINY;

    for (i = outLength; i != 0; i--) {
      tmpr = this.real[i];
      tmpi = this.imag[i];
      if (tmpr > cosv && tmpr < sinv && tmpi > cosv && tmpi < sinv) {
        outBuffer[i - 1] = 0;
      } else {
        outBuffer[i - 1] = Math.round(tmpr * tmpr + tmpi * tmpi);
      }
    }

    return outBuffer;
  }

  get bufferSize(): number {
    return this.FFT_N;
  }
}

// 频谱图选项接口
interface FrequencyHistogramViewOptions {
  width?: number;
  height?: number;
  compatibleCanvas: HTMLCanvasElement;
  scale?: number;
  fps?: number;
  lineCount?: number;
  widthRatio?: number;
  spaceWidth?: number;
  minHeight?: number;
  position?: number;
  mirrorEnable?: boolean;
  stripeEnable?: boolean;
  stripeHeight?: number;
  stripeMargin?: number;
  fallDuration?: number;
  stripeFallDuration?: number;
  linear?: (number | string)[];
  stripeLinear?: (number | string)[] | null;
  shadowBlur?: number;
  shadowColor?: string;
  stripeShadowBlur?: number;
  stripeShadowColor?: string;
  fullFreq?: boolean;
  onDraw?: (frequencyData: Float64Array, sampleRate: number) => void;
}

// 频谱图实现
class FrequencyHistogramView {
  private set: FrequencyHistogramViewOptions;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fft: FFT;
  private lastH: number[] = [];
  private stripesH: number[] = [];
  private timer: NodeJS.Timer | null = null;
  private pcmData?: Int16Array;
  private pcmPos: number = 0;
  private sampleRate: number = 44100;
  private drawTime: number = 0;
  private inputTime: number = 0;

  constructor(options: FrequencyHistogramViewOptions) {
    this.set = {
      scale: window.devicePixelRatio,
      fps: 20,
      lineCount: 30,
      widthRatio: 0.6,
      spaceWidth: 0,
      minHeight: 0,
      position: -1,
      mirrorEnable: false,
      stripeEnable: true,
      stripeHeight: 3,
      stripeMargin: 6,
      fallDuration: 1000,
      stripeFallDuration: 3500,
      linear: [
        0,
        'rgba(0,187,17,1)',
        0.5,
        'rgba(255,215,0,1)',
        1,
        'rgba(255,102,0,1)',
      ],
      stripeLinear: null,
      shadowBlur: 0,
      shadowColor: '#bbb',
      stripeShadowBlur: -1,
      stripeShadowColor: '',
      fullFreq: false,
      onDraw: () => {},
      ...options,
    };

    this.canvas = this.set.compatibleCanvas;

    const scale = this.set.scale!;
    const width = (this.set.width || this.canvas.clientWidth) * scale;
    const height = (this.set.height || this.canvas.clientHeight) * scale;

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.fft = new FFT(1024);
  }

  private genLinear(
    ctx: CanvasRenderingContext2D,
    colors: (number | string)[],
    from: number,
    to: number,
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, from, 0, to);
    for (let i = 0; i < colors.length; ) {
      gradient.addColorStop(colors[i++] as number, colors[i++] as string);
    }
    return gradient;
  }

  public input(
    pcmData: Int16Array,
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
    const interval = Math.floor(1000 / this.set.fps!);
    if (!this.timer) {
      this.timer = setInterval(() => this.schedule(), interval);
    }

    const now = Date.now();
    if (now - this.inputTime > this.set.stripeFallDuration! * 1.3) {
      clearInterval(this.timer);
      this.timer = null;
      this.lastH = [];
      this.stripesH = [];
      this.draw(null, this.sampleRate);
      return;
    }

    if (now - this.drawTime < interval) {
      return;
    }
    this.drawTime = now;

    const bufferSize = this.fft.bufferSize;
    const pcm = this.pcmData;
    if (!pcm) return;

    const arr = new Int16Array(bufferSize);
    for (
      let i = 0;
      i < bufferSize && this.pcmPos < pcm.length;
      i++, this.pcmPos++
    ) {
      arr[i] = pcm[this.pcmPos];
    }

    const frequencyData = this.fft.transform(arr);
    this.draw(frequencyData, this.sampleRate);
  }
  private draw(frequencyData: Float64Array | null, sampleRate: number): void {
    const set = this.set;
    const ctx = this.ctx;
    const scale = set.scale!;
    const width = set.width! * scale;
    const height = set.height! * scale;
    const lineCount = set.lineCount!;
    const bufferSize = this.fft.bufferSize;

    // 计算高度位置
    const position = set.position!;
    const posAbs = Math.abs(position);
    let originY = position === 1 ? 0 : height; // y轴原点
    let heightY = height; // 最高的一边高度

    if (posAbs < 1) {
      heightY = heightY / 2;
      originY = heightY;
      heightY = Math.floor(heightY * (1 + posAbs));
      originY = Math.floor(
        position > 0 ? originY * (1 - posAbs) : originY * (1 + posAbs),
      );
    }

    const lastH = this.lastH;
    const stripesH = this.stripesH;
    const speed = Math.ceil(heightY / (set.fallDuration! / (1000 / set.fps!)));
    const stripeSpeed = Math.ceil(
      heightY / (set.stripeFallDuration! / (1000 / set.fps!)),
    );
    const stripeMargin = set.stripeMargin! * scale;

    const Y0 = 1 << (Math.round(Math.log(bufferSize) / Math.log(2) + 3) << 1);
    const logY0 = Math.log(Y0) / Math.log(10);
    const dBmax = (20 * Math.log(0x7fff)) / Math.log(10);

    let fftSize = bufferSize / 2;
    let fftSize5k = fftSize;

    if (!set.fullFreq) {
      // 非绘制所有频率时，计算5khz所在位置，8000采样率及以下最高只有4khz
      fftSize5k = Math.min(
        fftSize,
        Math.floor((fftSize * 5000) / (sampleRate / 2)),
      );
    }

    const isFullFreq = fftSize5k === fftSize;
    const line80 = isFullFreq ? lineCount : Math.round(lineCount * 0.8); // 80%的柱子位置
    const fftSizeStep1 = fftSize5k / line80;
    const fftSizeStep2 = isFullFreq
      ? 0
      : (fftSize - fftSize5k) / (lineCount - line80);
    let fftIdx = 0;

    for (let i = 0; i < lineCount; i++) {
      // !fullFreq 时不采用非线性划分频段，录音语音并不适用于音乐的频率，应当弱化高频部分
      // 80%关注0-5khz主要人声部分 20%关注剩下的高频，这样不管什么采样率都能做到大部分频率显示一致
      let start = Math.ceil(fftIdx);
      if (i < line80) {
        // 5khz以下
        fftIdx += fftSizeStep1;
      } else {
        // 5khz以上
        fftIdx += fftSizeStep2;
      }

      let end = Math.ceil(fftIdx);
      if (end === start) end++;
      end = Math.min(end, fftSize);

      // 查找当前频段的最大"幅值"
      let maxAmp = 0;
      if (frequencyData) {
        for (let j = start; j < end; j++) {
          maxAmp = Math.max(maxAmp, Math.abs(frequencyData[j]));
        }
      }

      // 计算音量
      const dB =
        maxAmp > Y0
          ? Math.floor((Math.log(maxAmp) / Math.log(10) - logY0) * 17)
          : 0;
      let h = heightY * Math.min(dB / dBmax, 1);

      // 使柱子匀速下降
      lastH[i] = (lastH[i] || 0) - speed;
      if (h < lastH[i]) h = lastH[i];
      if (h < 0) h = 0;
      lastH[i] = h;

      const shi = stripesH[i] || 0;
      if (h && h + stripeMargin > shi) {
        stripesH[i] = h + stripeMargin;
      } else {
        // 使峰值小横条匀速度下落
        let sh = shi - stripeSpeed;
        if (sh < 0) sh = 0;
        stripesH[i] = sh;
      }
    }

    // 开始绘制图形
    ctx.clearRect(0, 0, width, height);

    const linear1 = this.genLinear(
      ctx,
      set.linear!,
      originY,
      originY - heightY,
    ); // 上半部分的填充
    const stripeLinear1 =
      (set.stripeLinear &&
        this.genLinear(ctx, set.stripeLinear, originY, originY - heightY)) ||
      linear1; // 上半部分的峰值小横条填充

    const linear2 = this.genLinear(
      ctx,
      set.linear!,
      originY,
      originY + heightY,
    ); // 下半部分的填充
    const stripeLinear2 =
      (set.stripeLinear &&
        this.genLinear(ctx, set.stripeLinear, originY, originY + heightY)) ||
      linear2; // 下半部分的峰值小横条填充

    // 计算柱子间距
    const mirrorEnable = set.mirrorEnable!;
    const mirrorCount = mirrorEnable ? lineCount * 2 - 1 : lineCount; // 镜像柱子数量翻一倍-1根

    let widthRatio = set.widthRatio!;
    const spaceWidth = set.spaceWidth! * scale;
    if (spaceWidth !== 0) {
      widthRatio = (width - spaceWidth * (mirrorCount + 1)) / width;
    }

    let lineFloat = 0;
    let spaceFloat = 0;

    for (let i = 0; i < 2; i++) {
      lineFloat = Math.max(1 * scale, (width * widthRatio) / mirrorCount); // 柱子宽度至少1个单位
      const lineWN = Math.floor(lineFloat);
      const lineWF = lineFloat - lineWN; // 提取出小数部分
      spaceFloat = (width - mirrorCount * lineFloat) / (mirrorCount + 1); // 均匀间隔，首尾都留空，可能为负数，柱子将发生重叠
      if (spaceFloat > 0 && spaceFloat < 1) {
        widthRatio = 1;
        spaceFloat = 0; // 不够一个像素，丢弃不绘制间隔，重新计算
      } else break;
    }

    // 绘制
    const minHeight = set.minHeight! * scale;
    const XFloat = mirrorEnable
      ? (width - Math.floor(lineFloat)) / 2 - spaceFloat
      : 0; // 镜像时，中间柱子位于正中心

    for (let iMirror = 0; iMirror < 2; iMirror++) {
      if (iMirror) {
        ctx.save();
        ctx.scale(-1, 1);
      }

      const xMirror = iMirror ? width : 0; // 绘制镜像部分

      // 绘制柱子
      ctx.shadowBlur = set.shadowBlur! * scale;
      ctx.shadowColor = set.shadowColor!;

      let xFloat = XFloat;
      let wFloat = 0;

      for (let i = 0; i < lineCount; i++) {
        xFloat += spaceFloat;
        const x = Math.floor(xFloat) - xMirror;
        let w = Math.floor(lineFloat);
        wFloat += lineFloat - Math.floor(lineFloat);
        if (wFloat >= 1) {
          w++;
          wFloat--;
        }
        const h = Math.max(lastH[i], minHeight);

        // 绘制上半部分
        if (originY !== 0) {
          const y = originY - h;
          ctx.fillStyle = linear1;
          ctx.fillRect(x, y, w, h);
        }

        // 绘制下半部分
        if (originY !== height) {
          ctx.fillStyle = linear2;
          ctx.fillRect(x, originY, w, h);
        }

        xFloat += w;
      }

      // 绘制柱子顶上峰值小横条
      if (set.stripeEnable) {
        const stripeShadowBlur = set.stripeShadowBlur!;
        ctx.shadowBlur =
          (stripeShadowBlur === -1 ? set.shadowBlur : stripeShadowBlur) * scale;
        ctx.shadowColor = set.stripeShadowColor || set.shadowColor!;
        const stripeHeight = set.stripeHeight! * scale;

        xFloat = XFloat;
        wFloat = 0;

        for (let i = 0; i < lineCount; i++) {
          xFloat += spaceFloat;
          const x = Math.floor(xFloat) - xMirror;
          let w = Math.floor(lineFloat);
          wFloat += lineFloat - Math.floor(lineFloat);
          if (wFloat >= 1) {
            w++;
            wFloat--;
          }
          const h = stripesH[i];

          // 绘制上半部分
          if (originY !== 0) {
            let y = originY - h - stripeHeight;
            if (y < 0) y = 0;
            ctx.fillStyle = stripeLinear1;
            ctx.fillRect(x, y, w, stripeHeight);
          }

          // 绘制下半部分
          if (originY !== height) {
            let y = originY + h;
            if (y + stripeHeight > height) {
              y = height - stripeHeight;
            }
            ctx.fillStyle = stripeLinear2;
            ctx.fillRect(x, y, w, stripeHeight);
          }

          xFloat += w;
        }
      }

      if (iMirror) ctx.restore();
      if (!mirrorEnable) break;
    }

    if (frequencyData) {
      set.onDraw?.(frequencyData, sampleRate);
    }
  }
  public reset(): void {
    // 重置数据相关的状态
    this.pcmData = undefined;
    this.pcmPos = 0;
    this.sampleRate = 44100;
    this.lastH = [];
    this.stripesH = [];

    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // 重置时间相关的状态
    this.drawTime = 0;
    this.inputTime = 0;

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default FrequencyHistogramView;
