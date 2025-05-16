class WaveView {
  constructor(set) {
    const defaultOptions = {
      compatibleCanvas: null, // 必填：canvas 元素
      width: 400,
      height: 100,
      scale: 2,       // 缩放系数，提升清晰度
      speed: 9,       // 波浪移动速度
      phase: 21.8,    // 初始相位偏移
      fps: 20,        // 帧率
      keep: true,     // 是否保持停止输入时的波形
      lineWidth: 3,   // 线宽

      // 渐变色配置
      linear1: [0, "rgba(150,96,238,1)", 0.2, "rgba(170,79,249,1)", 1, "rgba(53,199,253,1)"],
      linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"],
      linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"],
    };

    this.set = { ...defaultOptions, ...set };
    const { compatibleCanvas, width, height, scale } = this.set;

    if (!compatibleCanvas) {
      throw new Error("compatibleCanvas is required");
    }

    this.canvas = compatibleCanvas;
    this.ctx = this.canvas.getContext("2d");

    this.width = width * scale;
    this.height = height * scale;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.linear1 = this.createLinearGradient(this.ctx, this.width, this.set.linear1);
    this.linear2 = this.createLinearGradient(this.ctx, this.width, this.set.linear2);
    this.linearBg = this.createLinearGradient(this.ctx, this.height, this.set.linearBg, true);

    this._phase = 0;
    this.timer = null;
    this.pcmData = null;
    this.sampleRate = 0;
    this.drawTime = 0;
    this.inputTime = 0;
    this.pcmPos = 0;
  }

  createLinearGradient(ctx, size, colors, vertical = false) {
    const gradient = ctx.createLinearGradient(
      0, 0,
      vertical ? 0 : size,
      vertical ? size : 0
    );
    for (let i = 0; i < colors.length;) {
      gradient.addColorStop(colors[i++], colors[i++]);
    }
    return gradient;
  }

  genPath(frequency, amplitude, phase) {
    const { width, height, scale } = this;
    const maxAmplitude = height / 2;
    const path = [];

    for (let x = 0; x <= width; x += scale) {
      const scaling = (1 + Math.cos(Math.PI + (x / width) * 2 * Math.PI)) / 2;
      const y = scaling * maxAmplitude * amplitude *
        Math.sin(2 * Math.PI * (x / width) * frequency + phase) + maxAmplitude;
      path.push(y);
    }

    return path;
  }

  input(pcmData, powerLevel, sampleRate) {
    this.sampleRate = sampleRate;
    this.pcmData = pcmData;
    this.pcmPos = 0;
    this.inputTime = Date.now();
    this.schedule();
  }

  schedule() {
    const { fps, keep } = this.set;
    const interval = Math.floor(1000 / fps);

    if (!this.timer) {
      this.timer = setInterval(() => this.schedule(), interval);
    }

    const now = Date.now();
    if (now - this.drawTime < interval) return;
    this.drawTime = now;

    const bufferSize = Math.floor(this.sampleRate / fps);
    const pcm = this.pcmData;
    let pos = this.pcmPos;
    const len = Math.max(0, Math.min(bufferSize, pcm.length - pos));

    let sum = 0;
    for (let i = 0; i < len; i++, pos++) {
      sum += Math.abs(pcm[pos]);
    }
    this.pcmPos = pos;

    if (len || !keep) {
      this.draw(Recorder.PowerLevel(sum, len));
    }

    if (!len && now - this.inputTime > 1300) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  draw(powerLevel) {
    const { ctx, width, height, set } = this;
    const { speed, phase, fps } = set;
    const amplitude = powerLevel / 100;

    this._phase -= speed / fps;
    const phase2 = this._phase + speed / fps * phase;

    const path1 = this.genPath(2, amplitude, this._phase);
    const path2 = this.genPath(1.8, amplitude, phase2);

    ctx.clearRect(0, 0, width, height);

    // 绘制背景填充
    ctx.beginPath();
    for (let i = 0, x = 0; x <= width; i++, x += set.scale) {
      if (x === 0) {
        ctx.moveTo(x, path1[i]);
      } else {
        ctx.lineTo(x, path1[i]);
      }
    }
    for (let x = width - 1, i = path2.length - 1; x >= 0; i--, x -= set.scale) {
      ctx.lineTo(x, path2[i]);
    }
    ctx.closePath();
    ctx.fillStyle = this.linearBg;
    ctx.fill();

    // 绘制波形线条
    this.drawPath(path2, this.linear2);
    this.drawPath(path1, this.linear1);
  }

  drawPath(path, color) {
    const { ctx, set } = this;
    const { scale } = set;

    ctx.beginPath();
    for (let i = 0, x = 0; x <= this.width; i++, x += scale) {
      if (x === 0) {
        ctx.moveTo(x, path[i]);
      } else {
        ctx.lineTo(x, path[i]);
      }
    }

    ctx.lineWidth = set.lineWidth * scale;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

// 如果你是通过 import 导出，请加上下面这句
export default WaveView;