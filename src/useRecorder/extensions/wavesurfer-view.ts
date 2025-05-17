interface WaveViewOptions {
  elem?: string | HTMLElement;
  width: number;
  height: number;
  scale?: number;
  fps?: number;
  duration?: number;
  direction?: number;
  position?: number;
  centerHeight?: number;
  linear?: (number | string)[];
  centerColor?: string;
}

class WaveView {
  private set: WaveViewOptions;
  private elem?: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private canvas2: HTMLCanvasElement;
  private ctx2: CanvasRenderingContext2D;
  private timer: NodeJS.Timer | null = null;
  private pcmData: Int16Array | null = null;
  private pcmPos: number = 0;
  private sampleRate: number = 44100;
  private drawTime: number = 0;
  private drawLoss: number = 0;
  private x: number = 0;
  private inputTime: number = 0;

  constructor(options: WaveViewOptions) {
    this.set = {
      scale: 2,
      fps: 50,
      duration: 2500,
      direction: 1,
      position: 0,
      centerHeight: 1,
      linear: [
        0,
        'rgba(0,187,17,1)',
        0.7,
        'rgba(255,215,0,1)',
        1,
        'rgba(255,102,0,1)',
      ],
      centerColor: '',
      ...options,
    };

    let elem = this.set.elem;
    if (elem) {
      if (typeof elem === 'string') {
        elem = document.querySelector(elem) as HTMLElement;
      } else if ((elem as any).length) {
        elem = (elem as any)[0];
      }
      if (elem) {
        this.set.width = elem.offsetWidth;
        this.set.height = elem.offsetHeight;
      }
    }

    const thisElem = (this.elem = document.createElement('div'));
    thisElem.style.fontSize = '0';
    thisElem.innerHTML = '<canvas style="width:100%;height:100%;"/>';

    this.canvas = thisElem.querySelector('canvas')!;
    this.canvas2 = document.createElement('canvas');

    if (elem) {
      elem.innerHTML = '';
      elem.appendChild(thisElem);
    }

    const scale = this.set.scale!;
    const width = this.set.width * scale;
    const height = this.set.height * scale;

    if (!width || !height) {
      throw new Error('WaveView width=0 height=0');
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;

    this.canvas2.width = width * 2; // 卷轴，后台绘制画布能容纳两块窗口内容，进行无缝滚动
    this.canvas2.height = height;
    this.ctx2 = this.canvas2.getContext('2d')!;
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
    if (now - this.drawTime < interval) {
      return;
    }
    this.drawTime = now;

    const bufferSize = this.sampleRate / this.set.fps!;
    const pcm = this.pcmData;
    if (!pcm) return;

    const pos = this.pcmPos;
    const arr = new Int16Array(Math.min(bufferSize, pcm.length - pos));
    for (let i = 0; i < arr.length; i++, this.pcmPos++) {
      arr[i] = pcm[this.pcmPos];
    }

    if (arr.length) {
      this.draw(arr);
    } else if (now - this.inputTime > 1300) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private draw(pcmData: Int16Array): void {
    const set = this.set;
    const ctx = this.ctx2;
    const scale = set.scale!;
    const width = set.width * scale;
    const width2 = width * 2;
    const height = set.height * scale;
    const lineWidth = 1 * scale;

    // 计算高度位置
    const position = set.position!;
    const posAbs = Math.abs(position);
    let originY = position === 1 ? 0 : height;
    let heightY = height;

    if (posAbs < 1) {
      heightY = heightY / 2;
      originY = heightY;
      heightY = Math.floor(heightY * (1 + posAbs));
      originY = Math.floor(
        position > 0 ? originY * (1 - posAbs) : originY * (1 + posAbs),
      );
    }

    // 计算绘制占用长度
    const pcmDuration = (pcmData.length * 1000) / this.sampleRate;
    let pcmWidth = (pcmDuration * width) / set.duration!;
    pcmWidth += this.drawLoss || 0;
    let pointCount = 0;

    if (pcmWidth < lineWidth) {
      this.drawLoss = pcmWidth;
    } else {
      this.drawLoss = 0;
      pointCount = Math.floor(pcmWidth / lineWidth);
    }

    // 后台卷轴连续绘制
    const linear1 = this.genLinear(
      ctx,
      set.linear!,
      originY,
      originY - heightY,
    );
    const linear2 = this.genLinear(
      ctx,
      set.linear!,
      originY,
      originY + heightY,
    );

    let x = this.x;
    const step = pcmData.length / pointCount;

    for (let i = 0, idx = 0; i < pointCount; i++) {
      const j = Math.floor(idx);
      const end = Math.floor(idx + step);
      idx += step;

      // 寻找区间内最大值
      let max = 0;
      for (let k = j; k < end; k++) {
        max = Math.max(max, Math.abs(pcmData[k]));
      }

      // 计算高度
      const h = heightY * Math.min(1, max / 0x7fff);

      // 绘制当前线条
      if (originY !== 0) {
        ctx.fillStyle = linear1;
        ctx.fillRect(x, originY - h, lineWidth, h);
      }
      if (originY !== height) {
        ctx.fillStyle = linear2;
        ctx.fillRect(x, originY, lineWidth, h);
      }

      x += lineWidth;
      if (x >= width2) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(
          this.canvas2,
          width,
          0,
          width,
          height,
          0,
          0,
          width,
          height,
        );
        ctx.clearRect(width, 0, width, height);
        x = width;
      }
    }
    this.x = x;

    // 画回到显示区域
    const displayCtx = this.ctx;
    displayCtx.clearRect(0, 0, width, height);

    // 绘制中线
    const centerHeight = set.centerHeight! * scale;
    if (centerHeight) {
      let y = originY - Math.floor(centerHeight / 2);
      y = Math.max(y, 0);
      y = Math.min(y, height - centerHeight);

      displayCtx.fillStyle = set.centerColor || set.linear![1];
      displayCtx.fillRect(0, y, width, centerHeight);
    }

    // 画回画布
    let srcX = 0;
    let srcW = x;
    let destX = 0;

    if (srcW > width) {
      srcX = srcW - width;
      srcW = width;
    } else {
      destX = width - srcW;
    }

    if (set.direction === -1) {
      displayCtx.drawImage(
        this.canvas2,
        srcX,
        0,
        srcW,
        height,
        destX,
        0,
        srcW,
        height,
      );
    } else {
      displayCtx.save();
      displayCtx.scale(-1, 1);
      displayCtx.drawImage(
        this.canvas2,
        srcX,
        0,
        srcW,
        height,
        -width + destX,
        0,
        srcW,
        height,
      );
      displayCtx.restore();
    }
  }

  public reset(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default WaveView;
